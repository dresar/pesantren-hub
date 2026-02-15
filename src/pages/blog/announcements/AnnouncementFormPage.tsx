import { BaseResourceForm } from '@/components/resources/BaseResourceForm';
import { z } from 'zod';
import { Megaphone } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const announcementSchema = z.object({
  judul: z.string().min(1, 'Judul pengumuman harus diisi'),
  slug: z.string().optional(),
  konten: z.string().min(1, 'Isi pengumuman harus diisi'),
  gambar: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  isPenting: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
type AnnouncementForm = z.infer<typeof announcementSchema>;
export default function AnnouncementFormPage() {
  return (
    <BaseResourceForm<AnnouncementForm>
      resource="blogPengumuman"
      title="Pengumuman"
      basePath="/admin/announcements"
      schema={announcementSchema}
      defaultValues={{
        judul: '',
        slug: '',
        konten: '',
        gambar: '',
        status: 'published',
        isPenting: false,
        metaTitle: '',
        metaDescription: '',
      }}
      icon={Megaphone}
      apiEndpoint="/admin/generic/blogPengumuman"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Pengumuman</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Libur Hari Raya" />
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
                  <FormLabel>Slug (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="libur-hari-raya" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPenting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pengumuman Penting</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Tandai sebagai pengumuman prioritas/penting
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="gambar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Gambar</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="konten"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Pengumuman</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} placeholder="Tulis pengumuman lengkap di sini..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
             <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title (SEO)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Judul untuk mesin pencari" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description (SEO)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Deskripsi singkat untuk hasil pencarian" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </BaseResourceForm>
  );
}