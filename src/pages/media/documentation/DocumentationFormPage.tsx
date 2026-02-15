import { BaseResourceForm } from '@/components/resources/BaseResourceForm';
import { z } from 'zod';
import { FolderOpen } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
const documentationSchema = z.object({
  judul: z.string().min(1, 'Judul harus diisi'),
  deskripsi: z.string().min(1, 'Deskripsi harus diisi'),
  kategori: z.string().min(1, 'Kategori harus diisi'),
  tanggalKegiatan: z.date().optional(),
  lokasi: z.string().min(1, 'Lokasi harus diisi'),
  order: z.coerce.number().default(0),
  isPublished: z.boolean().default(true),
});
type DocumentationForm = z.infer<typeof documentationSchema>;
export default function DocumentationFormPage() {
  return (
    <BaseResourceForm<DocumentationForm>
      resource="dokumentasi"
      title="Dokumentasi"
      basePath="/admin/documentation"
      schema={documentationSchema}
      defaultValues={{
        judul: '',
        deskripsi: '',
        kategori: '',
        lokasi: '',
        order: 0,
        isPublished: true,
      }}
      icon={FolderOpen}
      apiEndpoint="/admin/generic/dokumentasi"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Dokumentasi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Wisuda Angkatan 5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Akademik / Kesiswaan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lokasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Kegiatan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Aula Utama" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalKegiatan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Kegiatan</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="deskripsi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Lengkap</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} placeholder="Jelaskan detail kegiatan..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urutan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-8">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publikasikan</FormLabel>
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
        </>
      )}
    </BaseResourceForm>
  );
}