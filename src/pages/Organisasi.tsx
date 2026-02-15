import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
interface TenagaPengajar {
  id: number;
  namaLengkap: string;
  bagianJabatanId: number; 
  foto?: string;
  order: number;
}
const Organisasi = () => {
  const { data: teachers, isLoading, error } = usePublicData<TenagaPengajar[]>(['tenaga-pengajar'], '/core/tenaga-pengajar');
  if (isLoading) {
    return (
       <>
        <PageHeader
          title="Struktur Organisasi"
          subtitle="Susunan pengurus Pondok Pesantren Modern Raudhatussalam."
          breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Organisasi' }]}
        />
        <SectionWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
             ))}
          </div>
        </SectionWrapper>
      </>
    );
  }
  if (error) {
     return (
      <SectionWrapper>
        <div className="text-center text-destructive">Failed to load organization structure.</div>
      </SectionWrapper>
    );
  }
  return (
    <>
      <PageHeader
        title="Struktur Organisasi"
        subtitle="Susunan pengurus Pondok Pesantren Modern Raudhatussalam."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Organisasi' }]}
      />
      <SectionWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teachers?.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 md:p-5 text-center hover-lift"
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg bg-muted text-muted-foreground overflow-hidden">
                {t.foto ? (
                  <img src={t.foto} alt={t.namaLengkap} className="w-full h-full object-cover" />
                ) : (
                  t.namaLengkap.split(' ').map(n => n[0]).slice(0, 2).join('')
                )}
              </div>
              <h3 className="font-semibold text-base line-clamp-2">{t.namaLengkap}</h3>
              {}
            </motion.div>
          ))}
        </div>
        {teachers?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Belum ada data pengurus.
          </div>
        )}
      </SectionWrapper>
    </>
  );
};
export default Organisasi;