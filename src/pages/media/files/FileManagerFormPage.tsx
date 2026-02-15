import { BaseResourceForm } from '@/components/resources/BaseResourceForm';
import { z } from 'zod';
import { FileCode } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const documentTemplateSchema = z.object({
  nama: z.string().min(1, 'Nama template harus diisi'),
  slug: z.string().optional(),
  deskripsi: z.string().min(1, 'Deskripsi harus diisi'),
  htmlTemplate: z.string().min(1, 'HTML Template harus diisi'),
  cssTemplate: z.string().optional(),
  ukuranKertas: z.enum(['A4', 'F4', 'Letter', 'Custom']).default('A4'),
  orientasi: z.enum(['Portrait', 'Landscape']).default('Portrait'),
  marginTop: z.string().default('2cm'),
  marginRight: z.string().default('2cm'),
  marginBottom: z.string().default('2cm'),
  marginLeft: z.string().default('2cm'),
  isActive: z.boolean().default(true),
  order: z.coerce.number().default(0),
});
type DocumentTemplateForm = z.infer<typeof documentTemplateSchema>;
export default function FileManagerFormPage() {
  return (
    <BaseResourceForm<DocumentTemplateForm>
      resource="documentTemplates"
      title="Template Dokumen"
      basePath="/admin/files"
      schema={documentTemplateSchema}
      defaultValues={{
        nama: '',
        slug: '',
        deskripsi: '',
        htmlTemplate: '',
        cssTemplate: '',
        ukuranKertas: 'A4',
        orientasi: 'Portrait',
        marginTop: '2cm',
        marginRight: '2cm',
        marginBottom: '2cm',
        marginLeft: '2cm',
        isActive: true,
        order: 0,
      }}
      icon={FileCode}
      apiEndpoint="/admin/generic/documentTemplates"
    >
      {(form) => (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Template</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contoh: Surat Keterangan Aktif" />
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
                    <FormLabel>Kode / Slug (Opsional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="surat-keterangan-aktif" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Keterangan penggunaan template ini..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Halaman</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FormField
                control={form.control}
                name="ukuranKertas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ukuran Kertas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Ukuran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="F4">F4</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orientasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientasi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Orientasi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Portrait">Portrait</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
             <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-0">
               <FormField
                control={form.control}
                name="marginTop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin Atas</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marginRight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin Kanan</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marginBottom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin Bawah</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marginLeft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin Kiri</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Editor Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="htmlTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTML Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="font-mono text-sm min-h-[300px]" placeholder="<div>Isi surat...</div>" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cssTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom CSS</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="font-mono text-sm min-h-[150px]" placeholder=".header { font-weight: bold; }" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-8">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Aktif</FormLabel>
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
        </div>
      )}
    </BaseResourceForm>
  );
}