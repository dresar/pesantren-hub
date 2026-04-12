import { BaseResourceList } from '@/components/resources/BaseResourceList';
import { ColumnDef } from '@tanstack/react-table';
import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OrganisasiListPage() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'foto',
      header: 'Foto',
      cell: ({ row }) => (
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted border">
          {row.original.foto ? (
            <img src={row.original.foto} alt={row.original.nama} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">No pic</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'nama',
      header: 'Nama',
      cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>
    },
    {
      accessorKey: 'jabatan',
      header: 'Jabatan',
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => {
        const levels = ['Pimpinan (0)', 'Kepala Bidang (1)', 'Staff (2)', 'Anggota (3)'];
        return <Badge variant="outline">{levels[row.original.level] || `Level ${row.original.level}`}</Badge>;
      }
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Aktif' : 'Non-aktif'}
        </Badge>
      ),
    },
  ];

  return (
    <BaseResourceList
      resource="strukturOrganisasi"
      title="Struktur Organisasi"
      description="Kelola hierarki kepengurusan dan pimpinan"
      columns={columns}
      icon={Network}
      basePath="/admin/organisasi"
      apiEndpoint="/admin/struktur-organisasi"
    />
  );
}
