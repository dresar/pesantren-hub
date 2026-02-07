import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, Plus, MoreHorizontal, Eye, CheckCircle, XCircle, Wallet, Image, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockPaymentsExtended, mockBankAccountsExtended } from '@/lib/mock-data-extended';
import { mockSantri, formatCurrency, formatDateTime } from '@/lib/mock-data';
import type { Payment, PaymentStatus, BankAccount } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPaymentsExtended);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccountsExtended);
  const [activeTab, setActiveTab] = useState('payments');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [verifyNote, setVerifyNote] = useState('');
  const [bankFormData, setBankFormData] = useState({
    nama_bank: '',
    nama_bank_custom: '',
    nomor_rekening: '',
    nama_pemilik_rekening: '',
    biaya_pendaftaran: 2500000,
    keterangan: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirm } = useAppStore();

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return payments;
    return payments.filter((p) => p.status === statusFilter);
  }, [payments, statusFilter]);

  const getSantriName = (santriId: string) => {
    const santri = mockSantri.find((s) => s.id === santriId);
    return santri?.nama_lengkap || 'Unknown';
  };

  const handleVerify = (payment: Payment) => {
    setSelectedPayment(payment);
    setVerifyNote('');
    setIsVerifyModalOpen(true);
  };

  const handleConfirmVerify = async (status: PaymentStatus) => {
    if (!selectedPayment) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? { ...p, status, catatan: verifyNote, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          : p
      )
    );
    toast.success(`Pembayaran ${status === 'verified' ? 'diverifikasi' : 'ditolak'}`);
    setIsSubmitting(false);
    setIsVerifyModalOpen(false);
  };

  const handleAddBank = () => {
    setEditingBank(null);
    setBankFormData({
      nama_bank: '',
      nama_bank_custom: '',
      nomor_rekening: '',
      nama_pemilik_rekening: '',
      biaya_pendaftaran: 2500000,
      keterangan: '',
      is_active: true,
    });
    setIsBankModalOpen(true);
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setBankFormData({
      nama_bank: bank.nama_bank,
      nama_bank_custom: bank.nama_bank_custom || '',
      nomor_rekening: bank.nomor_rekening,
      nama_pemilik_rekening: bank.nama_pemilik_rekening,
      biaya_pendaftaran: bank.biaya_pendaftaran,
      keterangan: bank.keterangan || '',
      is_active: bank.is_active,
    });
    setIsBankModalOpen(true);
  };

  const handleSaveBank = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    if (editingBank) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === editingBank.id ? { ...b, ...bankFormData, updated_at: new Date().toISOString() } : b
        )
      );
      toast.success('Rekening berhasil diperbarui');
    } else {
      const newBank: BankAccount = {
        id: String(Date.now()),
        ...bankFormData,
        order: bankAccounts.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBankAccounts((prev) => [...prev, newBank]);
      toast.success('Rekening berhasil ditambahkan');
    }
    setIsSubmitting(false);
    setIsBankModalOpen(false);
  };

  const paymentColumns: ColumnDef<Payment>[] = [
    getSelectionColumn<Payment>(),
    {
      accessorKey: 'santri_id',
      header: 'Santri',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{getSantriName(row.original.santri_id)}</p>
          <p className="text-xs text-muted-foreground">ID: {row.original.santri_id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'jumlah_transfer',
      header: 'Jumlah',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{formatCurrency(row.original.jumlah_transfer)}</span>
      ),
    },
    {
      accessorKey: 'bank_pengirim',
      header: 'Bank Pengirim',
      cell: ({ row }) => (
        <div>
          <p>{row.original.bank_pengirim}</p>
          <p className="text-xs text-muted-foreground">{row.original.no_rekening_pengirim}</p>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSelectedPayment(payment); setIsViewModalOpen(true); }}>
                <Eye className="mr-2 h-4 w-4" /> Detail
              </DropdownMenuItem>
              {payment.status === 'pending' && (
                <>
                  <DropdownMenuItem onClick={() => handleVerify(payment)}>
                    <CheckCircle className="mr-2 h-4 w-4 text-success" /> Verifikasi
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const bankColumns: ColumnDef<BankAccount>[] = [
    {
      accessorKey: 'nama_bank',
      header: 'Nama Bank',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.nama_bank}</p>
            {row.original.nama_bank_custom && (
              <p className="text-xs text-muted-foreground">{row.original.nama_bank_custom}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'nomor_rekening',
      header: 'No. Rekening',
      cell: ({ row }) => <code className="text-sm">{row.original.nomor_rekening}</code>,
    },
    {
      accessorKey: 'nama_pemilik_rekening',
      header: 'Atas Nama',
    },
    {
      accessorKey: 'biaya_pendaftaran',
      header: 'Biaya',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.biaya_pendaftaran)}</span>,
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.is_active ? 'active' : 'inactive'} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => handleEditBank(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === 'pending').length,
    verified: payments.filter((p) => p.status === 'verified').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Pembayaran" description="Kelola pembayaran dan rekening bank" icon={CreditCard} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-success">{stats.verified}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Pembayaran</TabsTrigger>
          <TabsTrigger value="bank">Rekening Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <DataTable
            columns={paymentColumns}
            data={filteredPayments}
            searchPlaceholder="Cari pembayaran..."
            filterComponent={
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-card">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddBank}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Rekening
            </Button>
          </div>
          <DataTable columns={bankColumns} data={bankAccounts} searchPlaceholder="Cari rekening..." />
        </TabsContent>
      </Tabs>

      {/* Payment Detail Modal */}
      <CrudModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        title="Detail Pembayaran"
        hideFooter
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Santri</p>
                  <p className="font-medium">{getSantriName(selectedPayment.santri_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah Transfer</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedPayment.jumlah_transfer)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedPayment.status} />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Pengirim</p>
                  <p className="font-medium">{selectedPayment.bank_pengirim}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. Rekening</p>
                  <code>{selectedPayment.no_rekening_pengirim}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atas Nama</p>
                  <p>{selectedPayment.nama_pemilik_rekening}</p>
                </div>
              </div>
            </div>
            {selectedPayment.bukti_transfer ? (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Bukti Transfer</p>
                <div className="flex items-center justify-center h-40 bg-muted rounded">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/50 text-center text-muted-foreground">
                Bukti transfer belum diupload
              </div>
            )}
            {selectedPayment.catatan && (
              <div>
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p>{selectedPayment.catatan}</p>
              </div>
            )}
          </div>
        )}
      </CrudModal>

      {/* Verify Modal */}
      <CrudModal
        open={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        title="Verifikasi Pembayaran"
        description="Verifikasi atau tolak pembayaran ini"
        size="md"
        hideFooter
      >
        <div className="space-y-4">
          <div>
            <Label>Catatan (opsional)</Label>
            <Textarea
              value={verifyNote}
              onChange={(e) => setVerifyNote(e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="destructive"
              onClick={() => handleConfirmVerify('rejected')}
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" /> Tolak
            </Button>
            <Button onClick={() => handleConfirmVerify('verified')} disabled={isSubmitting}>
              <CheckCircle className="mr-2 h-4 w-4" /> Verifikasi
            </Button>
          </div>
        </div>
      </CrudModal>

      {/* Bank Account Modal */}
      <CrudModal
        open={isBankModalOpen}
        onOpenChange={setIsBankModalOpen}
        title={editingBank ? 'Edit Rekening' : 'Tambah Rekening'}
        onSubmit={handleSaveBank}
        isSubmitting={isSubmitting}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama Bank</Label>
            <Select
              value={bankFormData.nama_bank}
              onValueChange={(v) => setBankFormData({ ...bankFormData, nama_bank: v })}
            >
              <SelectTrigger><SelectValue placeholder="Pilih bank" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BSI">BSI</SelectItem>
                <SelectItem value="BRI">BRI</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="Mandiri">Mandiri</SelectItem>
                <SelectItem value="BNI">BNI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nama Lengkap Bank</Label>
            <Input
              value={bankFormData.nama_bank_custom}
              onChange={(e) => setBankFormData({ ...bankFormData, nama_bank_custom: e.target.value })}
              placeholder="Bank Syariah Indonesia"
            />
          </div>
          <div className="space-y-2">
            <Label>No. Rekening</Label>
            <Input
              value={bankFormData.nomor_rekening}
              onChange={(e) => setBankFormData({ ...bankFormData, nomor_rekening: e.target.value })}
              placeholder="1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label>Atas Nama</Label>
            <Input
              value={bankFormData.nama_pemilik_rekening}
              onChange={(e) => setBankFormData({ ...bankFormData, nama_pemilik_rekening: e.target.value })}
              placeholder="Yayasan..."
            />
          </div>
          <div className="space-y-2">
            <Label>Biaya Pendaftaran</Label>
            <Input
              type="number"
              value={bankFormData.biaya_pendaftaran}
              onChange={(e) => setBankFormData({ ...bankFormData, biaya_pendaftaran: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status Aktif</Label>
            <div className="pt-2">
              <Switch
                checked={bankFormData.is_active}
                onCheckedChange={(c) => setBankFormData({ ...bankFormData, is_active: c })}
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Keterangan</Label>
            <Textarea
              value={bankFormData.keterangan}
              onChange={(e) => setBankFormData({ ...bankFormData, keterangan: e.target.value })}
              placeholder="Keterangan tambahan..."
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}
