import { BaseResourceList } from '@/components/resources/BaseResourceList';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen } from 'lucide-react';
export default function HistoryListPage() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'gambar',
      header: 'Gambar',
      cell: ({ row }) => (
        row.original.gambar ? (
          <img src={row.original.gambar} alt={row.original.judul} className="h-10 w-16 object-cover rounded" />
        ) : (
          <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No Img</div>
        )
      )
    },
    {
      accessorKey: 'judul',
      header: 'Judul / Tahun',
      cell: ({ row }) => <span className="font-medium">{row.original.judul}</span>
    },
    {
      accessorKey: 'deskripsi',
      header: 'Deskripsi',
      cell: ({ row }) => <span className="text-muted-foreground truncate max-w-[300px]">{row.original.deskripsi}</span>
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
      cell: ({ row }) => <div className="text-center w-10">{row.original.order}</div>
    },
  ];
  return (
    <BaseResourceList
      resource="history"
      title="Sejarah & Timeline"
      description="Kelola timeline sejarah perkembangan pesantren"
      columns={columns}
      icon={BookOpen}
      basePath="/admin/history"
      apiEndpoint="/core/sejarah-timeline"
    />
  );
}