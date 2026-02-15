import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, X } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
interface TimelineImage {
  id: number;
  gambar: string;
}
interface TimelineEvent {
  id: number;
  judul: string;
  deskripsi: string;
  order: number;
  images?: TimelineImage[];
}
interface WebsiteSettings {
  profilSingkat?: string;
  gambarProfil?: string;
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};
const Sejarah = () => {
  const { data: timeline, isLoading, error } = usePublicData<TimelineEvent[]>(['sejarah-timeline'], '/core/sejarah-timeline');
  const { data: settings } = usePublicData<WebsiteSettings>(['settings'], '/core/settings');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  if (isLoading) {
    return (
       <>
        <PageHeader title="Sejarah Pesantren" subtitle="Perjalanan panjang membangun generasi emas." breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Sejarah' }]} />
        <SectionWrapper>
          <div className="max-w-3xl mx-auto space-y-8">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
             ))}
          </div>
        </SectionWrapper>
      </>
    );
  }
  if (error) {
     return (
      <SectionWrapper>
        <div className="text-center text-destructive">Failed to load history.</div>
      </SectionWrapper>
    );
  }
  return (
    <>
      <PageHeader
        title="Sejarah Pesantren"
        subtitle="Perjalanan panjang membangun generasi emas sejak 2008."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Sejarah' }]}
      />
      {}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-border">
              <img 
                src={settings?.gambarProfil || '/placeholder-image.jpg'} 
                alt="Profil Pesantren" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1000'; }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Profil Singkat</h2>
            <div className="prose prose-lg text-muted-foreground">
              <p className="whitespace-pre-line leading-relaxed">
                {settings?.profilSingkat || "Deskripsi profil belum tersedia."}
              </p>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
      <SectionWrapper className="bg-secondary/30">
        <SectionHeader badge="Timeline" title="Jejak Langkah Kami" />
        <div className="relative max-w-3xl mx-auto">
          {}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
          {timeline?.map((event, i) => (
            <motion.div
              key={event.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={fadeUp}
              className={`relative flex items-start gap-6 mb-8 md:mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full gradient-primary border-2 border-background -translate-x-1.5 mt-1.5 z-10" />
              {}
              <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                {}
                <h3 className="text-lg font-semibold mt-1">{event.judul}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{event.deskripsi}</p>
                {event.images && event.images.length > 0 && (
                  <div className={`mt-3 flex ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 h-8 text-xs"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Lihat Foto ({event.images.length})
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
      {}
      <SectionWrapper>
        <SectionHeader badge="Tokoh" title="Para Pendiri & Pengasuh" subtitle="Tokoh-tokoh yang berjasa dalam merintis dan mengembangkan pesantren." />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {}
           {[1, 2, 3].map((i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-card p-6 text-center"
             >
               <div className="w-24 h-24 mx-auto bg-muted rounded-full mb-4 overflow-hidden">
                 {}
                 <img src={`https://ui-avatars.com/api/?name=Pendiri+${i}&background=random`} alt="Pendiri" className="w-full h-full object-cover" />
               </div>
               <h3 className="font-semibold text-lg">KH. Nama Pendiri {i}</h3>
               <p className="text-sm text-primary mb-2">Pendiri / Pengasuh</p>
               <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>
             </motion.div>
           ))}
        </div>
      </SectionWrapper>
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-2xl bg-black/95 border-white/10 p-0 text-white overflow-hidden">
          <div className="relative">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute right-4 top-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedEvent && selectedEvent.images && (
              <div className="flex flex-col">
                <div className="p-6 pb-2">
                  <h3 className="text-xl font-bold">{selectedEvent.judul}</h3>
                  <p className="text-sm text-white/60 mt-1 line-clamp-2">{selectedEvent.deskripsi}</p>
                </div>
                <div className="p-6 pt-4 flex justify-center">
                  <Carousel className="w-full max-w-lg">
                    <CarouselContent>
                      {selectedEvent.images.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
                            <img 
                              src={img.gambar} 
                              alt={`${selectedEvent.judul} - ${index + 1}`} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {selectedEvent.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 bg-black/50 border-transparent text-white hover:bg-black/70 hover:text-white" />
                        <CarouselNext className="right-2 bg-black/50 border-transparent text-white hover:bg-black/70 hover:text-white" />
                      </>
                    )}
                  </Carousel>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Sejarah;