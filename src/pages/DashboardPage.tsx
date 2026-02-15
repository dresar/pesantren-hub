import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Bell, BookOpen, HelpCircle, CreditCard, FileDown } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useSantriDashboard, useLastPayment } from '@/hooks/use-santri';
import jsPDF from 'jspdf';
import { Skeleton } from '@/components/ui/skeleton';
const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useSantriDashboard();
  const { data: lastPayment } = useLastPayment();
  const userIdentifier = (user as any)?.username || user?.id || '';
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-destructive font-medium mb-2">Gagal memuat data dashboard</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }
  const statusColor = {
    draft: 'text-muted-foreground',
    submitted: 'text-blue-500',
    verified: 'text-yellow-500',
    accepted: 'text-green-500',
    rejected: 'text-red-500',
  };
  const statusLabel = {
    draft: 'Belum Dikirim',
    submitted: 'Terkirim',
    verified: 'Diverifikasi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  };
  const handleDownloadPdf = () => {
    if (!lastPayment) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Bukti Pembayaran Pendaftaran', 20, 20);
    doc.setFontSize(12);
    doc.text(`Status: ${lastPayment.status}`, 20, 35);
    doc.text(`Tanggal: ${new Date(lastPayment.created_at).toLocaleString()}`, 20, 43);
    doc.text(`Jumlah: Rp ${Number(lastPayment.jumlah_transfer).toLocaleString('id-ID')}`, 20, 51);
    doc.text(`Bank Pengirim: ${lastPayment.bank_pengirim}`, 20, 59);
    doc.text(`No. Rekening: ${lastPayment.no_rekening_pengirim}`, 20, 67);
    doc.text(`Atas Nama: ${lastPayment.nama_pemilik_rekening}`, 20, 75);
    doc.text(`Rekening Tujuan: ${lastPayment.rekening_tujuan}`, 20, 83);
    if (lastPayment.catatan) doc.text(`Catatan: ${lastPayment.catatan}`, 20, 91);
    doc.save(`bukti-pembayaran-${lastPayment.id}.pdf`);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Assalamu'alaikum, {user?.firstName || user?.username || 'Santri'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang di portal santri Raudhatussalam.</p>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: ClipboardList, label: 'Form Pendaftaran', href: `/app/form-pendaftaran/${userIdentifier}`, color: 'gradient-primary text-primary-foreground' },
            { icon: Bell, label: 'Notifikasi', href: `/app/notifikasi/${userIdentifier}`, color: 'bg-accent text-accent-foreground' },
            { icon: BookOpen, label: 'Akademik', href: `/app/jadwal/${userIdentifier}`, color: 'bg-secondary text-foreground' },
            { icon: HelpCircle, label: 'Bantuan', href: '/kontak', color: 'bg-secondary text-foreground' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${item.color} hover:opacity-90 transition-opacity`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3">Status Pendaftaran</h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${data?.registrationStatus?.status === 'verified' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className={`text-sm font-medium ${statusColor[data?.registrationStatus?.status || 'draft']}`}>
                {statusLabel[data?.registrationStatus?.status || 'draft']}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {data?.registrationStatus?.message || 'Lengkapi formulir pendaftaran Anda.'}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3">Pengumuman</h3>
            {data?.announcements && data.announcements.length > 0 ? (
              <div className="space-y-3">
                {data.announcements.slice(0, 2).map((announcement: any) => (
                  <div key={announcement.id}>
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada pengumuman terbaru.</p>
            )}
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3">Bantuan</h3>
            <p className="text-sm text-muted-foreground mb-3">Butuh bantuan? Hubungi panitia pendaftaran.</p>
            <Link to="/kontak" className="text-sm text-primary font-medium hover:underline">Hubungi Kami</Link>
          </div>
          {lastPayment && (
            <div className="glass-card p-6 col-span-1 lg:col-span-3">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Riwayat Pembayaran Terakhir
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{lastPayment.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal</p>
                  <p className="font-medium">{new Date(lastPayment.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jumlah</p>
                  <p className="font-medium">Rp {Number(lastPayment.jumlah_transfer).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bank Pengirim</p>
                  <p className="font-medium">{lastPayment.bank_pengirim}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">No. Rekening</p>
                  <p className="font-mono">{lastPayment.no_rekening_pengirim}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rekening Tujuan</p>
                  <p className="font-medium">{lastPayment.rekening_tujuan}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                {lastPayment.bukti_transfer && (
                  <a href={lastPayment.bukti_transfer} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    Lihat Bukti Transfer
                  </a>
                )}
                <button onClick={handleDownloadPdf} className="text-sm text-primary hover:underline flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Unduh Bukti (PDF)
                </button>
                <Link to={`/app/pembayaran/${userIdentifier}`} className="text-sm text-primary hover:underline">
                  Kelola Pembayaran
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default DashboardPage;