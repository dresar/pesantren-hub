import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Database } from 'lucide-react';
import { toast } from 'sonner';
import { DualImageInput } from '@/components/forms/DualImageInput';
const RESOURCE_FIELDS: Record<string, string[]> = {
  seragam: ['hari', 'seragamPutra', 'gambarPutra', 'seragamPutri', 'gambarPutri', 'order'],
  ekstrakurikuler: ['nama', 'icon', 'gambar', 'order'],
};
interface GenericResourceFormPageProps {
  resource: string;
  title: string;
  basePath: string;
}
export default function GenericResourceFormPage({ resource, title, basePath }: GenericResourceFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fields, setFields] = useState<string[]>(RESOURCE_FIELDS[resource] || ['nama', 'deskripsi', 'keterangan', 'status', 'is_active']);
  const { data: sampleData } = useQuery({
    queryKey: ['generic', resource, 'schema'],
    queryFn: async () => {
      const response = await api.get(`/admin/generic/${resource}`);
      return response.data;
    },
    enabled: !id, 
  });
  const { data: itemData, isLoading } = useQuery({
    queryKey: ['generic', resource, id],
    queryFn: async () => {
      const response = await api.get(`/admin/generic/${resource}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
  useEffect(() => {
    if (itemData) {
      setFormData(itemData);
      const keys = Object.keys(itemData).filter(k => 
        !['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'].includes(k) &&
        (typeof itemData[k] !== 'object' || itemData[k] === null)
      );
      if (keys.length > 0) setFields(keys);
    } else if (sampleData) {
        const items = Array.isArray(sampleData) ? sampleData : (sampleData?.data || []);
        if (items.length > 0) {
            const keys = Object.keys(items[0]).filter(k => 
                !['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'].includes(k) &&
                (typeof items[0][k] !== 'object' || items[0][k] === null)
            );
            if (keys.length > 0) setFields(keys);
        } else if (RESOURCE_FIELDS[resource]) {
            setFields(RESOURCE_FIELDS[resource]);
        }
    }
  }, [itemData, sampleData, resource]);
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (id) {
        return api.put(`/admin/generic/${resource}/${id}`, data);
      }
      return api.post(`/admin/generic/${resource}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generic', resource] });
      toast.success(id ? 'Data diperbarui' : 'Data berhasil disimpan');
      navigate(basePath);
    },
    onError: () => {
      toast.error('Gagal menyimpan data');
    }
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  if (id && isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={id ? `Edit ${title}` : `Tambah ${title}`} description={`Form ${title}`} icon={Database}>
        <Button variant="outline" onClick={() => navigate(basePath)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Informasi {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((key) => {
                const isImageField = key.toLowerCase().includes('image') || key.toLowerCase().includes('gambar') || key.toLowerCase().includes('foto');
                return (
                  <div key={key} className={`space-y-2 ${isImageField ? 'col-span-full' : ''}`}>
                    <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                    {isImageField ? (
                      <DualImageInput
                        value={formData[key] || ''}
                        onChange={(val) => setFormData({ ...formData, [key]: val })}
                        placeholder={`URL atau Upload ${key.replace(/_/g, ' ')}`}
                      />
                    ) : (
                      <Input
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={`Masukkan ${key}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}