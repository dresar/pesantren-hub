import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
interface ScheduleItem {
  id: number;
  waktu: string;
  judul: string;
  deskripsi: string;
  kategori: string;
}
const typeColors: Record<string, string> = {
  ibadah: 'bg-primary/15 text-primary border-primary/30',
  akademik: 'bg-accent/15 text-accent border-accent/30',
  ekstrakurikuler: 'bg-emerald-light/15 text-emerald-light border-emerald-light/30',
  istirahat: 'bg-muted text-muted-foreground border-border',
};
const typeLabels: Record<string, string> = {
  ibadah: 'Ibadah',
  akademik: 'Akademik',
  ekstrakurikuler: 'Ekskul',
  istirahat: 'Istirahat',
};
const inferType = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('shalat') || lower.includes('tahfizh') || lower.includes('ngaji') || lower.includes('tilawah') || lower.includes('subuh') || lower.includes('maghrib') || lower.includes('isya') || lower.includes('dzuhur') || lower.includes('ashar')) return 'ibadah';
  if (lower.includes('makan') || lower.includes('istirahat') || lower.includes('mandi') || lower.includes('tidur') || lower.includes('bangun')) return 'istirahat';
  if (lower.includes('ekskul') || lower.includes('olahraga') || lower.includes('pramuka')) return 'ekstrakurikuler';
  return 'akademik';
};
const JadwalPage = () => {
  const { data: schedule, isLoading, error } = usePublicData<ScheduleItem[]>(['jadwal-harian'], '/core/jadwal-harian');
  if (isLoading) {
    return (
       <>
        <PageHeader title="Jadwal Harian Santri" subtitle="Rutinitas harian yang terstruktur dari subuh hingga malam." breadcrumbs={[{ label: 'Kehidupan Santri' }, { label: 'Jadwal' }]} />
        <SectionWrapper>
          <div className="max-w-2xl mx-auto space-y-2">
             {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
             ))}
          </div>
        </SectionWrapper>
      </>
    );
  }
  if (error) {
     return (
      <SectionWrapper>
        <div className="text-center text-destructive">Failed to load schedule.</div>
      </SectionWrapper>
    );
  }
  return (
    <>
      <PageHeader title="Jadwal Harian Santri" subtitle="Rutinitas harian yang terstruktur dari subuh hingga malam." breadcrumbs={[{ label: 'Kehidupan Santri' }, { label: 'Jadwal' }]} />
      <SectionWrapper>
        <div className="max-w-2xl mx-auto">
          {}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(typeColors).map((t) => (
              <span key={t} className={`px-3 py-1 text-xs font-medium rounded-full border ${typeColors[t]}`}>{typeLabels[t]}</span>
            ))}
          </div>
          <div className="space-y-2">
            {schedule?.map((item, i) => {
              const type = inferType(item.judul);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 p-3 md:p-4 rounded-xl border ${typeColors[type]}`}
                >
                  <span className="text-sm font-mono font-bold w-12 shrink-0">{item.waktu}</span>
                  <div className="w-px h-6 bg-border" />
                  <span className="text-sm flex-1">{item.judul}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-background/30 hidden sm:inline">{typeLabels[type]}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};
export default JadwalPage;