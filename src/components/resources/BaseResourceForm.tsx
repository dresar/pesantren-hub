import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
interface BaseResourceFormProps<T extends FieldValues> {
  resource: string;
  title: string;
  basePath: string;
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  icon?: any;
  apiEndpoint?: string;
}
export function BaseResourceForm<T extends FieldValues>({
  resource,
  title,
  basePath,
  schema,
  defaultValues,
  children,
  icon: Icon,
  apiEndpoint,
}: BaseResourceFormProps<T>) {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const endpoint = apiEndpoint || `/admin/generic/${resource}`;
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { data: itemData, isLoading: isLoadingData } = useQuery({
    queryKey: ['resource', resource, id],
    queryFn: async () => {
      if (!isEdit) return null;
      const response = await api.get(`${endpoint}/${id}`);
      return response.data?.data || response.data;
    },
    enabled: isEdit,
  });
  useEffect(() => {
    if (itemData) {
      form.reset(itemData);
    }
  }, [itemData, form]);
  const mutation = useMutation({
    mutationFn: (values: T) => {
      const payload = { ...values };
      // Inject timestamps client-side as fallback
      if (!payload.createdAt) {
          (payload as any).createdAt = new Date().toISOString();
      }
      if (!payload.updatedAt) {
          (payload as any).updatedAt = new Date().toISOString();
      }

      if (isEdit) {
        return api.put(`${endpoint}/${id}`, payload);
      }
      return api.post(endpoint, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', resource] });
      toast.success(isEdit ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan');
      navigate(basePath);
    },
    onError: (error: any) => {
      // Clean up error message for display
      const message = error.response?.data?.message || 
                      error.response?.data?.details || 
                      error.message || 
                      'Terjadi kesalahan saat menyimpan data';
      
      // Avoid logging to console as requested
      // console.error(error);
      
      toast.error(message, {
        duration: 5000,
        description: error.response?.data?.details ? `Detail: ${error.response.data.details}` : undefined
      });
    },
  });
  const onSubmit = (values: T) => {
    mutation.mutate(values);
  };
  if (isEdit && isLoadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`${isEdit ? 'Edit' : 'Tambah'} ${title}`}
        description={`Form ${isEdit ? 'perubahan' : 'pembuatan'} data ${title}`}
        icon={Icon}
      >
        <Button variant="outline" onClick={() => navigate(basePath)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Informasi {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {children(form)}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(basePath)}
                  disabled={mutation.isPending}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}