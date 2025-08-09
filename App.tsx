import { useState, createContext, useContext, useEffect } from 'react';
import { IntroPage } from './components/IntroPage';
import { HomePage } from './components/HomePage';
import { InfoPage } from './components/InfoPage';
import { ReadingPage } from './components/ReadingPage';
import { LoginPage } from './components/LoginPage';
import { AuthProvider } from './contexts/AuthContext';

// Theme Context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Navigation Context
const NavigationContext = createContext<{
  currentPage: string;
  navigate: (page: string, data?: any) => void;
  pageData: any;
}>({
  currentPage: 'intro',
  navigate: () => {},
  pageData: null,
});

export const useNavigation = () => useContext(NavigationContext);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Initialize theme from localStorage or default to dark
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [currentPage, setCurrentPage] = useState('intro');
  const [pageData, setPageData] = useState<any>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'intro':
        return <IntroPage />;
      case 'home':
        return <HomePage />;
      case 'info':
        return <InfoPage />;
      case 'reading':
        return <ReadingPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <IntroPage />;
    }
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <NavigationContext.Provider value={{ currentPage, navigate, pageData }}>
          <div className="min-h-screen bg-background text-foreground">
            {renderCurrentPage()}
          </div>
        </NavigationContext.Provider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}