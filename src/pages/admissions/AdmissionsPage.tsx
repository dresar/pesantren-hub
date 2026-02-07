import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { mockSantri, formatDate } from '@/lib/mock-data';
import type { Santri, SantriStatus } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function AdmissionsPage() {
  const [data, setData] = useState<Santri[]>(mockSantri);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const { showConfirm } = useAppStore();

  const filteredData = useMemo(() => {
    return data.filter((santri) => {
      const matchesStatus = statusFilter === 'all' || santri.status === statusFilter;
      const matchesGender = genderFilter === 'all' || santri.jenis_kelamin === genderFilter;
      return matchesStatus && matchesGender;
    });
  }, [data, statusFilter, genderFilter]);

  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Hapus Data Santri',
      description: 'Apakah Anda yakin ingin menghapus data santri ini? Tindakan ini tidak dapat dibatalkan.',
      variant: 'destructive',
      onConfirm: () => {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success('Data santri berhasil dihapus');
      },
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    showConfirm({
      title: 'Hapus Data Santri',
      description: `Apakah Anda yakin ingin menghapus ${ids.length} data santri? Tindakan ini tidak dapat dibatalkan.`,
      variant: 'destructive',
      onConfirm: () => {
        setData((prev) => prev.filter((item) => !ids.includes(item.id)));
        toast.success(`${ids.length} data santri berhasil dihapus`);
      },
    });
  };

  const handleStatusChange = (id: string, newStatus: SantriStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
      )
    );
    toast.success(`Status berhasil diubah menjadi ${newStatus}`);
  };

  const columns: ColumnDef<Santri>[] = [
    getSelectionColumn<Santri>(),
    {
      accessorKey: 'nama_lengkap',
      header: 'Nama Santri',
      cell: ({ row }) => {
        const santri = row.original;
        const initials = santri.nama_lengkap
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
                to={`/admissions/${santri.id}`}
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
      id: 'documents',
      header: 'Dokumen',
      cell: ({ row }) => {
        const santri = row.original;
        const docs = [
          santri.foto_santri_approved,
          santri.foto_ktp_approved,
          santri.foto_akta_approved,
          santri.foto_ijazah_approved,
          santri.surat_sehat_approved,
        ];
        const approved = docs.filter(Boolean).length;
        const total = docs.length;

        return (
          <div className="flex items-center gap-1.5">
            {approved === total ? (
              <FileCheck className="h-4 w-4 text-success" />
            ) : (
              <FileX className="h-4 w-4 text-warning" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                approved === total ? 'text-success' : 'text-warning'
              )}
            >
              {approved}/{total}
            </span>
          </div>
        );
      },
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
                <Link to={`/admissions/${santri.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/admissions/${santri.id}/edit`}>
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
    <div className="flex items-center gap-2">
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
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pendaftaran Santri"
        description="Kelola data pendaftaran santri baru"
        icon={GraduationCap}
      >
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button asChild>
          <Link to="/admissions/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Santri
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Cari nama, NISN, asal sekolah..."
        onBulkDelete={handleBulkDelete}
        filterComponent={filterComponent}
        emptyMessage="Belum ada data pendaftaran santri."
      />
    </div>
  );
}
