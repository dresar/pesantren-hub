import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, GraduationCap, Award, Calendar, BookOpen, Star, ChevronRight, Quote, ChevronLeft } from 'lucide-react';
import heroImage from '@/assets/hero-pesantren.jpg';
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
interface WebsiteSettings {
  heroTagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaPrimaryText?: string;
  heroCtaPrimaryLink?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryLink?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  announcementText?: string;
  announcementLink?: string;
  announcementActive?: boolean;
  deskripsi?: string;
  profilSingkat?: string;
  gambarProfil?: string;
}
interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};
const iconMap: Record<string, React.ElementType> = { Users, GraduationCap, Award, Calendar };
const HighlightTitle = ({ text }: { text: string }) => {
  if (!text) return null;
  const shouldSplitByComma = text.includes(',');
  if (shouldSplitByComma) {
    const parts = text.split(',');
    return (
      <>
        {parts[0]}, 
        <span className="text-primary block sm:inline">{parts.slice(1).join(',')}</span>
      </>
    );
  }
  const words = text.split(' ');
  if (words.length > 3) {
    const splitIndex = Math.ceil(words.length * 0.6); 
    return (
      <>
        {words.slice(0, splitIndex).join(' ')}{' '}
        <span className="text-primary">{words.slice(splitIndex).join(' ')}</span>
      </>
    );
  }
  if (words.length > 1) {
     return (
      <>
        {words.slice(0, -1).join(' ')}{' '}
        <span className="text-primary">{words[words.length - 1]}</span>
      </>
    );
  }
  return <>{text}</>;
};
const Home = () => {
  const { data: settings, isLoading: isLoadingSettings, error: settingsError } = usePublicData<WebsiteSettings>(['settings'], '/core/settings');
  const { data: heroSlides = [], isLoading: isLoadingHero, error: heroError } = usePublicData<HeroSection[]>(['heroSections'], '/core/hero');
  const { data: programs = [] } = usePublicData<any[]>(['programs'], '/core/programs');
  const { data: educationPrograms = [] } = usePublicData<any[]>(['education-programs'], '/core/program-pendidikan');
  const { data: statistics = [] } = usePublicData<any[]>(['statistics'], '/core/statistik');
  const { data: testimonials = [] } = usePublicData<any[]>(['testimonials'], '/blog/testimonials');
  const { data: blogData } = usePublicData<any>(['latest-posts'], '/blog/posts?limit=8');
  const isMobile = useIsMobile();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonialSlides, setTestimonialSlides] = useState<any[]>([]);
  useEffect(() => {
    if (testimonials.length > 0) {
      const slides = testimonials.map((t, i) => ({ ...t, index: i }));
      setTestimonialSlides(slides);
    }
  }, [testimonials]);
  useEffect(() => {
    if (testimonialSlides.length <= 1) return; 
    const visibleCount = isMobile ? 1 : 3;
    if (testimonialSlides.length <= visibleCount) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialSlides.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [testimonialSlides.length, isMobile]);
  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonialSlides.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonialSlides.length) % testimonialSlides.length);
  const activeSlides = heroSlides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [activeSlides.length]);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  const blogPosts = blogData?.data || [];
  return (
    <>
      {}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center -mt-16 md:-mt-18 overflow-hidden">
        {}
        <div className="absolute inset-0">
          {isLoadingHero ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent/20" />
            </>
          ) : activeSlides.length > 0 ? (
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={activeSlides[currentSlide].image || heroImage} 
                  alt={activeSlides[currentSlide].title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = heroImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent/20" />
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <img src={(settings?.gambarProfil && !settingsError) ? settings.gambarProfil : heroImage} alt="Pesantren Raudhatussalam" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent/20" />
            </>
          )}
        </div>
        {}
        <div className="relative container mx-auto max-w-7xl px-4 py-20 md:py-32 z-10">
          <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
            {settings?.announcementActive && settings?.announcementText && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 transition={{ delay: 0.2 }}
               >
                 <Link to={settings.announcementLink || '#'}>
                  <span className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm">
                    {settings.announcementText}
                  </span>
                 </Link>
               </motion.div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlides.length > 0 ? currentSlide : 'static'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-sm text-white">
                   <HighlightTitle text={
                     activeSlides.length > 0
                       ? activeSlides[currentSlide].title
                       : (!isLoadingSettings && settings?.heroTitle
                           ? settings.heroTitle
                           : (settingsError ? 'Mencetak Pemimpin Umat Masa Depan' : ''))
                   } />
                </h1>
                <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 drop-shadow-sm">
                  {
                    activeSlides.length > 0
                      ? activeSlides[currentSlide].subtitle
                      : (!isLoadingSettings && settings?.heroSubtitle
                          ? settings.heroSubtitle
                          : (settingsError ? 'Pondok Pesantren Modern Raudhatussalam Mahato — memadukan ilmu agama dan pengetahuan umum untuk generasi unggul berakhlak mulia.' : ''))
                  }
                </p>
              </motion.div>
            </AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start"
            >
              <Link
                to={settings?.heroCtaPrimaryLink || '/pendaftaran'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 transition-opacity shadow-glow w-full sm:w-auto"
              >
                {settings?.heroCtaPrimaryText || 'Daftar Sekarang'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={settings?.heroCtaSecondaryLink || '/alur-pendaftaran'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                {settings?.heroCtaSecondaryText || 'Alur Pendaftaran'}
              </Link>
            </motion.div>
          </div>
        </div>
        {}
        {activeSlides.length > 1 && (
          <div className="hidden"></div>
        )}
        {}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-10 left-4 md:left-10 flex gap-2 z-20">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>
      {}
      <section className="relative -mt-16 z-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {statistics.map((stat, i) => {
              const Icon = iconMap[stat.icon] || Star;
              return (
                <motion.div
                  key={stat.id || i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass-card p-4 md:p-6 text-center hover-lift"
                >
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-bold text-gradient-primary">{stat.nilai}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.judul}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {}
      <SectionWrapper className="bg-secondary/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              badge="Tentang Kami"
              title="Profil Singkat"
              centered={false}
            />
            <div className="prose prose-lg text-muted-foreground -mt-6 mb-8">
              <p className="whitespace-pre-line leading-relaxed">
                {
                  !isLoadingSettings && settings?.profilSingkat
                    ? settings.profilSingkat
                    : (settingsError
                        ? "Pondok Pesantren Raudhatussalam Mahato adalah lembaga pendidikan Islam modern yang memadukan ilmu agama dan pengetahuan umum. Kami berkomitmen mencetak generasi yang hafal Al-Qur'an, berakhlak mulia, dan siap bersaing di era global.\n\nBerdiri sejak tahun 2010, kami terus berkembang menyediakan fasilitas terbaik dan tenaga pengajar profesional untuk mendukung tumbuh kembang santri."
                        : '')
                }
              </p>
            </div>
            <Link to="/sejarah">
              <Button variant="outline" className="gap-2">
                Selengkapnya <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative z-10 border-4 border-white/20">
              <img 
                src={settings?.gambarProfil || heroImage} 
                alt="Profil Pesantren" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </SectionWrapper>
      {/* Program Pendidikan Section */}
      <SectionWrapper className="bg-secondary/10">
        <SectionHeader
          badge="Pendidikan"
          title="Program Pendidikan"
          subtitle="Pilihan program pendidikan berkualitas untuk masa depan putra-putri Anda."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationPrograms.map((edu, i) => (
            <motion.div
              key={edu.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-6 hover-lift text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="w-24 h-24 text-primary" />
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center relative z-10">
                {edu.gambar ? (
                  <img src={edu.gambar} alt={edu.nama} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <BookOpen className="w-8 h-8 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-xl mb-2 relative z-10">{edu.nama}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 relative z-10">
                <Award className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">Akreditasi {edu.akreditasi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Program Unggulan Section */}
      <SectionWrapper>
        <SectionHeader
          badge="Program Unggulan"
          title="Jenjang Pendidikan"
          subtitle="Lima program pendidikan terpadu yang dirancang untuk membentuk generasi berilmu dan berakhlak mulia."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {programs.slice(0, 3).map((program, i) => (
            <motion.div
              key={program.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link to={`/program/${program.slug}`} className="block group">
                <div className="glass-card p-6 h-full hover-lift">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{program.nama}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{program.deskripsi}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">Lihat Detail</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/program" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Lihat Semua Program <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionWrapper>
      {}
      <SectionWrapper className="bg-secondary/50">
        <SectionHeader
          badge="Testimoni"
          title="Apa Kata Mereka"
          subtitle="Pengalaman wali santri dan alumni yang telah merasakan pendidikan di Raudhatussalam."
        />
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              {testimonialSlides.length > 0 && (() => {
                const visibleCount = isMobile ? 1 : 3;
                const items = [];
                if (testimonialSlides.length <= visibleCount) {
                   return testimonialSlides.map((t) => (
                     <motion.div
                       key={t.id}
                       className="glass-card p-6 hover-lift"
                     >
                       <Quote className="w-8 h-8 text-primary/30 mb-3" />
                       <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.testimoni}"</p>
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm overflow-hidden">
                           {t.foto ? <img src={t.foto} alt={t.nama} className="w-full h-full object-cover" /> : t.nama.charAt(0)}
                         </div>
                         <div>
                           <p className="text-sm font-semibold">{t.nama}</p>
                           <p className="text-xs text-muted-foreground">{t.jabatan}</p>
                         </div>
                       </div>
                     </motion.div>
                   ));
                }
                for (let i = 0; i < visibleCount; i++) {
                  items.push(testimonialSlides[(currentTestimonial + i) % testimonialSlides.length]);
                }
                return items.map((t, i) => (
                  <motion.div
                    key={`${t.id}-${i}`} 
                    className="glass-card p-6 hover-lift"
                  >
                    <Quote className="w-8 h-8 text-primary/30 mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.testimoni}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm overflow-hidden">
                        {t.foto ? <img src={t.foto} alt={t.nama} className="w-full h-full object-cover" /> : t.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.nama}</p>
                        <p className="text-xs text-muted-foreground">{t.jabatan}</p>
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </motion.div>
          </AnimatePresence>
          {}
          {testimonialSlides.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="md:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {testimonialSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentTestimonial === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="md:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SectionWrapper>
      {}
      <SectionWrapper className="!px-2 md:!px-4">
        <SectionHeader badge="Blog" title="Berita Terbaru" subtitle="Kabar terkini seputar kegiatan dan prestasi pesantren." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          {blogPosts.slice(0, 4).map((post, i) => (
            <motion.div key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <div className="glass-card overflow-hidden hover-lift h-full flex flex-col">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-2.5 md:p-5 flex-1 flex flex-col">
                    <span className="text-[9px] md:text-xs font-medium text-primary line-clamp-1">{post.category?.name}</span>
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 hidden md:block line-clamp-2">{post.excerpt}</p>
                    <div className="mt-auto pt-2">
                        <p className="text-[9px] md:text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Semua Artikel <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionWrapper>

      {/* Article Preview Section (2 Grid) */}
      <SectionWrapper className="bg-secondary/5">
        <SectionHeader badge="Artikel" title="Bacaan Pilihan" subtitle="Artikel menarik lainnya untuk Anda." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.slice(4, 8).map((post, i) => (
            <motion.div key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <div className="glass-card overflow-hidden hover-lift h-full flex flex-row items-center gap-4 p-4">
                  <div className="w-1/3 aspect-square bg-muted relative overflow-hidden rounded-lg shrink-0">
                    {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-medium text-primary line-clamp-1">{post.category?.name}</span>
                    <h3 className="text-lg font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
      {}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden gradient-primary p-8 md:p-12 text-center islamic-pattern"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              {settings?.ctaTitle || 'Siap Bergabung?'}
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base max-w-lg mx-auto mb-8">
              {settings?.ctaDescription || 'Daftarkan putra-putri Anda sekarang dan wujudkan generasi yang berilmu, beriman, dan berakhlak mulia.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={settings?.ctaPrimaryLink || '/pendaftaran'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-background text-foreground hover:bg-background/90 transition-colors"
              >
                {settings?.ctaPrimaryText || 'Daftar Sekarang'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={settings?.ctaSecondaryLink || '/kontak'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                {settings?.ctaSecondaryText || 'Hubungi Kami'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
export default Home;
