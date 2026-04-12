import { usePublicData } from '@/hooks/use-public-data';
import { motion } from 'framer-motion';
import SectionWrapper, { SectionHeader } from '@/components/shared/SectionWrapper';
import { Users, Crown, Briefcase, User } from 'lucide-react';

interface OrgMember {
  id: number;
  nama: string;
  jabatan: string;
  foto?: string;
  parentId?: number;
  level: number;
  order: number;
}

const levelColors = [
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-violet-700',
  'from-orange-500 to-amber-600',
];

const levelIcons = [Crown, Briefcase, Users, User];

const MemberCard = ({ member, index }: { member: OrgMember; index: number }) => {
  const Icon = levelIcons[Math.min(member.level, 3)];
  const gradient = levelColors[Math.min(member.level, 3)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="flex flex-col items-center group"
    >
      <div className="relative">
        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${gradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
            {member.foto ? (
              <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
            ) : (
              <Icon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        </div>
        {member.level === 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
            ⭐
          </span>
        )}
      </div>
      <div className="mt-3 text-center max-w-[130px]">
        <p className="font-semibold text-sm leading-snug">{member.nama}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{member.jabatan}</p>
      </div>
    </motion.div>
  );
};

const ConnectorLine = () => (
  <div className="flex flex-col items-center my-1">
    <div className="w-px h-8 bg-border" />
  </div>
);

const Organisasi = () => {
  const { data: members = [], isLoading } = usePublicData<OrgMember[]>(
    ['struktur-organisasi'],
    '/core/struktur-organisasi'
  );

  const level0 = members.filter(m => m.level === 0).sort((a, b) => a.order - b.order);
  const level1 = members.filter(m => m.level === 1).sort((a, b) => a.order - b.order);
  const level2 = members.filter(m => m.level === 2).sort((a, b) => a.order - b.order);
  const level3 = members.filter(m => m.level === 3).sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="absolute inset-0 opacity-5 islamic-pattern pointer-events-none" />
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
              Pesantren
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Struktur Organisasi</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Susunan kepemimpinan dan tim manajemen Pondok Pesantren
            </p>
          </motion.div>
        </div>
      </section>

      <SectionWrapper>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Struktur organisasi belum tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0">

            {/* Level 0 — Pimpinan Tertinggi */}
            {level0.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {level0.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
              </div>
            )}

            {level1.length > 0 && <ConnectorLine />}

            {/* Level 1 — Kepala Bidang */}
            {level1.length > 0 && (
              <>
                {/* Horizontal connector line */}
                {level1.length > 1 && (
                  <div className="w-full max-w-3xl h-px bg-border mx-auto mb-0" />
                )}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4">
                  {level1.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
                </div>
              </>
            )}

            {level2.length > 0 && <ConnectorLine />}

            {/* Level 2 — Staff */}
            {level2.length > 0 && (
              <div className="flex flex-wrap justify-center gap-5 md:gap-8 mt-2">
                {level2.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
              </div>
            )}

            {level3.length > 0 && <ConnectorLine />}

            {/* Level 3 — Anggota */}
            {level3.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-2">
                {level3.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
              </div>
            )}

          </div>
        )}
      </SectionWrapper>

      {/* Legend */}
      {members.length > 0 && (
        <SectionWrapper className="bg-secondary/20 !py-8">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Pimpinan', color: 'from-emerald-600 to-teal-700' },
              { label: 'Kepala Bidang', color: 'from-blue-600 to-indigo-700' },
              { label: 'Staff', color: 'from-purple-600 to-violet-700' },
              { label: 'Anggota', color: 'from-orange-500 to-amber-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
};

export default Organisasi;