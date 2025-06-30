import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Share2, Globe, Copy, Check, Eye, Rocket, Server, Settings, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/ui/use-toast';
import indexedDBService from '../services/IndexedDBService';
// Імпорт системи генерації проектів  
import { projectCloner } from '../../../src/project-generator/generators/projectCloner';
import type { ClientProjectConfig } from '../../../src/project-generator/types';
// Імпорт компоненту превью
import IntroScreenPreview from '../components/IntroScreenPreview';

/**
 * АРХІВНИЙ КОД КОМПОНЕНТУ PREVIEWGENERATOR
 * 
 * Цей файл містить повний код компонента PreviewGenerator,
 * який був видалений з адміністративної панелі.
 * 
 * Збережено для історії та можливого відновлення в майбутньому.
 * Дата архівування: ${new Date().toLocaleDateString('uk-UA')}
 */

interface PreviewGeneratorProps {
  className?: string;
}

interface GeneratedPreview {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  settings: Record<string, unknown>;
  embedCode: string;
}

// Нові інтерфейси для генерації проектів
interface ProjectOrder {
  clientName: string;
  projectName: string;
  domain?: string;
  subdomain: string;
  template: string;
  features: string[];
  customizations?: Record<string, any>;
  deploymentMode?: 'real' | 'local' | 'simulation';
}

interface GeneratedProject {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  status: 'generating' | 'deploying' | 'ready' | 'error';
  createdAt: string;
  deploymentUrl?: string;
  error?: string;
  deploymentMode?: 'real' | 'local' | 'simulation';
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const PreviewGenerator: React.FC<PreviewGeneratorProps> = ({ className }) => {
  const [previews, setPreviews] = useState<GeneratedPreview[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewName, setPreviewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  // Новий стейт для генерації проектів
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [activeTab, setActiveTab] = useState<'previews' | 'projects'>('previews');
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectOrder>({
    clientName: '',
    projectName: '',
    domain: '',
    subdomain: '',
    template: 'smm-os-standard',
    features: ['intro', 'preview', 'main', 'admin'],
    customizations: {},
    deploymentMode: 'local'
  });
  
  // Стейт для попереднього перегляду
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  
  const { toast } = useToast();

  // Функція для прокрутки вгору при зміні вкладки
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Обробник зміни вкладки з прокруткою
  const handleTabChange = (tab: 'previews' | 'projects') => {
    setActiveTab(tab);
    setTimeout(scrollToTop, 100); // Невелика затримка для плавності
  };

  // РЕШТА КОДУ КОМПОНЕНТУ ЗНАХОДИТЬСЯ В ОРИГІНАЛЬНОМУ ФАЙЛІ
  // ЦЕЙ АРХІВ ЗБЕРІГАЄ СТРУКТУРУ ТА ІНТЕРФЕЙСИ ДЛЯ ПІЗНІШОГО ВИКОРИСТАННЯ
  
  return (
    <div className={`p-6 h-full overflow-y-auto ${className}`}>
      <div className="text-center text-gray-500 py-8">
        <h3 className="text-lg font-semibold mb-2">Генератор Архівований</h3>
        <p>Цей компонент було переміщено до архіву</p>
      </div>
    </div>
  );
};

export default PreviewGenerator; 