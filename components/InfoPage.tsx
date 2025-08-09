import React, { useState } from 'react';
import { useNavigation, useTheme } from '../App';
import { mockManga, Manga } from './mockData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, BookOpen, Calendar, Star, Eye, MessageCircle, Share, Heart, Sun, Moon, ChevronRight, ThumbsUp, Reply } from 'lucide-react';

export function InfoPage() {
  const { navigate, pageData } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  
  const manga: Manga = pageData?.manga || mockManga[0];
  const recommendations = mockManga.filter(m => m.id !== manga.id).slice(0, 6);

  const handleReadChapter = (chapterNumber: number) => {
    navigate('reading', { 
      manga, 
      chapter: manga.chapterList.find(c => c.number === chapterNumber) || manga.chapterList[0]
    });
  };

  const toggleLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('home')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold truncate">{manga.title}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-96 overflow-hidden">
          <ImageWithFallback
            src={manga.image}
            alt={manga.title}
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Manga Details Card */}
          <Card className="mb-8 shadow-2xl border border-border/50 backdrop-blur-sm bg-card/95">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-64 h-80 rounded-lg overflow-hidden shadow-xl border-2 border-border">
                    <ImageWithFallback
                      src={manga.image}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
                    <p className="text-xl text-muted-foreground">By {manga.author}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      {manga.rating}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {manga.chapters} Chapters
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Calendar className="w-3 h-3 mr-1" />
                      {manga.year}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        manga.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' : 
                        manga.status === 'Ongoing' ? 'bg-blue-500 hover:bg-blue-600' : 
                        'bg-yellow-500 hover:bg-yellow-600'
                      } text-white border-0`}
                    >
                      {manga.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {manga.genre.map((genre) => (
                        <Badge key={genre} variant="outline" className="bg-accent/50 border-border">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">{manga.summary}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      onClick={() => handleReadChapter(1)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Reading
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleReadChapter(manga.chapterList[manga.chapterList.length - 1]?.number || 1)}
                      className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Latest Chapter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters and Reviews Tabbed Interface */}
          <Card className="mb-8 shadow-xl border border-border/50">
            <CardContent className="p-0">
              {/* Tab Navigation */}
              <div className="border-b border-border px-6 pt-6">
                <div className="flex space-x-8">
                  <button 
                    className={`pb-4 font-medium relative transition-colors ${
                      activeTab === 'chapters' 
                        ? 'text-purple-500 border-b-2 border-purple-500' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('chapters')}
                  >
                    Chapters ({manga.chapterList.length})
                  </button>
                  <button 
                    className={`pb-4 font-medium relative transition-colors ${
                      activeTab === 'reviews' 
                        ? 'text-purple-500 border-b-2 border-purple-500' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews (5)
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'chapters' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {manga.chapterList.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer transition-colors group border border-border/50"
                        onClick={() => handleReadChapter(chapter.number)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">Chapter {chapter.number}</h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {chapter.releaseDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {chapter.pages.length} pages
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">AnimeLovers23</span>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-3">This manga is absolutely incredible! The art style and story development are top-notch. Can't wait for the next chapter!</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button 
                            className={`flex items-center gap-1 hover:text-purple-500 transition-colors ${likedComments.has('comment1') ? 'text-purple-500' : ''}`}
                            onClick={() => toggleLike('comment1')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {likedComments.has('comment1') ? '13' : '12'}
                          </button>
                          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-semibold">
                        M
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">MangaFan2024</span>
                          <span className="text-xs text-muted-foreground">5 hours ago</span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="w-3 h-3 text-gray-300" />
                          </div>
                        </div>
                        <p className="text-sm mb-3">Finally caught up with this series. The plot twists in the recent chapters have been amazing!</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button 
                            className={`flex items-center gap-1 hover:text-purple-500 transition-colors ${likedComments.has('comment2') ? 'text-purple-500' : ''}`}
                            onClick={() => toggleLike('comment2')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {likedComments.has('comment2') ? '9' : '8'}
                          </button>
                          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                        K
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">KawaiiReader</span>
                          <span className="text-xs text-muted-foreground">1 day ago</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-3">Best manga I've read this year! The character development is phenomenal and the artwork is stunning.</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button 
                            className={`flex items-center gap-1 hover:text-purple-500 transition-colors ${likedComments.has('comment3') ? 'text-purple-500' : ''}`}
                            onClick={() => toggleLike('comment3')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {likedComments.has('comment3') ? '16' : '15'}
                          </button>
                          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />
                    <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="cursor-pointer group transform transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('info', { manga: rec })}
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <ImageWithFallback
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge 
                        variant="secondary" 
                        className={`absolute top-3 left-3 text-xs ${
                          rec.status === 'Completed' ? 'bg-green-500' : 
                          rec.status === 'Ongoing' ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        } text-white border-0`}
                      >
                        {rec.status}
                      </Badge>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-xs font-medium">{rec.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-purple-500 transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {rec.summary}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {rec.genre.slice(0, 2).map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {rec.genre.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{rec.genre.length - 2}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By {rec.author} • {rec.chapters} chapters
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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