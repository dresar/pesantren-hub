import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileCheck,
  FileX,
  Download,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Santri, SantriStatus } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import * as XLSX from 'xlsx';
import { filterSantriData } from '@/lib/filter-utils';
export default function AdmissionsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { showConfirm } = useAppStore();
  const { data: santriData, isLoading } = useQuery({
    queryKey: ['santri'], 
    queryFn: async () => {
      const response = await api.get('/admin/santri', { params: { limit: 1000 } });
      const list: unknown[] = response.data.data || [];
      return list.map((raw) => {
        const s = raw as {
          id: string;
          namaLengkap?: string;
          nama_lengkap?: string;
          nisn?: string;
          jenisKelamin?: 'L' | 'P';
          jenis_kelamin?: 'L' | 'P';
          asalSekolah?: string;
          asal_sekolah?: string;
          noHp?: string;
          no_hp?: string;
          status?: SantriStatus;
          createdAt?: string;
          created_at?: string;
          fotoSantriApproved?: boolean;
          foto_santri_approved?: boolean;
          fotoKtpApproved?: boolean;
          foto_ktp_approved?: boolean;
          fotoAktaApproved?: boolean;
          foto_akta_approved?: boolean;
          fotoIjazahApproved?: boolean;
          foto_ijazah_approved?: boolean;
          suratSehatApproved?: boolean;
          surat_sehat_approved?: boolean;
          fotoSantri?: string;
          foto_santri?: string;
        };
        return {
          id: s.id,
          nama_lengkap: s.namaLengkap ?? s.nama_lengkap ?? '',
          nisn: s.nisn ?? '',
          jenis_kelamin: s.jenisKelamin ?? s.jenis_kelamin ?? 'L',
          asal_sekolah: s.asalSekolah ?? s.asal_sekolah ?? '',
          no_hp: s.noHp ?? s.no_hp ?? '',
          status: (s.status ?? 'pending') as SantriStatus,
          created_at: s.createdAt ?? s.created_at ?? '',
          foto_santri_approved: s.fotoSantriApproved ?? s.foto_santri_approved ?? false,
          foto_ktp_approved: s.fotoKtpApproved ?? s.foto_ktp_approved ?? false,
          foto_akta_approved: s.fotoAktaApproved ?? s.foto_akta_approved ?? false,
          foto_ijazah_approved: s.fotoIjazahApproved ?? s.foto_ijazah_approved ?? false,
          surat_sehat_approved: s.suratSehatApproved ?? s.surat_sehat_approved ?? false,
          foto_santri: s.fotoSantri ?? s.foto_santri ?? '',
        } as Santri;
      });
    },
    initialData: (() => {
      try {
        const raw = localStorage.getItem('cache:santri');
        if (!raw) return undefined;
        const cached = JSON.parse(raw);
        if (!cached?.data) return undefined;
        return cached.data as Santri[];
      } catch {
        return undefined;
      }
    })(),
  });
  const filteredData = useMemo(() => {
    return filterSantriData(santriData as any[], statusFilter, genderFilter, startDate, endDate);
  }, [santriData, statusFilter, genderFilter, startDate, endDate]);
  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }
    const exportData = filteredData.map(s => ({
      'ID': s.id,
      'Nama Lengkap': s.nama_lengkap,
      'NISN': s.nisn,
      'Jenis Kelamin': s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      'Asal Sekolah': s.asal_sekolah,
      'No HP': s.no_hp,
      'Status': s.status,
      'Tanggal Daftar': formatDate(s.created_at),
      'Foto Santri': s.foto_santri || '-',
      'Status Foto Santri': s.foto_santri_approved ? 'Approved' : 'Pending',
      'Status KTP': s.foto_ktp_approved ? 'Approved' : 'Pending',
      'Status Akta': s.foto_akta_approved ? 'Approved' : 'Pending',
      'Status Ijazah': s.foto_ijazah_approved ? 'Approved' : 'Pending',
      'Status Surat Sehat': s.surat_sehat_approved ? 'Approved' : 'Pending',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Santri");
    const maxWidth = 30;
    const wscols = Object.keys(exportData[0]).map(k => ({ wch: Math.min(maxWidth, Math.max(k.length, 20)) }));
    ws['!cols'] = wscols;
    XLSX.writeFile(wb, `Data_Santri_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diexport');
  };
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/santri/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      toast.success('Data santri berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus data santri'),
  });
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return await api.post('/admin/santri/bulk-action', { action: 'delete', ids: ids.map(Number) });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      toast.success(`${variables.length} data santri berhasil dihapus`);
    },
    onError: () => toast.error('Gagal menghapus data santri'),
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SantriStatus }) => {
       return await api.put(`/admin/santri/${id}`, { status });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      toast.success(`Status berhasil diubah menjadi ${variables.status}`);
    },
    onError: () => toast.error('Gagal mengubah status'),
  });
  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Hapus Data Santri',
      description: 'Apakah Anda yakin ingin menghapus data santri ini? Tindakan ini tidak dapat dibatalkan.',
      variant: 'destructive',
      onConfirm: () => {
        deleteMutation.mutate(id);
      },
    });
  };
  const handleBulkDelete = (ids: string[]) => {
    showConfirm({
      title: 'Hapus Data Santri',
      description: `Apakah Anda yakin ingin menghapus ${ids.length} data santri? Tindakan ini tidak dapat dibatalkan.`,
      variant: 'destructive',
      onConfirm: () => {
        bulkDeleteMutation.mutate(ids);
      },
    });
  };
  const handleStatusChange = (id: string, newStatus: SantriStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };
  const importMutation = useMutation({
    mutationFn: async (items: any[]) => {
      return await api.post('/admin/santri/import', { items });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
      toast.success(data.message || 'Import berhasil');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Gagal mengimport data');
    },
  });
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];
        const mappedData = data.map(row => ({
           namaLengkap: row['Nama Lengkap'] || row['Nama'] || row['namaLengkap'],
           nisn: row['NISN']?.toString() || row['nisn'],
           jenisKelamin: row['Jenis Kelamin'] === 'Laki-laki' ? 'L' : (row['Jenis Kelamin'] === 'Perempuan' ? 'P' : (row['Gender'] || 'L')),
           asalSekolah: row['Asal Sekolah'] || row['AsalSekolah'] || row['asalSekolah'],
           noHp: row['No HP']?.toString() || row['NoHP'] || row['noHp'],
        })).filter(item => item.namaLengkap && item.nisn); 
        if (mappedData.length === 0) {
           toast.error('Tidak ada data valid yang ditemukan dalam file');
           return;
        }
        importMutation.mutate(mappedData);
      } catch (err) {
        console.error(err);
        toast.error('Gagal membaca file Excel');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };
  const columns: ColumnDef<Santri>[] = [
    getSelectionColumn<Santri>(),
    {
      accessorKey: 'nama_lengkap',
      header: 'Nama Santri',
      cell: ({ row }) => {
        const santri = row.original;
        const initials = (santri.nama_lengkap || 'Unknown')
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={santri.foto_santri} alt={santri.nama_lengkap} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                to={`/admin/admissions/${santri.id}`}
                className="font-medium hover:text-primary hover:underline transition-colors"
              >
                {santri.nama_lengkap}
              </Link>
              <p className="text-xs text-muted-foreground">NISN: {santri.nisn}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'jenis_kelamin',
      header: 'Gender',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
        </Badge>
      ),
    },
    {
      accessorKey: 'asal_sekolah',
      header: 'Asal Sekolah',
      cell: ({ row }) => (
        <div className="max-w-[180px] truncate" title={row.original.asal_sekolah}>
          {row.original.asal_sekolah}
        </div>
      ),
    },
    {
      accessorKey: 'no_hp',
      header: 'No. HP',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.no_hp || '-'}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Tgl Daftar',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.created_at)}
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
      header: '',
      cell: ({ row }) => {
        const santri = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/admin/admissions/${santri.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/admin/admissions/${santri.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Ubah Status
              </DropdownMenuLabel>
              {santri.status !== 'verified' && (
                <DropdownMenuItem onClick={() => handleStatusChange(santri.id, 'verified')}>
                  Verifikasi
                </DropdownMenuItem>
              )}
              {santri.status !== 'accepted' && (
                <DropdownMenuItem onClick={() => handleStatusChange(santri.id, 'accepted')}>
                  Terima
                </DropdownMenuItem>
              )}
              {santri.status !== 'rejected' && (
                <DropdownMenuItem onClick={() => handleStatusChange(santri.id, 'rejected')}>
                  Tolak
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(santri.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const filterComponent = (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="pending">Menunggu</SelectItem>
          <SelectItem value="verified">Terverifikasi</SelectItem>
          <SelectItem value="accepted">Diterima</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
        </SelectContent>
      </Select>
      <Select value={genderFilter} onValueChange={setGenderFilter}>
        <SelectTrigger className="w-[130px] bg-card">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="L">Laki-laki</SelectItem>
          <SelectItem value="P">Perempuan</SelectItem>
        </SelectContent>
      </Select>
      <Input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
        className="w-[140px] bg-card"
        placeholder="Dari"
      />
      <Input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
        className="w-[140px] bg-card"
        placeholder="Sampai"
      />
      {(startDate || endDate || statusFilter !== 'all' || genderFilter !== 'all') && (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
                setStatusFilter('all');
                setGenderFilter('all');
                setStartDate('');
                setEndDate('');
            }}
            title="Reset Filter"
        >
            <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pendaftaran Santri"
        description="Kelola data pendaftaran santri baru"
        icon={GraduationCap}
      >
        <div className="relative">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Import Excel"
          />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4 rotate-180" />
            Import Excel
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
        <Button asChild>
          <Link to="/admin/admissions/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Santri
          </Link>
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchPlaceholder="Cari nama, NISN, asal sekolah..."
        onBulkDelete={(ids) => handleBulkDelete(ids)}
        filterComponent={filterComponent}
        emptyMessage="Belum ada data pendaftaran santri."
      />
    </div>
  );
}