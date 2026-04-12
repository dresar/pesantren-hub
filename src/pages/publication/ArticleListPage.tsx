import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/common';
import { BookOpen, Search, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function ArticleListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-articles', page, search],
    queryFn: async () => {
      const params = {
        type: 'article',
        status: 'approved',
        page,
        limit: 9,
        search,
      };
      const response = await api.get('/publication/articles', { params });
      return response.data;
    },
  });

  return (
    <div className="container py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="Artikel & Berita"
          description="Tulisan terbaru dari para santri dan asatidz"
          icon={BookOpen}
        />
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-muted-foreground">
          Gagal memuat artikel. Silakan coba lagi nanti.
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Belum ada artikel yang ditemukan.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((article: any) => (
              <Card key={article.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 group">
                <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <BookOpen className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  {article.category && (
                    <Badge className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 text-foreground backdrop-blur-sm" variant="secondary">
                      {article.category.name}
                    </Badge>
                  )}
                </div>
                <CardHeader className="space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: idLocale })}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
                    <Link to={`/artikel/${article.slug}`}>{article.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {article.excerpt || article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {article.author?.avatar ? (
                       <img src={article.author.avatar} alt={article.author.firstName} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                       <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3" />
                       </div>
                    )}
                    <span className="text-xs font-medium">{article.author?.firstName} {article.author?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Eye className="h-3 w-3" />
                      <span>{article.viewsCount}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                      <Link to={`/artikel/${article.slug}`}>
                        Baca <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 text-sm font-medium">
                Halaman {page} dari {data.pagination.totalPages}
              </div>
              <Button
                variant="outline"
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
