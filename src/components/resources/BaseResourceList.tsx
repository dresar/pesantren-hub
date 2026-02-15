import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader, DataTable, getSelectionColumn } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/app-store';
import { ColumnDef } from '@tanstack/react-table';
interface BaseResourceListProps<T> {
  resource: string;
  title: string;
  description?: string;
  columns: ColumnDef<T>[];
  icon?: any;
  basePath: string; 
  apiEndpoint?: string; 
}
export function BaseResourceList<T extends { id: string | number }>({
  resource,
  title,
  description,
  columns,
  icon: Icon,
  basePath,
  apiEndpoint,
}: BaseResourceListProps<T>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showConfirm } = useAppStore();
  const endpoint = apiEndpoint || `/admin/generic/${resource}`;
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['resource', resource],
    queryFn: async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', resource] });
      toast.success('Data berhasil dihapus');
    },
    onError: () => {
      toast.error('Gagal menghapus data');
    },
  });
  const handleDelete = (id: string | number) => {
    showConfirm({
      title: 'Hapus Data',
      description: 'Apakah Anda yakin ingin menghapus data ini?',
      variant: 'destructive',
      onConfirm: () => deleteMutation.mutate(id),
    });
  };
  const actionColumn: ColumnDef<T> = {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Open menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`${basePath}/${item.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
  const finalColumns = [...columns, actionColumn];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={title}
        description={description}
        icon={Icon}
      >
        <Button onClick={() => navigate(`${basePath}/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Baru
        </Button>
      </PageHeader>
      <DataTable
        columns={finalColumns}
        data={Array.isArray(responseData) ? responseData : (responseData?.data || [])}
        isLoading={isLoading}
      />
    </div>
  );
}