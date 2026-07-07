import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  ChevronLeft as Prev, 
  ChevronRight as Next, 
  X,
  BookOpen,
  Calendar,
  Grid,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ProgramImage {
  id: number;
  gambar: string;
  altText: string;
}

interface EducationProgram {
  id: number;
  nama: string;
  akreditasi: string;
  icon: string;
  gambar?: string;
  order: number;
  images?: ProgramImage[];
}

interface FeaturedProgram {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string;
  gambar?: string;
  status: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const ProgramPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pendidikan' | 'unggulan'>('all');
  
  // Queries
  const { data: educationPrograms, isLoading: isLoadingEdu, error: errEdu } = 
    usePublicData<EducationProgram[]>(['education-programs'], '/core/program-pendidikan');
    
  const { data: featuredPrograms, isLoading: isLoadingFeatured, error: errFeatured } = 
    usePublicData<FeaturedProgram[]>(['programs'], '/core/programs');

  // Program modal state (for education programs)
  const [selectedProgram, setSelectedProgram] = useState<EducationProgram | null>(null);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const modalSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const openProgramModal = useCallback((prog: EducationProgram) => {
    setSelectedProgram(prog);
    setModalImgIndex(0);
  }, []);

  const closeProgramModal = useCallback(() => {
    setSelectedProgram(null);
    setModalImgIndex(0);
    if (modalSlideTimer.current) clearInterval(modalSlideTimer.current);
  }, []);

  // Auto-slide images in modal
  useEffect(() => {
    if (!selectedProgram) return;
    const imgs = selectedProgram.images || (selectedProgram.gambar ? [{ gambar: selectedProgram.gambar }] : []);
    if (imgs.length <= 1) return;
    modalSlideTimer.current = setInterval(() => {
      setModalImgIndex(prev => (prev + 1) % imgs.length);
    }, 3000);
    return () => { if (modalSlideTimer.current) clearInterval(modalSlideTimer.current); };
  }, [selectedProgram]);

  const isLoading = isLoadingEdu || isLoadingFeatured;
  const hasError = errEdu || errFeatured;

  if (isLoading) {
    return (
      <>
        <SEOHead
          title="Program Pesantren"
          description="Daftar Program Pendidikan dan Program Unggulan di Pondok Pesantren Modern Raudhatussalam Mahato."
          path="/program"
        />
        <PageHeader
          title="Program Pesantren"
          subtitle="Program pendidikan formal dan ragam program unggulan di Raudhatussalam."
          breadcrumbs={[{ label: 'Program' }]}
        />
        <SectionWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </SectionWrapper>
      </>
    );
  }

  if (hasError) {
    return (
      <SectionWrapper>
        <div className="text-center text-destructive py-12">
          Gagal memuat data program pesantren. Silakan coba beberapa saat lagi.
        </div>
      </SectionWrapper>
    );
  }

  const tabLabels = {
    all: 'Semua Program',
    pendidikan: 'Program Pendidikan',
    unggulan: 'Program Unggulan'
  };

  return (
    <>
      <SEOHead
        title="Program Pesantren"
        description="Jelajahi jenjang program pendidikan formal (SDIT, MTs, MA, KMI) dan program unggulan kepesantrenan di Raudhatussalam Mahato."
        path="/program"
      />
      
      <PageHeader
        title="Program Pesantren"
        subtitle="Program pendidikan formal dan ragam program unggulan di Raudhatussalam."
        breadcrumbs={[{ label: 'Program' }]}
      />

      {/* FILTER BUTTONS & DROPDOWN */}
      <SectionWrapper className="!py-0">
        <div className="flex justify-center mb-8">
          {/* Desktop Filter Tabs */}
          <div className="hidden sm:flex items-center gap-2 p-1.5 bg-secondary/50 backdrop-blur-sm border rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'all' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua Program
            </button>
            <button
              onClick={() => setActiveTab('pendidikan')}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'pendidikan' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Program Pendidikan
            </button>
            <button
              onClick={() => setActiveTab('unggulan')}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'unggulan' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Program Unggulan
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="sm:hidden w-full max-w-xs">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between gap-2 rounded-xl">
                  <span className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary" />
                    {tabLabels[activeTab]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[20rem] p-1.5 rounded-xl align-center">
                <DropdownMenuItem onClick={() => setActiveTab('all')} className="rounded-lg cursor-pointer">
                  Semua Program
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('pendidikan')} className="rounded-lg cursor-pointer">
                  Program Pendidikan (Jenjang)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('unggulan')} className="rounded-lg cursor-pointer">
                  Program Unggulan (Ekstrakurikuler)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SectionWrapper>

      {/* RENDER SECTIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* SECTION 1: PROGRAM PENDIDIKAN */}
          {(activeTab === 'all' || activeTab === 'pendidikan') && (
            <SectionWrapper className={activeTab === 'all' ? 'pt-2 pb-12' : 'py-6'}>
              {activeTab === 'all' && (
                <div className="border-b pb-4 mb-8">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2.5">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Program Pendidikan (Jenjang)
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Jenjang pendidikan formal kepesantrenan yang diselenggarakan di Raudhatussalam Mahato.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {educationPrograms?.map((program, i) => {
                  const thumb = program.images?.[0]?.gambar || program.gambar || null;
                  return (
                    <motion.button
                      key={program.id}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      onClick={() => openProgramModal(program)}
                      className="glass-card overflow-hidden hover-lift text-left group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl w-full flex flex-col h-full"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-muted/30 w-full shrink-0">
                        {thumb ? (
                          <img 
                            src={thumb} 
                            alt={program.nama} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-secondary">
                            <GraduationCap className="w-12 h-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {program.akreditasi && (
                          <span className="absolute top-3 left-3 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                            Akreditasi {program.akreditasi}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-base md:text-lg leading-snug group-hover:text-primary transition-colors mb-2">
                            {program.nama}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Kurikulum terpadu pesantren modern dengan fokus pendidikan karakter Islami.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-4">
                          Lihat Galeri & Detail <Next className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </SectionWrapper>
          )}

          {/* SECTION 2: PROGRAM UGGULAN */}
          {(activeTab === 'all' || activeTab === 'unggulan') && (
            <SectionWrapper className={activeTab === 'all' ? 'pt-8 pb-16' : 'py-6'}>
              {activeTab === 'all' && (
                <div className="border-b pb-4 mb-8">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-primary" />
                    Program Unggulan / Kegiatan
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Program khusus dan aktivitas unggulan pembentuk karakter mandiri serta kreatif.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPrograms?.map((program, i) => (
                  <motion.div key={program.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <Link to={`/program/${program.slug || '#'}`} className="block group h-full">
                      <div className="glass-card p-6 md:p-8 h-full hover-lift">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                            {program.gambar ? (
                              <img src={program.gambar} alt={program.nama} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <BookOpen className="w-6 h-6 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">Spesial</span>
                              <span className="text-xs text-muted-foreground">Aktif</span>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">{program.nama}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{program.deskripsi}</p>
                            <ul className="space-y-1.5">
                              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                Dibimbing Ustadz Profesional
                              </li>
                            </ul>
                            <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-4">
                              Detail Program <Next className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SectionWrapper>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ══ PROGRAM DETAIL MODAL ══ */}
      <AnimatePresence>
        {selectedProgram && (() => {
          const imgs = selectedProgram.images?.length 
            ? selectedProgram.images 
            : selectedProgram.gambar 
              ? [{ gambar: selectedProgram.gambar, altText: selectedProgram.nama }]
              : [];
          const hasImgs = imgs.length > 0;
          return (
            <motion.div
              key="program-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
              onClick={closeProgramModal}
            >
              <motion.div
                key="program-modal-box"
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal image slideshow */}
                {hasImgs && (
                  <div className="relative aspect-[16/9] bg-muted/20 flex-shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={modalImgIndex}
                        src={imgs[modalImgIndex].gambar}
                        alt={imgs[modalImgIndex].altText || selectedProgram.nama}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                    {/* Slide controls */}
                    {imgs.length > 1 && (
                      <>
                        <button
                          onClick={() => setModalImgIndex(p => (p - 1 + imgs.length) % imgs.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                        >
                          <Prev className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModalImgIndex(p => (p + 1) % imgs.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                        >
                          <Next className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {imgs.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setModalImgIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${idx === modalImgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {/* Close button */}
                    <button
                      onClick={closeProgramModal}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {/* Modal content */}
                <div className="p-5 overflow-y-auto">
                  {!hasImgs && (
                    <button 
                      onClick={closeProgramModal} 
                      className="absolute top-3 right-3 bg-muted hover:bg-muted/80 rounded-full p-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {selectedProgram.akreditasi && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-2">
                      <Award className="w-3 h-3" /> Akreditasi {selectedProgram.akreditasi}
                    </span>
                  )}
                  <h2 className="text-lg md:text-xl font-bold mb-3 leading-snug">{selectedProgram.nama}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Jenjang pendidikan {selectedProgram.nama} di Pondok Pesantren Modern Raudhatussalam Mahato didukung oleh fasilitas lengkap dan kurikulum terpadu untuk melahirkan lulusan terbaik.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
};

export default ProgramPage;
