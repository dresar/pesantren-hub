import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Newspaper, ArrowLeft, Save, Eye, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DualImageInput } from '@/components/forms/DualImageInput';
const postSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  slug: z.string().optional(),
  content: z.string().min(50, 'Konten minimal 50 karakter'),
  excerpt: z.string().optional(),
  category_id: z.string().optional(),
  featured_image: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});
type PostFormValues = z.infer<typeof postSchema>;
export default function BlogEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => (await api.get('/admin/generic/blogCategory')).data.data,
  });
  const { data: postData } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const response = await api.get(`/admin/generic/blogBlogpost/${id}`);
      return response.data.data || response.data; 
    },
    enabled: !!id,
  });
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category_id: '',
      featured_image: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      is_featured: false,
      status: 'draft',
    },
  });
  useEffect(() => {
    if (postData) {
      form.reset({
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt || '',
        category_id: String(postData.category_id || ''),
        featured_image: postData.featured_image || postData.featuredImage || '',
        meta_title: postData.meta_title || postData.metaTitle || '',
        meta_description: postData.meta_description || postData.metaDescription || '',
        meta_keywords: postData.meta_keywords || postData.metaKeywords || '',
        is_featured: Boolean(postData.is_featured || postData.isFeatured),
        status: postData.status || 'draft',
      });
    }
  }, [postData, form]);
  const mutation = useMutation({
    mutationFn: async (values: PostFormValues) => {
      if (id) {
        return api.put(`/admin/generic/blogBlogpost/${id}`, values);
      }
      return api.post('/admin/generic/blogBlogpost', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success(id ? 'Artikel diperbarui' : 'Artikel berhasil disimpan');
      navigate('/admin/blog/posts');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Gagal menyimpan artikel');
    }
  });
  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={id ? "Edit Artikel" : "Tulis Artikel"} description="Manajemen konten artikel" icon={Newspaper}>
        <Button variant="outline" onClick={() => navigate('/admin/blog/posts')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-3">
            {}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Konten Artikel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Artikel</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan judul artikel"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (!id) { 
                                form.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug URL</FormLabel>
                        <FormControl>
                          <Input placeholder="judul-artikel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ringkasan</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ringkasan singkat artikel..." rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konten</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tulis konten artikel di sini..."
                            rows={15}
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              {}
              <Card>
                <CardHeader>
                  <CardTitle>Gambar Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DualImageInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="URL gambar (contoh: https://images.unsplash.com/...)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            {}
            <div className="space-y-6">
              {}
              <Card>
                <CardHeader>
                  <CardTitle>Publikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Publikasi</SelectItem>
                            <SelectItem value="archived">Arsip</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {}
                            {categories.map((cat: any) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="mb-0">Featured</FormLabel>
                          <p className="text-xs text-muted-foreground">Tampilkan di halaman utama</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button type="button" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {}
              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Judul SEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Deskripsi untuk mesin pencari..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="kata, kunci, artikel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}