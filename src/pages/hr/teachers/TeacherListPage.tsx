import { BaseResourceList } from '@/components/resources/BaseResourceList';
import { ColumnDef } from '@tanstack/react-table';
import { UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export default function TeacherListPage() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'foto',
      header: 'Foto',
      cell: ({ row }) => (
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
          {row.original.foto ? (
            <img src={row.original.foto} alt={row.original.namaLengkap} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">No Img</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'namaLengkap',
      header: 'Nama Lengkap',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.namaLengkap}</div>
          <div className="text-xs text-muted-foreground">{row.original.noHp}</div>
        </div>
      )
    },
    {
      accessorKey: 'pendidikanTerakhir',
      header: 'Pendidikan',
      cell: ({ row }) => <span className="text-sm">{row.original.pendidikanTerakhir}</span>
    },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>
          {row.original.isPublished ? 'Aktif' : 'Non-Aktif'}
        </Badge>
      ),
    },
  ];
  return (
    <BaseResourceList
      resource="tenagaPengajar"
      title="Tenaga Pengajar"
      description="Kelola data guru dan staf pengajar"
      columns={columns}
      icon={UserCheck}
      basePath="/admin/teachers"
      apiEndpoint="/admin/generic/tenagaPengajar"
    />
  );
}