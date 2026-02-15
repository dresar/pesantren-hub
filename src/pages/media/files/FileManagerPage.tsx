import { BaseResourceList } from '@/components/resources/BaseResourceList';
import { ColumnDef } from '@tanstack/react-table';
import { FileCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export default function FileManagerPage() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'nama',
      header: 'Nama Template',
      cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>
    },
    {
      accessorKey: 'slug',
      header: 'Slug / Kode',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.slug}</span>
    },
    {
      accessorKey: 'ukuranKertas',
      header: 'Kertas',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Aktif' : 'Non-Aktif'}
        </Badge>
      ),
    },
  ];
  return (
    <BaseResourceList
      resource="documentTemplates"
      title="File Manager / Template Dokumen"
      description="Kelola template dokumen surat menyurat"
      columns={columns}
      icon={FileCode}
      basePath="/admin/files" 
      apiEndpoint="/admin/generic/documentTemplates"
    />
  );
}