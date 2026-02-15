import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';
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
  readTime?: string; 
}
interface BlogResponse {
  data: BlogPost[];
  meta: any;
}
const BlogPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { data: categories } = usePublicData<Category[]>(['categories'], '/blog/categories');
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.append('status', 'published');
    if (search) params.append('search', search);
    if (activeCategoryId) params.append('categoryId', activeCategoryId.toString());
    return params.toString();
  }, [search, activeCategoryId]);
  const { data: postsResponse, isLoading } = usePublicData<BlogResponse>(
    ['posts', search, activeCategoryId?.toString() || 'all'],
    `/blog/posts?${queryString}`
  );
  const posts = postsResponse?.data || [];
  return (
    <>
      <PageHeader title="Blog" subtitle="Berita, prestasi, dan artikel seputar Pesantren Raudhatussalam." breadcrumbs={[{ label: 'Blog' }]} />
      <SectionWrapper>
        {}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategoryId === null ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua
            </button>
            {categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategoryId(c.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategoryId === c.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {}
        {isLoading && (
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
             {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
             ))}
           </div>
        )}
        {}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group">
                  <div className="glass-card overflow-hidden hover-lift h-full">
                    <div className="aspect-[4/3] bg-muted relative">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="p-3 md:p-5">
                      <span className="text-[10px] md:text-xs font-medium text-primary">{post.category?.name || 'Uncategorized'}</span>
                      <h3 className="text-sm md:text-base font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 hidden md:block">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] md:text-xs text-muted-foreground">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:flex items-center gap-1"><Clock className="w-3 h-3" /> 5 menit</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Tidak ada artikel yang ditemukan.</p>
          </div>
        )}
      </SectionWrapper>
    </>
  );
};
export default BlogPage;