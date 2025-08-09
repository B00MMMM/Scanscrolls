import React, { useState, useEffect } from 'react';
import { useNavigation, useTheme } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { mockManga, Manga } from './mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Moon, Sun, Star, Calendar, TrendingUp, Clock, Grid, User, BookOpen, Loader, LogOut, LogIn } from 'lucide-react';
import { mangaAPI, userAPI } from '../services/api';

export function HomePage() {
  const { navigate } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'recommended' | 'latest' | 'popular' | 'history'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load manga data based on active filter
  useEffect(() => {
    loadMangaData();
  }, [activeFilter]);

  const loadMangaData = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let apiResponse;
      const currentPage = isLoadMore ? page + 1 : 1;
      
      if (activeFilter === 'history') {
        // Load user's reading history
        try {
          apiResponse = await userAPI.getHistory(currentPage, 20);
          // Transform history data to manga format
          const historyManga = apiResponse.history.map((item: any) => ({
            id: item.mangaId,
            title: item.title,
            image: item.image,
            status: 'Ongoing',
            rating: 0,
            chapters: item.chapterNumber || 0,
            genre: [],
            summary: '',
            author: 'Unknown',
            year: new Date().getFullYear(),
            category: 'history'
          }));
          apiResponse = { manga: historyManga };
        } catch {
          // If not authenticated, show empty history
          apiResponse = { manga: [] };
        }
      } else if (searchQuery) {
        // Search manga
        apiResponse = await mangaAPI.search(searchQuery, currentPage, 20);
      } else {
        // Load by category
        switch (activeFilter) {
          case 'popular':
            apiResponse = await mangaAPI.getPopular(currentPage, 20);
            break;
          case 'latest':
            apiResponse = await mangaAPI.getLatest(currentPage, 20);
            break;
          default:
            // For 'recommended' and 'all', show popular
            apiResponse = await mangaAPI.getPopular(currentPage, 20);
            break;
        }
      }

      // Transform API data to match our Manga interface
      const transformedManga = apiResponse.manga.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status === 'completed' ? 'Completed' : 
                item.status === 'ongoing' ? 'Ongoing' : 
                item.status === 'hiatus' ? 'Hiatus' : 'Ongoing',
        rating: item.rating || 0,
        chapters: item.chapters || item.lastChapter || 0,
        genre: item.genre || item.genres || [],
        summary: item.summary || item.description || '',
        author: item.author || (item.authors && item.authors[0]) || 'Unknown',
        year: item.year || new Date().getFullYear(),
        category: activeFilter,
        chapterList: [] // Will be loaded when needed
      }));

      if (isLoadMore) {
        setMangaData(prev => [...prev, ...transformedManga]);
        setPage(currentPage);
      } else {
        setMangaData(transformedManga);
        setPage(1);
      }

      setHasMore(transformedManga.length === 20); // Assume more data if we got full page
    } catch (err: any) {
      console.error('Error loading manga data:', err);
      setError(err.message || 'Failed to load manga data');
      // Fallback to mock data
      if (!isLoadMore) {
        setMangaData(mockManga.filter(manga => 
          activeFilter === 'all' || manga.category === activeFilter
        ));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        loadMangaData();
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Add to search history if user is authenticated
    if (e.target.value.trim()) {
      userAPI.addToSearchHistory(e.target.value.trim()).catch(() => {
        // Ignore errors for search history
      });
    }
  };

  const filteredManga = mangaData.filter(manga => {
    if (!searchQuery) return true;
    return manga.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           manga.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           manga.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMangaData(true);
    }
  };

  const filters = [
    { key: 'recommended', label: 'Recommended', icon: Star },
    { key: 'latest', label: 'Latest', icon: Calendar },
    { key: 'popular', label: 'Popular', icon: TrendingUp },
    { key: 'history', label: 'History', icon: Clock },
    { key: 'all', label: 'All', icon: Grid }
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Dancing Script, cursive' }}>
                Scanscrolls
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.username}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={logout}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('login')}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Stories</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our vast collection of manga, manhwa, and manhua
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {filters.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeFilter === key ? "default" : "outline"}
              onClick={() => setActiveFilter(key)}
              className={`${
                activeFilter === key 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0' 
                  : 'hover:bg-accent'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search manga..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Results count and loading */}
        <div className="text-center mb-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <p className="text-muted-foreground">Loading manga...</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Showing {filteredManga.length} result{filteredManga.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredManga.map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              onClick={() => navigate('info', { manga })}
            />
          ))}
        </div>

        {/* Load More */}
        {filteredManga.length > 0 && hasMore && !loading && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function MangaCard({ manga, onClick }: { manga: Manga; onClick: () => void }) {
  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
        <div className="relative aspect-[3/4] overflow-hidden">
          <ImageWithFallback
            src={manga.image}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <Badge 
              variant={manga.status === 'Completed' ? 'default' : manga.status === 'Ongoing' ? 'secondary' : 'outline'}
              className={`text-xs ${
                manga.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' : 
                manga.status === 'Ongoing' ? 'bg-blue-500 hover:bg-blue-600' : 
                'bg-yellow-500 hover:bg-yellow-600'
              } text-white border-0`}
            >
              {manga.status}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              ★ {manga.rating}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-500 transition-colors">
            {manga.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            By {manga.author}
          </p>
          <p className="text-xs text-muted-foreground">
            {manga.chapters} chapters
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p>© 2025 Scanscrolls. All rights reserved.</p>
          <p className="text-sm mt-2">
            Made with ❤️ for manga lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}