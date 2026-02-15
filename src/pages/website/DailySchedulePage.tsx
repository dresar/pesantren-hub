import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Clock, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { JadwalHarian } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
const kategoriColors: Record<string, string> = {
  ibadah: 'bg-primary/10 text-primary border-primary/30',
  pendidikan: 'bg-info/10 text-info border-info/30',
  istirahat: 'bg-warning/10 text-warning border-warning/30',
  kegiatan: 'bg-success/10 text-success border-success/30',
};
export default function DailySchedulePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JadwalHarian | null>(null);
  const [formData, setFormData] = useState({
    waktu: '',
    judul: '',
    deskripsi: '',
    kategori: 'pendidikan',
  });
  const { showConfirm } = useAppStore();
  const { data: data = [], isLoading } = useQuery({
    queryKey: ['jadwalHarian'],
    queryFn: async () => (await api.get('/admin/generic/jadwalHarian')).data.data,
  });
  const mutation = useMutation({
    mutationFn: async (newItem: any) => {
      if (editingItem) {
        return api.put(`/admin/generic/jadwalHarian/${editingItem.id}`, newItem);
      }
      return api.post('/admin/generic/jadwalHarian', newItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwalHarian'] });
      toast.success(editingItem ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Gagal menyimpan jadwal'),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/generic/jadwalHarian/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwalHarian'] });
      toast.success('Jadwal berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus jadwal'),
  });
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ waktu: '', judul: '', deskripsi: '', kategori: 'pendidikan' });
    setIsModalOpen(true);
  };
  const handleEdit = (item: JadwalHarian) => {
    setEditingItem(item);
    setFormData({
      waktu: item.waktu,
      judul: item.judul,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
    });
    setIsModalOpen(true);
  };
  const handleSubmit = () => {
    mutation.mutate({ ...formData, order: editingItem?.order || data.length + 1 });
  };
  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Hapus Jadwal',
      description: 'Yakin ingin menghapus jadwal ini?',
      variant: 'destructive',
      onConfirm: () => deleteMutation.mutate(id),
    });
  };
  const columns: ColumnDef<JadwalHarian>[] = [
    {
      accessorKey: 'waktu',
      header: 'Waktu',
      cell: ({ row }) => (
        <code className="text-sm font-medium">{row.original.waktu}</code>
      ),
    },
    {
      accessorKey: 'judul',
      header: 'Kegiatan',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.judul}</p>
          <p className="text-xs text-muted-foreground">{row.original.deskripsi}</p>
        </div>
      ),
    },
    {
      accessorKey: 'kategori',
      header: 'Kategori',
      cell: ({ row }) => (
        <Badge variant="outline" className={kategoriColors[row.original.kategori] || ''}>
          {row.original.kategori}
        </Badge>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Jadwal Harian" description="Kelola jadwal aktivitas harian santri" icon={Clock}>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchPlaceholder="Cari jadwal..." />
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingItem ? 'Edit Jadwal' : 'Tambah Jadwal'}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Waktu</Label>
            <Input
              value={formData.waktu}
              onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
              placeholder="04:00 - 04:30"
            />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={formData.kategori}
              onValueChange={(v) => setFormData({ ...formData, kategori: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ibadah">Ibadah</SelectItem>
                <SelectItem value="pendidikan">Pendidikan</SelectItem>
                <SelectItem value="istirahat">Istirahat</SelectItem>
                <SelectItem value="kegiatan">Kegiatan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Nama Kegiatan</Label>
            <Input
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Shalat Subuh"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Deskripsi kegiatan..."
              rows={3}
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}