import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, MoreHorizontal, Eye, Pencil, Trash2, Shield, UserX, UserCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { User, UserRole } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  staff: 'Staff',
  teacher: 'Pengajar',
  operator: 'Operator',
};
const roleColors: Record<UserRole, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/30',
  staff: 'bg-info/10 text-info border-info/30',
  teacher: 'bg-primary/10 text-primary border-primary/30',
  operator: 'bg-warning/10 text-warning border-warning/30',
};
export default function UsersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
    password: '',
  });
  const { showConfirm } = useAppStore();
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data;
    },
  });
  const createUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      return await api.post('/admin/users', newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil ditambahkan');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Gagal menambahkan user');
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil diperbarui');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Gagal memperbarui user');
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Gagal menghapus user');
    },
  });
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ first_name: '', last_name: '', username: '', email: '', phone: '', role: 'staff', password: '' });
    setIsModalOpen(true);
  };
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: '', 
    });
    setIsModalOpen(true);
  };
  const handleView = (user: User) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };
  const handleSubmit = async () => {
    const payload = { ...formData };
    if (editingUser) {
      if (!payload.password) delete (payload as any).password; 
      updateUserMutation.mutate({ id: editingUser.id, data: payload });
    } else {
      createUserMutation.mutate(payload);
    }
  };
  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Hapus User',
      description: 'Apakah Anda yakin ingin menghapus user ini?',
      variant: 'destructive',
      onConfirm: () => {
        deleteUserMutation.mutate(id);
      },
    });
  };
  const handleToggleStatus = (user: User) => {
    updateUserMutation.mutate({ 
        id: user.id, 
        data: { isActive: !user.is_active } 
    });
  };
  const columns: ColumnDef<User>[] = [
    getSelectionColumn<User>(),
    {
      accessorKey: 'first_name',
      header: 'Nama',
      cell: ({ row }) => {
        const user = row.original;
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline" className={roleColors[row.original.role]}>
          <Shield className="mr-1 h-3 w-3" />
          {roleLabels[row.original.role]}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      accessorKey: 'last_login',
      header: 'Login Terakhir',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.last_login ? formatDateTime(row.original.last_login) : '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(user)}>
                <Eye className="mr-2 h-4 w-4" /> Lihat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                {user.is_active ? (
                  <><UserX className="mr-2 h-4 w-4" /> Nonaktifkan</>
                ) : (
                  <><UserCheck className="mr-2 h-4 w-4" /> Aktifkan</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Pengguna" description="Kelola pengguna sistem" icon={Users}>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah User
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={usersData || []}
        isLoading={isLoading}
        searchPlaceholder="Cari nama, email..."
      />
      {}
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingUser ? 'Edit User' : 'Tambah User Baru'}
        description={editingUser ? 'Perbarui informasi user' : 'Isi form untuk menambah user baru'}
        onSubmit={handleSubmit}
        isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama Depan</Label>
            <Input
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder="Nama depan"
            />
          </div>
          <div className="space-y-2">
            <Label>Nama Belakang</Label>
            <Input
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder="Nama belakang"
            />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="username"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>No. HP</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="081234567890"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="teacher">Pengajar</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!editingUser && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                />
              </div>
          )}
        </div>
      </CrudModal>
      {}
      <CrudModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        title="Detail User"
        hideFooter
        size="md"
      >
        {viewingUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {viewingUser.first_name[0]}{viewingUser.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{viewingUser.first_name} {viewingUser.last_name}</h3>
                <p className="text-muted-foreground">@{viewingUser.username}</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Email</span>
                <span>{viewingUser.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Phone</span>
                <span>{viewingUser.phone || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" className={roleColors[viewingUser.role]}>
                  {roleLabels[viewingUser.role]}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={viewingUser.is_active ? 'active' : 'inactive'} />
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Login Terakhir</span>
                <span>{viewingUser.last_login ? formatDateTime(viewingUser.last_login) : '-'}</span>
              </div>
            </div>
          </div>
        )}
      </CrudModal>
    </div>
  );
}