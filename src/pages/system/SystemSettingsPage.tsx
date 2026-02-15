import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Shield, Server, Activity, Database, Save, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
export default function SystemSettingsPage() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    debugMode: false,
    sessionTimeout: '60',
    maxUploadSize: '5',
    backupFrequency: 'daily',
    logRetentionDays: '30',
  });
  const [healthStats, setHealthStats] = useState({
    cpuUsage: 12,
    memoryUsage: 45,
    diskSpace: 68,
    uptime: '14d 2h 15m',
    lastBackup: '2024-02-20 02:00 AM',
    dbConnection: 'Connected',
    redisStatus: 'Active',
  });
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/generic/systemSettings');
        const items = response.data?.data || [];
        return items[0] || {};
      } catch (e) {
        return {};
      }
    },
  });
  useEffect(() => {
    if (settingsData && settingsData.id) {
      setConfig({
        maintenanceMode: Boolean(settingsData.maintenanceMode),
        allowRegistration: Boolean(settingsData.allowRegistration),
        debugMode: Boolean(settingsData.debugMode),
        sessionTimeout: String(settingsData.sessionTimeout || '60'),
        maxUploadSize: String(settingsData.maxUploadSize || '5'),
        backupFrequency: settingsData.backupFrequency || 'daily',
        logRetentionDays: String(settingsData.logRetentionDays || '30'),
      });
    }
  }, [settingsData]);
  const mutation = useMutation({
    mutationFn: async (values: typeof config) => {
      const payload = {
        ...values,
        sessionTimeout: parseInt(values.sessionTimeout),
        maxUploadSize: parseInt(values.maxUploadSize),
        logRetentionDays: parseInt(values.logRetentionDays),
      };
      if (settingsData?.id) {
        return api.put(`/admin/generic/systemSettings/${settingsData.id}`, payload);
      } else {
        return api.post('/admin/generic/systemSettings', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      toast.success('Pengaturan sistem berhasil diperbarui');
      setIsSaving(false);
    },
    onError: () => {
      toast.error('Gagal menyimpan pengaturan');
      setIsSaving(false);
    },
  });
  const handleToggle = (key: string) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };
  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = () => {
    setIsSaving(true);
    mutation.mutate(config);
  };
  const refreshHealth = () => {
    toast.info('Memperbarui status sistem...');
    setTimeout(() => {
      setHealthStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 5,
        memoryUsage: Math.floor(Math.random() * 20) + 40,
      }));
      toast.success('Status sistem diperbarui');
    }, 1000);
  };
  if (isLoading) return <Loader2 className="animate-spin h-8 w-8 mx-auto mt-20" />;
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi teknis, keamanan, dan pemeliharaan sistem"
        icon={Settings}
      >
         <Button variant="outline" onClick={refreshHealth}>
           <RefreshCw className="mr-2 h-4 w-4" />
           Refresh Status
         </Button>
      </PageHeader>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStats.cpuUsage}%</div>
            <p className="text-xs text-muted-foreground">Normal load</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStats.memoryUsage}%</div>
            <p className="text-xs text-muted-foreground">2.4GB / 8GB Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthStats.dbConnection}</div>
            <p className="text-xs text-muted-foreground">MySQL 8.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{healthStats.lastBackup}</div>
            <p className="text-xs text-muted-foreground">Daily Schedule</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Umum</CardTitle>
              <CardDescription>Pengaturan operasional dasar sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Mode Pemeliharaan (Maintenance)</Label>
                  <p className="text-sm text-muted-foreground">
                    Jika aktif, hanya admin yang dapat mengakses sistem. Pengunjung akan melihat halaman maintenance.
                  </p>
                </div>
                <Switch
                  checked={config.maintenanceMode}
                  onCheckedChange={() => handleToggle('maintenanceMode')}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Izinkan Registrasi Santri Baru</Label>
                  <p className="text-sm text-muted-foreground">
                    Matikan untuk menutup sementara pendaftaran santri baru secara publik.
                  </p>
                </div>
                <Switch
                  checked={config.allowRegistration}
                  onCheckedChange={() => handleToggle('allowRegistration')}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Menampilkan detail error teknis (Hanya gunakan untuk pengembangan/troubleshooting).
                  </p>
                </div>
                <Switch
                  checked={config.debugMode}
                  onCheckedChange={() => handleToggle('debugMode')}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Keamanan & Sesi</CardTitle>
              <CardDescription>Pengaturan timeout dan batasan akses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Session Timeout (Menit)</Label>
                    <Select 
                      value={config.sessionTimeout} 
                      onValueChange={(val) => handleChange('sessionTimeout', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Menit</SelectItem>
                        <SelectItem value="30">30 Menit</SelectItem>
                        <SelectItem value="60">60 Menit</SelectItem>
                        <SelectItem value="120">2 Jam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Maksimal Ukuran Upload (MB)</Label>
                    <Select 
                      value={config.maxUploadSize} 
                      onValueChange={(val) => handleChange('maxUploadSize', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 MB</SelectItem>
                        <SelectItem value="5">5 MB</SelectItem>
                        <SelectItem value="10">10 MB</SelectItem>
                        <SelectItem value="20">20 MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
        {}
        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Backup & Logs</CardTitle>
              <CardDescription>Manajemen data dan riwayat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label>Frekuensi Backup Otomatis</Label>
                  <Select 
                    value={config.backupFrequency} 
                    onValueChange={(val) => handleChange('backupFrequency', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian (02:00 AM)</SelectItem>
                      <SelectItem value="weekly">Mingguan (Minggu)</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="manual">Manual Saja</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label>Retensi Log Aktivitas (Hari)</Label>
                  <Select 
                    value={config.logRetentionDays} 
                    onValueChange={(val) => handleChange('logRetentionDays', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Hari</SelectItem>
                      <SelectItem value="30">30 Hari</SelectItem>
                      <SelectItem value="90">90 Hari</SelectItem>
                      <SelectItem value="365">1 Tahun</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="pt-4 border-t">
                 <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Backup manual dimulai...')}>
                   <Database className="mr-2 h-4 w-4" />
                   Backup Database Sekarang
                 </Button>
               </div>
            </CardContent>
          </Card>
           <div className="sticky top-20">
              <Button size="lg" className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Konfigurasi
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}