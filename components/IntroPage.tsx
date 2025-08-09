import React from 'react';
import { useNavigation, useTheme } from '../App';
import { Button } from './ui/button';
import { Moon, Sun, BookOpen, Users, TrendingUp, Clock } from 'lucide-react';

export function IntroPage() {
  const { navigate } = useNavigation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-card/10 border-border hover:bg-card/20 backdrop-blur-sm"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center relative z-10">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Dancing Script, cursive' }}>
              Scanscrolls
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover amazing stories through our vast collection of manga, manhwa, and manhua. 
            Dive into epic adventures, romantic tales, and thrilling action series.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 text-center border border-border shadow-lg">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Latest Updates</h3>
            <p className="text-muted-foreground">Stay up to date with the newest chapters and releases from your favorite series.</p>
          </div>
          
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 text-center border border-border shadow-lg">
            <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">Join thousands of readers discussing theories, reviews, and recommendations.</p>
          </div>
          
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 text-center border border-border shadow-lg">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reading History</h3>
            <p className="text-muted-foreground">Never lose your place with automatic reading progress tracking and bookmarks.</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('home')}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          Read Now
        </Button>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-8 justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">10K+</div>
            <div className="text-sm">Manga Titles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">500K+</div>
            <div className="text-sm">Active Readers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">1M+</div>
            <div className="text-sm">Chapters Read</div>
          </div>
        </div>
      </div>
    </div>
  );
}