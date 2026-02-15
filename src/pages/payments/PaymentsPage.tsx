import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
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
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Payment, PaymentStatus, BankAccount } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('payments');
  const [statusFilter, setStatusFilter] = useState('all');
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
  const { showConfirm } = useAppStore();
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/admin/payments');
      const list = res.data?.data || [];
      return list.map((p: any) => {
        if ('bankPengirim' in p) {
          return {
            id: p.id,
            bank_pengirim: p.bankPengirim,
            no_rekening_pengirim: p.noRekeningPengirim,
            nama_pemilik_rekening: p.namaPemilikRekening,
            rekening_tujuan: p.rekeningTujuan,
            jumlah_transfer: p.jumlahTransfer,
            bukti_transfer: p.buktiTransfer,
            status: p.status,
            catatan: p.catatan,
            created_at: p.createdAt,
            updated_at: p.updatedAt,
            verified_at: p.verifiedAt,
            santri_id: p.santriId,
            verified_by_id: p.verifiedById,
            santri: (p as any).santri,
          };
        }
        return p;
      });
    },
  });
  const { data: bankAccounts = [], isLoading: isLoadingBanks } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      const res = await api.get('/admin/generic/bankAccounts');
      const list = res.data?.data || [];
      return list.map((b: any) => ({
        id: b.id,
        nama_bank: b.namaBank,
        nama_bank_custom: b.namaBankCustom,
        nomor_rekening: b.nomorRekening,
        nama_pemilik_rekening: b.namaPemilik,
        biaya_pendaftaran: b.biayaPendaftaran,
        is_active: b.isActive,
        keterangan: b.keterangan,
        order: b.order,
        created_at: b.createdAt,
        updated_at: b.updatedAt,
      }));
    },
  });
  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: PaymentStatus; note: string }) => {
      return api.put(`/payments/${id}`, { status, catatan: note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Status pembayaran diperbarui');
      setIsVerifyModalOpen(false);
    }
  });
  const bankMutation = useMutation({
    mutationFn: async (data: any) => {
      const now = new Date().toISOString();
      const payload = {
        namaBank: data.nama_bank,
        namaBankCustom: data.nama_bank_custom,
        nomorRekening: data.nomor_rekening,
        namaPemilik: data.nama_pemilik_rekening,
        biayaPendaftaran: data.biaya_pendaftaran,
        isActive: data.is_active,
        keterangan: data.keterangan,
        order: editingBank ? (editingBank.order ?? 0) : ((bankAccounts?.length || 0) + 1),
        updatedAt: now,
        createdAt: editingBank ? (editingBank.created_at ?? now) : now,
      };
      if (editingBank) {
        return api.put(`/admin/generic/bankAccounts/${editingBank.id}`, payload);
      }
      return api.post('/admin/generic/bankAccounts', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success(editingBank ? 'Rekening diperbarui' : 'Rekening ditambahkan');
      setIsBankModalOpen(false);
    }
  });
  const deleteBankMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/generic/bankAccounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success('Rekening dihapus');
    }
  });
  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return payments;
    return payments.filter((p: Payment) => p.status === statusFilter);
  }, [payments, statusFilter]);
  const handleVerify = (payment: Payment) => {
    setSelectedPayment(payment);
    setVerifyNote('');
    setIsVerifyModalOpen(true);
  };
  const handleConfirmVerify = (status: PaymentStatus) => {
    if (!selectedPayment) return;
    verifyPaymentMutation.mutate({ id: selectedPayment.id, status, note: verifyNote });
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
  const handleSaveBank = () => {
    bankMutation.mutate(bankFormData);
  };
  const paymentColumns: ColumnDef<Payment>[] = [
    getSelectionColumn<Payment>(),
    {
      accessorKey: 'santri_id',
      header: 'Santri',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{(row.original as any).santri?.namaLengkap || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">ID: {row.original.santri_id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'jumlah_transfer',
      header: 'Jumlah',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {formatCurrency(row.original.jumlah_transfer ?? (row.original as any).jumlahTransfer)}
        </span>
      ),
    },
    {
      accessorKey: 'bank_pengirim',
      header: 'Bank Pengirim',
      cell: ({ row }) => (
        <div>
          <p>{row.original.bank_pengirim ?? (row.original as any).bankPengirim}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.no_rekening_pengirim ?? (row.original as any).noRekeningPengirim}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.original.created_at ?? (row.original as any).createdAt)}
        </span>
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
              <DropdownMenuItem onClick={() => navigate(`/admin/payments/${payment.id}`)}>
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
      header: 'Bank',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
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
  ];
  const stats = {
    total: payments.length,
    pending: payments.filter((p: Payment) => p.status === 'pending').length,
    verified: payments.filter((p: Payment) => p.status === 'verified').length,
    rejected: payments.filter((p: Payment) => p.status === 'rejected').length,
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Pembayaran" description="Kelola pembayaran dan rekening bank" icon={CreditCard} />
      {}
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
            isLoading={isLoadingPayments}
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
          <DataTable
            columns={bankColumns}
            data={bankAccounts}
            isLoading={isLoadingBanks}
            searchPlaceholder="Cari rekening..."
            onBulkDelete={(ids) =>
              showConfirm({
                title: 'Hapus Rekening (Bulk)',
                description: `Menghapus ${ids.length} rekening terpilih. Lanjutkan?`,
                variant: 'destructive',
                onConfirm: async () => {
                  await Promise.all(ids.map((id) => api.delete(`/admin/generic/bankAccounts/${id}`)));
                  queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
                  toast.success(`Berhasil menghapus ${ids.length} rekening`);
                },
              })
            }
          />
        </TabsContent>
      </Tabs>
      {}
      {}
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
              disabled={verifyPaymentMutation.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" /> Tolak
            </Button>
            <Button onClick={() => handleConfirmVerify('verified')} disabled={verifyPaymentMutation.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" /> Verifikasi
            </Button>
          </div>
        </div>
      </CrudModal>
      {}
      <CrudModal
        open={isBankModalOpen}
        onOpenChange={setIsBankModalOpen}
        title={editingBank ? 'Edit Rekening' : 'Tambah Rekening'}
        onSubmit={handleSaveBank}
        isSubmitting={bankMutation.isPending}
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