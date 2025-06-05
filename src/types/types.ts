export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  url: string;
}

export interface AppSettings {
  adminPassword: string;
  soundEnabled: boolean;
  autoLogoutTime: number;
  showAdminButton: boolean;
  backgroundType: 'color' | 'image' | 'video';
  introBackground: string;
  mainBackground: string;
}
