import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
interface Ekstrakurikuler {
  id: number;
  nama: string;
  icon: string;
  gambar?: string;
}
const EkstrakurikulerPage = () => {
  const { data: extracurriculars, isLoading, error } = usePublicData<Ekstrakurikuler[]>(['ekstrakurikuler'], '/core/ekstrakurikuler');
  if (isLoading) {
    return (
       <>
        <PageHeader title="Ekstrakurikuler" subtitle="Pengembangan bakat dan minat santri melalui beragam kegiatan." breadcrumbs={[{ label: 'Kehidupan Santri' }, { label: 'Ekstrakurikuler' }]} />
        <SectionWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
             ))}
          </div>
        </SectionWrapper>
      </>
    );
  }
  if (error) {
     return (
      <SectionWrapper>
        <div className="text-center text-destructive">Failed to load extracurriculars.</div>
      </SectionWrapper>
    );
  }
  return (
    <>
      <PageHeader title="Ekstrakurikuler" subtitle="Pengembangan bakat dan minat santri melalui beragam kegiatan." breadcrumbs={[{ label: 'Kehidupan Santri' }, { label: 'Ekstrakurikuler' }]} />
      <SectionWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extracurriculars?.map((e, i) => {
            const Icon = LucideIcons[e.icon] || LucideIcons.BookOpen;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 hover-lift overflow-hidden relative group"
              >
                {e.gambar && (
                    <div className="absolute inset-0 z-0">
                        <img src={e.gambar} alt={e.nama} className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
                    </div>
                )}
                <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Ekstrakurikuler</span>
                    <h3 className="font-semibold mt-1 mb-2 text-foreground">{e.nama}</h3>
                    <p className="text-sm text-muted-foreground">Kegiatan {e.nama} untuk mengembangkan potensi santri.</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
};
export default EkstrakurikulerPage;