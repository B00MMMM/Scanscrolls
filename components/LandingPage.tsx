import React from 'react';
import { useNavigation, useTheme } from '../App';
import { Button } from './ui/button';
import { Moon, Sun, BookOpen, Users, TrendingUp, Clock } from 'lucide-react';
import backgroundImage from 'figma:asset/1729c0bc5bc397f4b82caf8966b098e6de182e6e.png';

export function LandingPage() {
  const { navigate } = useNavigation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-black/20 border-white/30 hover:bg-black/40 backdrop-blur-sm text-white hover:text-white"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center relative z-10">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-8xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'} drop-shadow-2xl`} style={{ fontFamily: 'Dancing Script, cursive' }}>
              Scanscrolls
            </h1>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4 drop-shadow-lg">
            Dive into the ultimate manga, manhwa, and manhua reading experience
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Discover thousands of stories, track your reading progress, and join a community of manga enthusiasts from around the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-xl">
            <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Vast Library</h3>
            <p className="text-white/80 text-lg leading-relaxed">Access over 10,000 manga titles with new releases added daily</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-xl">
            <Users className="w-16 h-16 text-pink-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Active Community</h3>
            <p className="text-white/80 text-lg leading-relaxed">Join discussions, share reviews, and connect with fellow readers</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-xl">
            <TrendingUp className="w-16 h-16 text-blue-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Personalized Experience</h3>
            <p className="text-white/80 text-lg leading-relaxed">Get recommendations based on your reading history and preferences</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('intro')}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-16 py-6 text-2xl rounded-full font-semibold shadow-2xl transform hover:scale-110 transition-all duration-300 border-0"
        >
          Explore Now
        </Button>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap gap-12 justify-center text-white/90">
          <div className="text-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg mb-2">10K+</div>
            <div className="text-lg">Manga Titles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg mb-2">500K+</div>
            <div className="text-lg">Active Readers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg mb-2">1M+</div>
            <div className="text-lg">Chapters Read</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg mb-2">24/7</div>
            <div className="text-lg">Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}