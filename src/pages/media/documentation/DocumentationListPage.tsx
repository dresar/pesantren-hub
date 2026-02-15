import { BaseResourceList } from '@/components/resources/BaseResourceList';
import { ColumnDef } from '@tanstack/react-table';
import { FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export default function DocumentationListPage() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'judul',
      header: 'Judul Dokumentasi',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.judul}</div>
          <div className="text-xs text-muted-foreground">{row.original.kategori}</div>
        </div>
      )
    },
    {
      accessorKey: 'lokasi',
      header: 'Lokasi',
    },
    {
      accessorKey: 'tanggalKegiatan',
      header: 'Tanggal',
      cell: ({ row }) => row.original.tanggalKegiatan ? new Date(row.original.tanggalKegiatan).toLocaleDateString('id-ID') : '-'
    },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>
          {row.original.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];
  return (
    <BaseResourceList
      resource="dokumentasi"
      title="Dokumentasi"
      description="Kelola album dokumentasi kegiatan pesantren"
      columns={columns}
      icon={FolderOpen}
      basePath="/admin/documentation"
      apiEndpoint="/admin/generic/dokumentasi"
    />
  );
}