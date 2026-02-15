import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Check, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
interface Program {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string;
  gambar?: string;
}
const ProgramDetail = () => {
  const { slug } = useParams();
  const { data: programs, isLoading, error } = usePublicData<Program[]>(['programs'], '/core/programs');
  const program = programs?.find((p) => p.slug === slug);
  if (isLoading) {
    return (
       <SectionWrapper>
        <div className="max-w-3xl mx-auto h-96 bg-muted animate-pulse rounded-xl" />
      </SectionWrapper>
    );
  }
  if (error || (!isLoading && !program)) {
    return (
      <SectionWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Program tidak ditemukan</h2>
          <Link to="/program" className="text-primary hover:underline">Kembali ke Program</Link>
        </div>
      </SectionWrapper>
    );
  }
  if (!program) return null;
  return (
    <>
      <PageHeader
        title={program.nama}
        subtitle={program.deskripsi.substring(0, 100) + '...'}
        breadcrumbs={[{ label: 'Program', href: '/program' }, { label: program.nama }]}
      />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center overflow-hidden">
                {program.gambar ? (
                  <img src={program.gambar} alt={program.nama} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-7 h-7 text-primary-foreground" />
                )}
              </div>
              <div>
                <span className="px-2.5 py-1 text-xs font-medium rounded bg-primary/10 text-primary">Reguler</span>
                <p className="text-sm text-muted-foreground mt-1">Durasi: 3 Tahun</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Keunggulan Program</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {['Kurikulum Terpadu', 'Tenaga Pengajar Profesional', 'Fasilitas Lengkap', 'Ekstrakurikuler Beragam'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-3">Tentang Program</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
              {program.deskripsi}
            </p>
            <Link to="/pendaftaran" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground">
              Daftar Program Ini
            </Link>
          </motion.div>
          <Link to="/program" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-6">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Program
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
};
export default ProgramDetail;