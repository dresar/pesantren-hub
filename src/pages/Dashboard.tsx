import { PageHeader, StatsCard } from '@/components/common';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Newspaper,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  dashboardStats,
  monthlyRegistrationData,
  revenueData,
  statusDistribution,
  recentActivities,
  formatCurrency,
  getRelativeTime,
} from '@/lib/mock-data';
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
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(152, 69%, 40%)', 'hsl(199, 89%, 48%)', 'hsl(43, 96%, 56%)', 'hsl(0, 84%, 60%)'];

const activityIcons = {
  registration: GraduationCap,
  payment: CreditCard,
  post: Newspaper,
  announcement: FileText,
};

const activityColors = {
  registration: 'text-primary bg-primary/10',
  payment: 'text-success bg-success/10',
  post: 'text-info bg-info/10',
  announcement: 'text-warning bg-warning/10',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Selamat datang di Admin Panel Pesantren"
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Santri"
          value={dashboardStats.totalStudents.toLocaleString('id-ID')}
          description="Santri terdaftar"
          icon={GraduationCap}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pembayaran Verified"
          value={dashboardStats.paymentsVerified.toLocaleString('id-ID')}
          description="Lunas terverifikasi"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending"
          value={dashboardStats.pendingRegistrations.toLocaleString('id-ID')}
          description="Menunggu verifikasi"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Artikel"
          value={dashboardStats.blogPosts}
          description="Total publikasi"
          icon={Newspaper}
          variant="default"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Pengajar Aktif"
          value={dashboardStats.activeTeachers}
          description="Ustadz & Ustadzah"
          icon={UserCheck}
          variant="default"
        />
        <StatsCard
          title="Total Pemasukan"
          value={formatCurrency(dashboardStats.totalRevenue).replace('Rp', 'Rp ')}
          description="Tahun berjalan"
          icon={CreditCard}
          variant="accent"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
        {/* Registration Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pendaftaran Bulanan
            </CardTitle>
            <CardDescription>Jumlah pendaftaran santri per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRegistrationData}>
                  <defs>
                    <linearGradient id="colorRegistration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 84%, 24%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 84%, 24%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(174, 84%, 24%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRegistration)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-accent" />
              Pendapatan Bulanan
            </CardTitle>
            <CardDescription>Total pembayaran yang diterima per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                  />
                  <Bar dataKey="value" fill="hsl(43, 74%, 49%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* Status Distribution */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              Distribusi Status
            </CardTitle>
            <CardDescription>Status pendaftaran santri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="ml-auto text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-info" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>Kegiatan terbaru di sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
