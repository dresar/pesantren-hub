import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { mockFasilitas } from '@/lib/mock-data-extended';
import type { Fasilitas } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

export default function FacilitiesPage() {
  const [data, setData] = useState<Fasilitas[]>(mockFasilitas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fasilitas | null>(null);
  const [formData, setFormData] = useState({ nama: '', icon: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirm } = useAppStore();

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ nama: '', icon: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Fasilitas) => {
    setEditingItem(item);
    setFormData({ nama: item.nama, icon: item.icon });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    if (editingItem) {
      setData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
      );
      toast.success('Fasilitas berhasil diperbarui');
    } else {
      const newItem: Fasilitas = {
        id: String(Date.now()),
        ...formData,
        order: data.length + 1,
        created_at: new Date().toISOString(),
      };
      setData((prev) => [...prev, newItem]);
      toast.success('Fasilitas berhasil ditambahkan');
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Hapus Fasilitas',
      description: 'Yakin ingin menghapus fasilitas ini?',
      variant: 'destructive',
      onConfirm: () => {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success('Fasilitas berhasil dihapus');
      },
    });
  };

  const columns: ColumnDef<Fasilitas>[] = [
    {
      accessorKey: 'nama',
      header: 'Nama Fasilitas',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">{row.original.nama}</span>
        </div>
      ),
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => <code className="text-sm">{row.original.icon}</code>,
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
      <PageHeader title="Fasilitas" description="Kelola daftar fasilitas pesantren" icon={Building2}>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Fasilitas
        </Button>
      </PageHeader>

      <DataTable columns={columns} data={data} searchPlaceholder="Cari fasilitas..." />

      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingItem ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Fasilitas</Label>
            <Input
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Nama fasilitas"
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="building, mosque, library, dll"
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}
