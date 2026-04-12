import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Bell, BookOpen, HelpCircle, CreditCard, FileDown, User, Calendar, MessageSquare, ArrowRight, Lock, Bug } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useSantriDashboard, useLastPayment } from '@/hooks/use-santri';
import jsPDF from 'jspdf';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useSantriDashboard();
  const { data: lastPayment } = useLastPayment();
  const userIdentifier = (user as any)?.username || user?.id || '';

  const { data: systemSettings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/settings');
        return response.data || {};
      } catch (e) {
        return {};
      }
    }
  });

  const [showRegistrationClosed, setShowRegistrationClosed] = useState(false);

  useEffect(() => {
    if (systemSettings && systemSettings.allowRegistration === false) {
       const status = data?.registrationStatus?.status;
       // Tampilkan modal jika status masih draft atau submitted (belum diterima)
       if (!status || status === 'draft') {
          setShowRegistrationClosed(true);
       }
    }
  }, [systemSettings, data]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-500 mb-6 max-w-md">Terjadi kesalahan saat mengambil data dashboard Anda. Silakan coba muat ulang halaman.</p>
        <Button onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  const statusColor = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    verified: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabel = {
    draft: 'Draft',
    submitted: 'Terkirim',
    verified: 'Diverifikasi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  };

  const quickActions = [
    { 
        icon: ClipboardList, 
        label: 'Form Pendaftaran', 
        href: `/app/form-pendaftaran/${userIdentifier}`, 
        color: 'bg-emerald-500',
        desc: 'Lengkapi data diri'
    },
    { 
        icon: Bell, 
        label: 'Notifikasi', 
        href: `/app/notifikasi/${userIdentifier}`, 
        color: 'bg-amber-500',
        desc: 'Cek pesan masuk'
    },
    { 
        icon: BookOpen, 
        label: 'Akademik', 
        href: `/app/jadwal/${userIdentifier}`, 
        color: 'bg-slate-700',
        desc: 'Jadwal & Nilai'
    },
    { 
        icon: HelpCircle, 
        label: 'Bantuan', 
        href: '/kontak', 
        color: 'bg-slate-700',
        desc: 'Hubungi admin'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Assalamu'alaikum, <span className="text-primary capitalize">{user?.firstName || user?.username}</span>! 👋
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Selamat datang di Portal Santri Raudhatussalam.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Debug Mode Indicator */}
                {systemSettings?.debugMode && (
                    <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 animate-pulse" title="Debug Mode Active">
                         <Bug className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                         <span className="text-xs font-bold text-amber-700 dark:text-amber-300 hidden sm:inline">DEBUG</span>
                    </div>
                )}

                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(user?.firstName?.[0] || 'S').toUpperCase()}
                    </div>
                    <div className="pr-4">
                        <p className="text-xs text-muted-foreground">Status Akun</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-medium">Aktif</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border hover:shadow-md transition-all duration-300"
            >
              <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full ${item.color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg shadow-${item.color}/20 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Card */}
            <Card className="lg:col-span-2 shadow-sm border-none ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                    <CardTitle>Status Pendaftaran</CardTitle>
                    <CardDescription>Pantau progres pendaftaran Anda secara real-time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${data?.registrationStatus?.status === 'verified' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-500'}`}>
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status Saat Ini</p>
                                <Badge variant="outline" className={`mt-1 text-sm px-3 py-1 capitalize ${statusColor[data?.registrationStatus?.status || 'draft']}`}>
                                    {statusLabel[data?.registrationStatus?.status || 'draft']}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {data?.registrationStatus?.message || 'Silakan lengkapi formulir pendaftaran Anda untuk melanjutkan ke tahap berikutnya.'}
                        </p>
                        
                        <div className="mt-6 flex gap-3">
                            <Button asChild>
                                <Link to={`/app/status/${userIdentifier}`}>
                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Announcements Card */}
            <Card className="shadow-sm border-none ring-1 ring-slate-200 dark:ring-slate-800 h-full">
                <CardHeader>
                    <CardTitle>Pengumuman</CardTitle>
                    <CardDescription>Informasi terbaru dari pondok</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data?.announcements && data.announcements.length > 0 ? (
                            data.announcements.slice(0, 3).map((announcement: any, idx: number) => (
                                <div key={idx} className="pb-4 border-b last:border-0 last:pb-0">
                                    <h4 className="font-medium text-sm line-clamp-1 mb-1">{announcement.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{announcement.content}</p>
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-500">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">Belum ada pengumuman terbaru</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Payment History */}
        {lastPayment && (
            <Card className="shadow-sm border-none ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Riwayat Pembayaran Terakhir</CardTitle>
                                <CardDescription>Transaksi terakhir Anda</CardDescription>
                            </div>
                        </div>
                        <Badge variant={lastPayment.status === 'verified' ? 'default' : 'secondary'}>
                            {lastPayment.status === 'verified' ? 'Berhasil' : 'Menunggu'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Tanggal</p>
                            <p className="font-medium">{new Date(lastPayment.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                            <p className="text-xs text-muted-foreground">{new Date(lastPayment.created_at).toLocaleTimeString('id-ID')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Nominal</p>
                            <p className="font-medium text-lg text-primary">Rp {Number(lastPayment.jumlah_transfer).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Bank Pengirim</p>
                            <p className="font-medium">{lastPayment.bank_pengirim}</p>
                            <p className="text-xs text-muted-foreground">{lastPayment.no_rekening_pengirim}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Rekening Tujuan</p>
                            <p className="font-medium">{lastPayment.rekening_tujuan}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/app/pembayaran/${userIdentifier}`}>
                                Kelola Pembayaran
                            </Link>
                        </Button>
                        {lastPayment.bukti_transfer && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={lastPayment.bukti_transfer} target="_blank" rel="noreferrer">
                                    Lihat Bukti
                                </a>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        )}

        <Dialog open={showRegistrationClosed} onOpenChange={setShowRegistrationClosed}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Lock className="h-5 w-5" />
                Pendaftaran Ditutup
              </DialogTitle>
              <DialogDescription className="pt-2 text-base">
                Mohon maaf, pendaftaran santri baru saat ini sedang ditutup oleh admin. 
                Anda masih dapat mengakses dashboard, namun fitur pendaftaran mungkin dibatasi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <Button variant="secondary" onClick={() => setShowRegistrationClosed(false)}>
                Saya Mengerti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </motion.div>
    </div>
  );
};

export default DashboardPage;
