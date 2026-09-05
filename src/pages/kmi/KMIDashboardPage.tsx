import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  School, BookOpen, Users, Calendar, CheckSquare,
  NotebookPen, ScrollText, BookCheck, TrendingUp,
  AlertCircle, ChevronRight, Clock, Award, Star, Activity,
  Zap, Beaker
} from 'lucide-react';
import { api } from '@/lib/api';
import { useKMIMode } from '@/hooks/use-kmi-mode';
import { MOCK_DASHBOARD } from './KMI_MOCKS';

interface DashboardStats {
  totalKelas: number;
  totalSantri: number;
  totalMapel: number;
  totalGuru: number;
  absensiHariIni: number;
  nilaiMenunggu: number;
  raporDraft: number;
  tahunAjaran: string;
  semesterAktif: string;
}

const StatCard = ({ icon: Icon, label, value, color, href }: {
  icon: any; label: string; value: string | number; color: string; href?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${color} shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {href && (
      <Link to={href} className="absolute inset-0" />
    )}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, href, color }: {
  icon: any; label: string; href: string; color: string;
}) => (
  <Link to={href}>
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-medium">{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
    </motion.div>
  </Link>
);

export default function KMIDashboardPage() {
  const { isBetaMode, toggleMode } = useKMIMode();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [kalender, setKalender] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isBetaMode) {
      setStats(MOCK_DASHBOARD);
      setKalender([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [statsRes, kalRes] = await Promise.all([
          api.get('/kmi/dashboard/stats').catch(() => ({ data: null })),
          api.get('/kmi/kalender?upcoming=5').catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data || MOCK_DASHBOARD);
        setKalender(kalRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isBetaMode]);

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard KMI</h1>
              <p className="text-sm text-muted-foreground">Kulliyatul Mu'allimin Al-Islamiyah — {today}</p>
            </div>
          </div>
        </div>
        {stats && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <Star className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Tahun Ajaran {stats.tahunAjaran} • Semester {stats.semesterAktif}
            </span>
          </div>
        )}
      </motion.div>

      {/* Feature Under Development Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-4 text-amber-800 dark:text-amber-200 shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
          <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Fitur Dalam Pengembangan (Demo)</h3>
          <p className="text-xs opacity-90">
            Halaman ini adalah pratinjau antarmuka untuk fitur Manajemen Akademik KMI. 
            Semua data yang ditampilkan adalah data simulasi (mockup) dan belum terintegrasi dengan database.
          </p>
        </div>
        <div className="hidden sm:block">
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Santri" value={stats?.totalSantri ?? '—'} color="from-blue-500 to-blue-700" href="/admin/kmi/kelas" />
        <StatCard icon={School} label="Total Kelas" value={stats?.totalKelas ?? '—'} color="from-emerald-500 to-emerald-700" href="/admin/kmi/kelas" />
        <StatCard icon={BookOpen} label="Mata Pelajaran" value={stats?.totalMapel ?? '—'} color="from-purple-500 to-purple-700" href="/admin/kmi/mapel" />
        <StatCard icon={Users} label="Tenaga Pengajar" value={stats?.totalGuru ?? '—'} color="from-amber-500 to-amber-700" href="/admin/kmi/guru-mapel" />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: CheckSquare, label: 'Kelas Belum Absen', value: stats?.absensiHariIni ?? 0, color: 'border-l-orange-400 bg-orange-50 dark:bg-orange-950/30', href: '/admin/kmi/absensi', desc: 'kelas belum input absensi hari ini' },
          { icon: NotebookPen, label: 'Nilai Menunggu', value: stats?.nilaiMenunggu ?? 0, color: 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/30', href: '/admin/kmi/nilai', desc: 'entri nilai belum diinput' },
          { icon: ScrollText, label: 'Rapor Draft', value: stats?.raporDraft ?? 0, color: 'border-l-purple-400 bg-purple-50 dark:bg-purple-950/30', href: '/admin/kmi/rapor', desc: 'rapor perlu difinalisasi' },
        ].map(({ icon: Icon, label, value, color, href, desc }) => (
          <Link to={href} key={label}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl border-l-4 p-4 ${color} transition-all`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value} <span className="text-xs font-normal text-muted-foreground">{desc}</span></p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <QuickAction icon={CheckSquare} label="Input Absensi Hari Ini" href="/admin/kmi/absensi/input" color="bg-orange-500" />
            <QuickAction icon={NotebookPen} label="Input Nilai Santri" href="/admin/kmi/nilai" color="bg-blue-500" />
            <QuickAction icon={Users} label="Lihat Daftar Kelas" href="/admin/kmi/kelas" color="bg-emerald-500" />
            <QuickAction icon={BookOpen} label="Mata Pelajaran KMI" href="/admin/kmi/mapel" color="bg-purple-500" />
            <QuickAction icon={ScrollText} label="Generate Rapor" href="/admin/kmi/rapor" color="bg-rose-500" />
            <QuickAction icon={BookCheck} label="Ko-Kurikuler (Muwajjah)" href="/admin/kmi/kokur" color="bg-amber-500" />
          </div>
        </div>

        {/* Kalender Akademik Mendatang */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">Agenda Akademik Mendatang</h2>
            </div>
            <Link to="/admin/kmi/kalender" className="text-xs text-primary hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-3">
            {kalender.length === 0 ? (
              // Demo events
              [
                { judul: 'Imtihan Al-Sanah (UAS)', tipe: 'ujian', tanggal_mulai: '2026-06-01', warna: '#EF4444' },
                { judul: 'Wisuda Akbar KMI 2026', tipe: 'penting', tanggal_mulai: '2026-06-20', warna: '#10B981' },
                { judul: 'Input Nilai UAS Deadline', tipe: 'penting', tanggal_mulai: '2026-06-15', warna: '#8B5CF6' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.warna }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.judul}</p>
                    <p className="text-xs text-muted-foreground">{new Date(ev.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    ev.tipe === 'ujian' ? 'bg-red-100 text-red-700' :
                    ev.tipe === 'libur' ? 'bg-gray-100 text-gray-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{ev.tipe}</span>
                </div>
              ))
            ) : kalender.map((ev: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.warna || '#6B7280' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ev.judul}</p>
                  <p className="text-xs text-muted-foreground">{new Date(ev.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KMI Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">🕌 Kulliyatul Mu'allimin Wal-Muallimat Al-Islamiyah</h3>
            <p className="text-sm text-white/80">
              Sistem pendidikan integral 24 jam — Memadukan <strong>100% Ulum Islamiyah</strong> dan <strong>100% Ulum Ammah</strong>.
              Program Reguler 6 tahun & Program Intensif 4 tahun.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">30+</div>
              <div className="text-xs text-white/70">Mata Pelajaran</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">6</div>
              <div className="text-xs text-white/70">Jenjang KMI</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-white/70">Rumpun Ilmu</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
