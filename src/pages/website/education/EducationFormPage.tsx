import { BaseResourceForm } from '@/components/resources/BaseResourceForm';
import { z } from 'zod';
import { GraduationCap } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DualImageInput } from '@/components/forms/DualImageInput';
const educationSchema = z.object({
  nama: z.string().min(1, 'Nama program harus diisi'),
  akreditasi: z.string().optional(),
  icon: z.string().optional(),
  gambar: z.string().optional(),
  order: z.coerce.number().min(0),
});
type EducationForm = z.infer<typeof educationSchema>;
export default function EducationFormPage() {
  return (
    <BaseResourceForm<EducationForm>
      resource="education"
      title="Program Pendidikan"
      basePath="/admin/education"
      schema={educationSchema}
      defaultValues={{
        nama: '',
        akreditasi: '',
        icon: '',
        gambar: '',
        order: 0,
      }}
      icon={GraduationCap}
      apiEndpoint="/core/program-pendidikan"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Program Pendidikan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Madrasah Aliyah (MA)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="akreditasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akreditasi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Lucide name)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: graduation-cap" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gambar"
              render={({ field }) => (
                <FormItem>
                  <DualImageInput
                    label="Gambar Ilustrasi"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="https://..."
                    showMediaLibrary
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
        </>
      )}
    </BaseResourceForm>
  );
}