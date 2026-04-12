import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-article', slug],
    queryFn: async () => {
      const response = await api.get(`/publication/articles/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container py-10 space-y-8 animate-fade-in">
         <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
         <div className="h-64 w-full bg-muted rounded animate-pulse" />
         <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
         </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Artikel Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Button onClick={() => navigate('/artikel')}>Kembali ke Daftar Artikel</Button>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/artikel')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Artikel
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
         <div className="space-y-4 text-center">
            {data.category && (
               <Badge variant="secondary" className="mb-2">{data.category.name}</Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{data.title}</h1>
            <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
               <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{data.author?.firstName} {data.author?.lastName}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(data.createdAt), 'dd MMMM yyyy', { locale: idLocale })}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{data.viewsCount}x Dilihat</span>
               </div>
            </div>
         </div>

         {data.featuredImage && (
            <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
               <img 
                  src={data.featuredImage} 
                  alt={data.title} 
                  className="w-full h-full object-cover"
               />
            </div>
         )}

         <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
         </article>
      </div>
    </div>
  );
}
