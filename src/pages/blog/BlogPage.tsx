import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader, DataTable, getSelectionColumn, StatusBadge, CrudModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Newspaper, Plus, MoreHorizontal, Eye, Pencil, Trash2, FolderOpen, Tags as TagsIcon } from 'lucide-react';
import { mockBlogPostsExtended, mockCategoriesExtended, mockTagsExtended } from '@/lib/mock-data-extended';
import { formatDateTime } from '@/lib/mock-data';
import type { BlogPost, Category, Tag, PostStatus } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPostsExtended);
  const [categories, setCategories] = useState<Category[]>(mockCategoriesExtended);
  const [tags, setTags] = useState<Tag[]>(mockTagsExtended);
  const [activeTab, setActiveTab] = useState('posts');
  
  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });
  
  // Tag Modal
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagForm, setTagForm] = useState({ name: '', slug: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirm } = useAppStore();

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '-';
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '' });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, slug: category.slug });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryForm, slug } : c))
      );
      toast.success('Kategori berhasil diperbarui');
    } else {
      const newCategory: Category = {
        id: String(Date.now()),
        name: categoryForm.name,
        slug,
        order: categories.length + 1,
        created_at: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      toast.success('Kategori berhasil ditambahkan');
    }
    setIsSubmitting(false);
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    showConfirm({
      title: 'Hapus Kategori',
      description: 'Yakin ingin menghapus kategori ini?',
      variant: 'destructive',
      onConfirm: () => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success('Kategori berhasil dihapus');
      },
    });
  };

  // Tag handlers
  const handleAddTag = () => {
    setEditingTag(null);
    setTagForm({ name: '', slug: '' });
    setIsTagModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagForm({ name: tag.name, slug: tag.slug });
    setIsTagModalOpen(true);
  };

  const handleSaveTag = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const slug = tagForm.slug || tagForm.name.toLowerCase().replace(/\s+/g, '-');
    if (editingTag) {
      setTags((prev) =>
        prev.map((t) => (t.id === editingTag.id ? { ...t, ...tagForm, slug } : t))
      );
      toast.success('Tag berhasil diperbarui');
    } else {
      const newTag: Tag = {
        id: String(Date.now()),
        name: tagForm.name,
        slug,
        order: tags.length + 1,
        created_at: new Date().toISOString(),
      };
      setTags((prev) => [...prev, newTag]);
      toast.success('Tag berhasil ditambahkan');
    }
    setIsSubmitting(false);
    setIsTagModalOpen(false);
  };

  const handleDeleteTag = (id: string) => {
    showConfirm({
      title: 'Hapus Tag',
      description: 'Yakin ingin menghapus tag ini?',
      variant: 'destructive',
      onConfirm: () => {
        setTags((prev) => prev.filter((t) => t.id !== id));
        toast.success('Tag berhasil dihapus');
      },
    });
  };

  const handleDeletePost = (id: string) => {
    showConfirm({
      title: 'Hapus Artikel',
      description: 'Yakin ingin menghapus artikel ini?',
      variant: 'destructive',
      onConfirm: () => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Artikel berhasil dihapus');
      },
    });
  };

  const postColumns: ColumnDef<BlogPost>[] = [
    getSelectionColumn<BlogPost>(),
    {
      accessorKey: 'title',
      header: 'Judul',
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <Link to={`/blog/${row.original.id}/edit`} className="font-medium hover:text-primary hover:underline">
            {row.original.title}
          </Link>
          <p className="text-xs text-muted-foreground truncate">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category_id',
      header: 'Kategori',
      cell: ({ row }) => (
        <Badge variant="outline">{getCategoryName(row.original.category_id)}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'views_count',
      header: 'Views',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.views_count.toLocaleString()}</span>,
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.created_at)}</span>
      ),
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
            <DropdownMenuItem asChild>
              <Link to={`/blog/${row.original.id}`}><Eye className="mr-2 h-4 w-4" /> Lihat</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/blog/${row.original.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeletePost(row.original.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Kategori',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditCategory(row.original)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(row.original.id)} className="text-destructive">
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  const tagColumns: ColumnDef<Tag>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Tag',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
            <TagsIcon className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Urutan',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditTag(row.original)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(row.original.id)} className="text-destructive">
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Blog" description="Kelola artikel, kategori, dan tag" icon={Newspaper}>
        {activeTab === 'posts' && (
          <Button asChild>
            <Link to="/blog/new"><Plus className="mr-2 h-4 w-4" /> Tulis Artikel</Link>
          </Button>
        )}
        {activeTab === 'categories' && (
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        )}
        {activeTab === 'tags' && (
          <Button onClick={handleAddTag}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Tag
          </Button>
        )}
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="posts">Artikel ({posts.length})</TabsTrigger>
          <TabsTrigger value="categories">Kategori ({categories.length})</TabsTrigger>
          <TabsTrigger value="tags">Tag ({tags.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <DataTable
            columns={postColumns}
            data={posts}
            searchPlaceholder="Cari artikel..."
            onBulkDelete={(ids) => {
              showConfirm({
                title: 'Hapus Artikel',
                description: `Hapus ${ids.length} artikel?`,
                variant: 'destructive',
                onConfirm: () => {
                  setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
                  toast.success(`${ids.length} artikel dihapus`);
                },
              });
            }}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <DataTable columns={categoryColumns} data={categories} searchPlaceholder="Cari kategori..." />
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <DataTable columns={tagColumns} data={tags} searchPlaceholder="Cari tag..." />
        </TabsContent>
      </Tabs>

      {/* Category Modal */}
      <CrudModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
        onSubmit={handleSaveCategory}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Kategori</Label>
            <Input
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="Nama kategori"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug (opsional)</Label>
            <Input
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              placeholder="nama-kategori"
            />
          </div>
        </div>
      </CrudModal>

      {/* Tag Modal */}
      <CrudModal
        open={isTagModalOpen}
        onOpenChange={setIsTagModalOpen}
        title={editingTag ? 'Edit Tag' : 'Tambah Tag'}
        onSubmit={handleSaveTag}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Tag</Label>
            <Input
              value={tagForm.name}
              onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
              placeholder="Nama tag"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug (opsional)</Label>
            <Input
              value={tagForm.slug}
              onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
              placeholder="nama-tag"
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}
