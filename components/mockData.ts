export interface Manga {
  id: string;
  title: string;
  image: string;
  status: 'Completed' | 'Ongoing' | 'Hiatus';
  rating: number;
  chapters: number;
  genre: string[];
  summary: string;
  author: string;
  year: number;
  category: 'recommended' | 'latest' | 'popular' | 'history';
  chapterList: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  releaseDate: string;
  pages: string[];
}

export const mockManga: Manga[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    status: 'Completed',
    rating: 9.5,
    chapters: 139,
    genre: ['Action', 'Drama', 'Fantasy'],
    summary: 'In a world where humanity resides within enormous walled cities due to the Titans, gigantic humanoid beings who devour humans seemingly without reason, Eren Yeager dreams to reclaim the world for humanity and hunt down the Titans.',
    author: 'Hajime Isayama',
    year: 2009,
    category: 'popular',
    chapterList: Array.from({ length: 10 }, (_, i) => ({
      id: `ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop',
      ]
    }))
  },
  {
    id: '2',
    title: 'One Piece',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&sat=-50&hue=180',
    status: 'Ongoing',
    rating: 9.8,
    chapters: 1095,
    genre: ['Adventure', 'Comedy', 'Action'],
    summary: 'Monkey D. Luffy explores the Grand Line with his diverse crew of pirates, searching for the ultimate treasure known as "One Piece" to become the next Pirate King.',
    author: 'Eiichiro Oda',
    year: 1997,
    category: 'recommended',
    chapterList: Array.from({ length: 15 }, (_, i) => ({
      id: `op-ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=180',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop&hue=180',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=180',
      ]
    }))
  },
  {
    id: '3',
    title: 'Demon Slayer',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&sat=-30&hue=50',
    status: 'Completed',
    rating: 9.2,
    chapters: 205,
    genre: ['Action', 'Supernatural', 'Historical'],
    summary: 'Tanjiro Kamado becomes a demon slayer to save his sister Nezuko and avenge his family who were killed by demons.',
    author: 'Koyoharu Gotouge',
    year: 2016,
    category: 'latest',
    chapterList: Array.from({ length: 8 }, (_, i) => ({
      id: `ds-ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=50',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop&hue=50',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=50',
      ]
    }))
  },
  {
    id: '4',
    title: 'Solo Leveling',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&sat=50&hue=280',
    status: 'Completed',
    rating: 9.7,
    chapters: 179,
    genre: ['Action', 'Adventure', 'Fantasy'],
    summary: 'In a world where hunters fight monsters, Sung Jin-Woo is the weakest E-rank hunter until he gains the ability to level up infinitely.',
    author: 'Chugong',
    year: 2018,
    category: 'recommended',
    chapterList: Array.from({ length: 12 }, (_, i) => ({
      id: `sl-ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=280',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop&hue=280',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=280',
      ]
    }))
  },
  {
    id: '5',
    title: 'Tower of God',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&sat=30&hue=120',
    status: 'Ongoing',
    rating: 8.9,
    chapters: 588,
    genre: ['Adventure', 'Mystery', 'Drama'],
    summary: 'Bam enters the Tower of God to find his friend Rachel, climbing through tests and challenges on each floor.',
    author: 'SIU',
    year: 2010,
    category: 'history',
    chapterList: Array.from({ length: 9 }, (_, i) => ({
      id: `tog-ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=120',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop&hue=120',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=120',
      ]
    }))
  },
  {
    id: '6',
    title: 'Chainsaw Man',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&sat=70&hue=20',
    status: 'Ongoing',
    rating: 9.3,
    chapters: 97,
    genre: ['Action', 'Horror', 'Comedy'],
    summary: 'Denji becomes the Chainsaw Man after merging with his pet devil Pochita, working as a devil hunter.',
    author: 'Tatsuki Fujimoto',
    year: 2018,
    category: 'popular',
    chapterList: Array.from({ length: 11 }, (_, i) => ({
      id: `cm-ch-${i + 1}`,
      number: i + 1,
      title: `Chapter ${i + 1}`,
      releaseDate: `2024-08-${String(i + 1).padStart(2, '0')}`,
      pages: [
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=20',
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=1200&fit=crop&hue=20',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1200&fit=crop&hue=20',
      ]
    }))
  }
];