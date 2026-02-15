import { PageHeader } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
export default function FinancialDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['financial-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
  });
  const mockMonthlyData = [
    { name: 'Jan', income: 4000000, expense: 2400000 },
    { name: 'Feb', income: 3000000, expense: 1398000 },
    { name: 'Mar', income: 2000000, expense: 9800000 },
    { name: 'Apr', income: 2780000, expense: 3908000 },
    { name: 'May', income: 1890000, expense: 4800000 },
    { name: 'Jun', income: 2390000, expense: 3800000 },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard Keuangan"
        description="Ringkasan dan analisis keuangan pesantren"
        icon={Wallet}
      />
      {}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 45.231.899</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3" /> +20.1%
              </span>
              dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingPayments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu verifikasi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Terverifikasi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.verifiedPayments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Transaksi berhasil
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santri Lunas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">
              Telah melunasi biaya masuk
            </p>
          </CardContent>
        </Card>
      </div>
      {}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Arus Kas (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Rp${value / 1000000}M`} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Statistik Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">Uang Pangkal</span>
                   </div>
                   <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">SPP Bulanan</span>
                   </div>
                   <span className="text-sm text-muted-foreground">30%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                   <div className="bg-blue-500 h-full rounded-full" style={{ width: '30%' }} />
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-sm font-medium">Donasi</span>
                   </div>
                   <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                   <div className="bg-yellow-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium">Lainnya</span>
                   </div>
                   <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                   <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }} />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}