import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Megaphone, Newspaper, FileText, Grid } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { usePublicData } from '@/hooks/use-public-data';
import { formatDate } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  category: Category | null;
}

interface BlogResponse {
  data: BlogPost[];
  meta: any;
}

interface Announcement {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  gambar?: string;
  isPenting: boolean;
  publishedAt: string;
}

const TABS = [
  { id: 'semua', label: 'Semua', icon: Grid },
  { id: 'berita', label: 'Berita Terkini', icon: Newspaper, slug: 'berita' },
  { id: 'buletin', label: 'Buletin', icon: FileText, slug: 'buletin' },
  { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
];

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'semua';
  const [search, setSearch] = useState('');

  // Fetch categories to get IDs for specific slugs
  const { data: categories = [] } = usePublicData<Category[]>(['categories'], '/blog/categories');

  // Build query string for blog posts
  const postQueryString = useMemo(() => {
    const params = new URLSearchParams();
    params.append('status', 'published');
    if (search) params.append('search', search);

    if (currentTab !== 'semua' && currentTab !== 'pengumuman') {
      const tabConfig = TABS.find((t) => t.id === currentTab);
      if (tabConfig && tabConfig.slug) {
        // Find category ID by slug (fallback to exact match or contains)
        const cat = categories.find(c => c.slug.includes(tabConfig.slug!) || c.name.toLowerCase().includes(tabConfig.slug!));
        if (cat) {
          params.append('categoryId', cat.id.toString());
        } else {
           // If category doesnt exist yet, pass an invalid ID to safely return empty
           params.append('categoryId', '-1');
        }
      }
    }
    return params.toString();
  }, [search, currentTab, categories]);

  // Fetch posts
  const { data: postsResponse, isLoading: loadingPosts } = usePublicData<BlogResponse>(
    ['posts', postQueryString],
    `/blog/posts?${postQueryString}`,
    { enabled: currentTab !== 'pengumuman' }
  );

  // Fetch announcements
  const { data: announcements = [], isLoading: loadingAnnouncements } = usePublicData<Announcement[]>(
    ['announcements'],
    `/blog/announcements`,
    { enabled: currentTab === 'pengumuman' }
  );

  const handleTabChange = (tabId: string) => {
    setSearchParams(tabId === 'semua' ? {} : { tab: tabId });
    setSearch('');
  };

  const isLoading = currentTab === 'pengumuman' ? loadingAnnouncements : loadingPosts;
  const posts = postsResponse?.data || [];

  return (
    <>
      <PageHeader 
        title="Informasi & Publikasi" 
        subtitle="Dapatkan informasi terbaru, berita terkini, buletin inspiratif, dan pengumuman resmi." 
        breadcrumbs={[{ label: 'Blog & Informasi' }]} 
      />
      <SectionWrapper>
        
        {/* Top Navigation / Filtering */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-nowrap w-full md:w-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]' 
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {currentTab !== 'pengumuman' && (
            <div className="relative w-full md:w-72 mt-2 md:mt-0 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berita atau artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-muted/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              
              {/* Render Announcements */}
              {currentTab === 'pengumuman' && announcements.length > 0 && announcements.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/pengumuman/${item.slug}`} className="block group h-full">
                    <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full flex flex-col border border-border/50">
                      {item.gambar && (
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(item.publishedAt)}
                          </span>
                          {item.isPenting && (
                            <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider">
                              Penting
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-tight">{item.judul}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.konten}</p>
                        <div className="mt-auto pt-4 border-t border-border/50 text-sm font-semibold text-primary">
                          Lihat detail &rarr;
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Render Posts (Berita/Buletin/Semua) */}
              {currentTab !== 'pengumuman' && posts.length > 0 && posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="block group h-full">
                    <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full flex flex-col border border-border/50">
                      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                            <Newspaper className="w-8 h-8 opacity-20" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur text-xs font-semibold rounded-full text-primary shadow-sm">
                          {post.category?.name || 'Uncategorized'}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mt-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty States */}
        {!isLoading && currentTab === 'pengumuman' && announcements.length === 0 && (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
            <Megaphone className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Belum Ada Pengumuman</h3>
            <p className="text-muted-foreground">Papan pengumuman saat ini masih kosong.</p>
          </div>
        )}

        {!isLoading && currentTab !== 'pengumuman' && posts.length === 0 && (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
            <Search className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Tidak Ada Hasil</h3>
            <p className="text-muted-foreground">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
          </div>
        )}

      </SectionWrapper>
    </>
  );
};

export default BlogPage;