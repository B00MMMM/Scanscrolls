import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useTheme } from '../App';
import { mockManga, Chapter, Manga } from './mockData';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  MessageCircle, 
  Sun, 
  Moon,
  Home,
  Info,
  Bookmark,
  Share,
  BookOpen
} from 'lucide-react';

export function ReadingPage() {
  const { navigate, pageData } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  
  const manga: Manga = pageData?.manga || mockManga[0];
  const currentChapter: Chapter = pageData?.chapter || manga.chapterList[0];
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const currentChapterIndex = manga.chapterList.findIndex(ch => ch.id === currentChapter.id);
  const prevChapter = currentChapterIndex > 0 ? manga.chapterList[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < manga.chapterList.length - 1 ? manga.chapterList[currentChapterIndex + 1] : null;
  
  const recommendations = mockManga.filter(m => m.id !== manga.id).slice(0, 4);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const goToChapter = (chapterNumber: string) => {
    const chapter = manga.chapterList.find(ch => ch.number === parseInt(chapterNumber));
    if (chapter) {
      navigate('reading', { manga, chapter });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('info', { manga })}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} hidden md:block`} style={{ fontFamily: 'Dancing Script, cursive' }}>
                  Scanscrolls
                </h1>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-4">
              <h1 className="font-semibold text-center truncate">
                {manga.title} - Chapter {currentChapter.number}
              </h1>
              <div className="w-full bg-muted h-1 rounded-full mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Navigation */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => prevChapter && navigate('reading', { manga, chapter: prevChapter })}
              disabled={!prevChapter}
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Select value={currentChapter.number.toString()} onValueChange={goToChapter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {manga.chapterList.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.number.toString()}>
                    Chapter {chapter.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => nextChapter && navigate('reading', { manga, chapter: nextChapter })}
              disabled={!nextChapter}
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reading Area with Endless Scroll */}
      <div 
        ref={scrollContainerRef}
        className="max-w-4xl mx-auto overflow-y-auto custom-scrollbar"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <div className="space-y-2 p-4">
          {/* All pages rendered in sequence for endless scroll */}
          {currentChapter.pages.map((page, index) => (
            <div key={index} className="w-full flex justify-center">
              <div className="bg-card rounded-lg overflow-hidden shadow-lg max-w-full">
                <ImageWithFallback
                  src={page}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto object-contain max-h-screen"
                  style={{ maxWidth: '800px' }}
                />
                {/* Page number indicator */}
                <div className="text-center py-2 text-sm text-muted-foreground bg-muted">
                  Page {index + 1} of {currentChapter.pages.length}
                </div>
              </div>
            </div>
          ))}
          
          {/* Chapter Navigation at bottom */}
          <div className="flex items-center justify-center gap-4 py-8">
            {prevChapter && (
              <Button
                variant="outline"
                onClick={() => navigate('reading', { manga, chapter: prevChapter })}
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Button>
            )}
            
            <div className="text-center px-4">
              <p className="text-sm text-muted-foreground">End of Chapter {currentChapter.number}</p>
            </div>
            
            {nextChapter && (
              <Button
                variant="outline"
                onClick={() => navigate('reading', { manga, chapter: nextChapter })}
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              >
                Next Chapter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chapter Comments (15)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">ReaderX</span>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm">That plot twist in this chapter was insane! Did not see that coming at all. The art in the last few pages was incredible too.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-semibold">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">MangaAddict</span>
                      <span className="text-xs text-muted-foreground">3 hours ago</span>
                    </div>
                    <p className="text-sm">Finally! The character development we've been waiting for. This series keeps getting better and better.</p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="cursor-pointer group transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate('info', { manga: rec })}
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <ImageWithFallback
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge 
                      variant="secondary" 
                      className={`absolute top-2 left-2 text-xs ${
                        rec.status === 'Completed' ? 'bg-green-500' : 
                        rec.status === 'Ongoing' ? 'bg-blue-500' : 
                        'bg-yellow-500'
                      } text-white border-0`}
                    >
                      {rec.status}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-500 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      ★ {rec.rating} • {rec.chapters} chapters
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Scanscrolls. All rights reserved.</p>
            <p className="text-sm mt-2">Made with ❤️ for manga lovers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}