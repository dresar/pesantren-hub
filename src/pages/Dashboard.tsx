import React from 'react';
import { PageHeader } from '@/components/common';
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Users,
  Calendar,
  FileText,
  Settings,
  PlusCircle,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
export default function DashboardPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedTime = format(currentTime, 'HH:mm:ss', { locale: id });
  const formattedDate = format(currentTime, 'EEEE, d MMMM yyyy', { locale: id });
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
    refetchInterval: 300000, // 5 minutes
  });
  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }
  const totalSantri = stats?.totalSantri || 0;
  const pendingPayments = stats?.pendingPayments || 0;
  const verifiedPayments = stats?.verifiedPayments || 0;
  const pendingVerifications = stats?.pendingVerifications || [];
  const genderDistribution = stats?.genderDistribution || [];
  const registrationStats = stats?.registrationStats || [];
  const financialTrend = [
    { name: 'Jan', income: 12500000, expense: 8000000 },
    { name: 'Feb', income: 15000000, expense: 9500000 },
    { name: 'Mar', income: 18200000, expense: 10000000 },
    { name: 'Apr', income: 14000000, expense: 11000000 },
    { name: 'May', income: 21000000, expense: 12000000 },
    { name: 'Jun', income: 25000000, expense: 14000000 },
  ];
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Selamat datang kembali di Panel Administrasi Pesantren Hub. Pantau seluruh aktivitas dan perkembangan pesantren secara real-time.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-sm">
              <Clock className="h-5 w-5 text-blue-100" />
              <span className="text-xl font-mono font-semibold tracking-widest">{formattedTime}</span>
            </div>
            <div className="text-blue-200 text-sm font-medium">{formattedDate}</div>
          </div>
        </div>
      </div>
      {}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardPro
          title="Total Santri"
          value={totalSantri}
          icon={GraduationCap}
          trend="+12%"
          trendUp={true}
          description="Sejak bulan lalu"
          color="text-blue-600"
          bg="bg-blue-50 dark:bg-blue-900/20"
          borderColor="border-blue-200 dark:border-blue-800"
        />
        <StatsCardPro
          title="Keuangan Masuk"
          value={`Rp ${verifiedPayments.toLocaleString()}`} 
          icon={Wallet}
          trend="+8.2%"
          trendUp={true}
          description="Total pemasukan bulan ini"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-900/20"
          borderColor="border-emerald-200 dark:border-emerald-800"
        />
        <StatsCardPro
          title="Menunggu Verifikasi"
          value={pendingPayments}
          icon={Clock}
          trend="-2%"
          trendUp={false} 
          description="Pembayaran pending"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-900/20"
          borderColor="border-amber-200 dark:border-amber-800"
        />
        <StatsCardPro
          title="Total Pengguna"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend="+4"
          trendUp={true}
          description="User aktif sistem"
          color="text-indigo-600"
          bg="bg-indigo-50 dark:bg-indigo-900/20"
          borderColor="border-indigo-200 dark:border-indigo-800"
        />
      </div>
      {}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tambah Santri', icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', link: '/admin/admissions/new' },
          { label: 'Verifikasi Pembayaran', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100', link: '/admin/payments' },
          { label: 'Buat Pengumuman', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100', link: '/admin/announcements' },
          { label: 'Pengaturan Sistem', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-50 hover:bg-slate-100', link: '/admin/settings' },
        ].map((action, i) => (
          <a 
            key={i} 
            href={action.link}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
              action.bg,
              "dark:bg-slate-800 dark:hover:bg-slate-700"
            )}
          >
            <div className={cn("p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm", action.color)}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
          </a>
        ))}
      </div>
      {}
      <div className="grid gap-6 lg:grid-cols-7">
        {}
        <Card className="lg:col-span-4 shadow-md border-none ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Arus Kas Keuangan</CardTitle>
                <CardDescription>Pemasukan vs Pengeluaran (6 Bulan Terakhir)</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={financialTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Rp${value/1000000}M`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {}
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-md border-none ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader>
              <CardTitle>Distribusi Santri</CardTitle>
              <CardDescription>Berdasarkan Jenis Kelamin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {}
                      {genderDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-3xl font-bold block">{totalSantri}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                {}
                {genderDistribution.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Statistik Pendaftaran</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>Tren pendaftaran santri baru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={registrationStats}>
                    <XAxis dataKey="name" hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none' }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md border-none ring-1 ring-slate-200 dark:ring-slate-800 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>Log aktivitas sistem terkini</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      User {i} melakukan update pada <span className="text-primary">Data Santri</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i * 5 + 2} menit yang lalu
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-none ring-1 ring-slate-200 dark:ring-slate-800 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menunggu Verifikasi</CardTitle>
                <CardDescription>Pembayaran yang perlu dicek</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mb-2 text-muted-foreground/20" />
                  <p>Semua pembayaran telah diverifikasi</p>
                </div>
              ) : (
                pendingVerifications.slice(0, 4).map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{payment.santri?.namaLengkap}</p>
                        <p className="text-xs text-muted-foreground">Rp {Number(payment.jumlahTransfer).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">Review</Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatsCardPro({ title, value, icon: Icon, trend, trendUp, description, color, bg, borderColor }: any) {
  return (
    <Card className={cn(
      "shadow-sm border ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden relative group hover:shadow-lg transition-all duration-300",
      borderColor
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className={cn("h-24 w-24", color)} />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full", bg)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {trendUp ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
          )}
          <span className={cn("font-medium", trendUp ? "text-emerald-500" : "text-rose-500")}>
            {trend}
          </span>
          <span className="text-muted-foreground ml-1">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}