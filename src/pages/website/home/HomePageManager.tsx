import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Home, Save, Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-pesantren.jpg';
export default function HomePageManager() {
  const queryClient = useQueryClient();
  const [settingsData, setSettingsData] = useState({
    announcementText: '',
    announcementLink: '',
    announcementActive: false,
    heroCtaPrimaryText: 'Daftar Sekarang',
    heroCtaPrimaryLink: '/pendaftaran',
    heroCtaSecondaryText: 'Kenali Kami',
    heroCtaSecondaryLink: '/profil/sejarah',
  });
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      const response = await api.get('/admin/generic/websiteSettings');
      return response.data?.data?.[0] || {};
    },
  });
  useEffect(() => {
    if (settings) {
      setSettingsData(prev => ({
        ...prev,
        announcementText: settings.announcementText || '',
        announcementLink: settings.announcementLink || '',
        announcementActive: settings.announcementActive || false,
        heroCtaPrimaryText: settings.heroCtaPrimaryText || 'Daftar Sekarang',
        heroCtaPrimaryLink: settings.heroCtaPrimaryLink || '/pendaftaran',
        heroCtaSecondaryText: settings.heroCtaSecondaryText || 'Kenali Kami',
        heroCtaSecondaryLink: settings.heroCtaSecondaryLink || '/profil/sejarah',
      }));
    }
  }, [settings]);
  const settingsMutation = useMutation({
    mutationFn: async (values: typeof settingsData) => {
      if (settings?.id) {
        return api.put(`/admin/generic/websiteSettings/${settings.id}`, values);
      }
      return api.post('/admin/generic/websiteSettings', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteSettings'] });
      toast.success('Pengaturan halaman depan berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan pengaturan'),
  });
  const { data: slides, isLoading: slidesLoading } = useQuery({
    queryKey: ['heroSections'],
    queryFn: async () => {
      const response = await api.get('/core/hero');
      return response.data || [];
    },
  });
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/core/hero/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSections'] });
      toast.success('Slide berhasil dihapus');
    },
  });
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };
  const handleSwitchChange = (checked: boolean) => {
    setSettingsData(prev => ({ ...prev, announcementActive: checked }));
  };
  if (settingsLoading || slidesLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto mt-20" />;
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <PageHeader
        title="Manajemen Halaman Depan"
        description="Atur konten yang tampil di halaman utama website (Home)"
        icon={Home}
      />
      {}
      <Card>
        <CardHeader>
          <CardTitle>Pengumuman Atas (Top Banner)</CardTitle>
          <CardDescription>Baris pengumuman kecil di bagian paling atas hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="announcementActive" checked={settingsData.announcementActive} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="announcementActive">Aktifkan Banner Pengumuman</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="announcementText">Teks Pengumuman</Label>
              <Input
                id="announcementText"
                name="announcementText"
                value={settingsData.announcementText}
                onChange={handleSettingsChange}
                placeholder="Contoh: Pendaftaran Santri Baru Telah Dibuka"
                disabled={!settingsData.announcementActive}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementLink">Link Tujuan (Opsional)</Label>
              <Input
                id="announcementLink"
                name="announcementLink"
                value={settingsData.announcementLink}
                onChange={handleSettingsChange}
                placeholder="/pendaftaran"
                disabled={!settingsData.announcementActive}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero Slider</CardTitle>
            <CardDescription>Gambar slide utama di halaman depan (Maksimal 3 disarankan)</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link to="/admin/hero-sections/new">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Slide
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              Belum ada slide. Silakan tambah slide baru.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide: any) => (
                <div key={slide.id} className="group relative rounded-lg border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {slide.image ? (
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.src = heroImage;
                        }}
                      />
                    ) : (
                      <img src={heroImage} alt="Default" className="w-full h-full object-cover opacity-50 grayscale" />
                    )}
                    {!slide.isActive && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="secondary">Nonaktif</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold truncate" title={slide.title}>{slide.title}</h4>
                    <p className="text-xs text-muted-foreground truncate" title={slide.subtitle}>{slide.subtitle}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground">Urutan: {slide.order}</span>
                      <div className="flex gap-2">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link to={`/admin/hero-sections/${slide.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm('Hapus slide ini?')) deleteSlideMutation.mutate(slide.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {slides.filter((s: any) => s.isActive).length > 3 && (
            <p className="text-xs text-amber-600 mt-4">
              * Peringatan: Anda memiliki lebih dari 3 slide aktif. Ini mungkin memperlambat loading halaman.
            </p>
          )}
        </CardContent>
      </Card>
      {}
      <Card>
        <CardHeader>
          <CardTitle>Tombol Aksi (Call to Action)</CardTitle>
          <CardDescription>Pengaturan tombol utama di Hero Section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-primary">Tombol Utama (Primary)</h4>
              <div className="space-y-2">
                <Label>Teks Tombol</Label>
                <Input name="heroCtaPrimaryText" value={settingsData.heroCtaPrimaryText} onChange={handleSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label>Link Tujuan</Label>
                <Input name="heroCtaPrimaryLink" value={settingsData.heroCtaPrimaryLink} onChange={handleSettingsChange} />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Tombol Kedua (Secondary)</h4>
              <div className="space-y-2">
                <Label>Teks Tombol</Label>
                <Input name="heroCtaSecondaryText" value={settingsData.heroCtaSecondaryText} onChange={handleSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label>Link Tujuan</Label>
                <Input name="heroCtaSecondaryLink" value={settingsData.heroCtaSecondaryLink} onChange={handleSettingsChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {}
      <Card className="bg-secondary/20 border-dashed">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h4 className="font-semibold">Statistik Website</h4>
            <p className="text-sm text-muted-foreground">Kelola angka statistik (Santri, Guru, Alumni, Prestasi)</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin/statistics">Kelola Statistik</Link>
          </Button>
        </CardContent>
      </Card>
      <div className="flex justify-end sticky bottom-6">
        <Button size="lg" onClick={() => settingsMutation.mutate(settingsData)} disabled={settingsMutation.isPending} className="shadow-lg">
          {settingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}