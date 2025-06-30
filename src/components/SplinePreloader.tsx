import React, { useEffect, useState } from 'react';

interface SplinePreloaderProps {
  sceneUrl?: string;
  onPreloaded?: () => void;
}

/**
 * 🌐 SplinePreloader - компонент для попереднього завантаження Spline анімації
 * Працює невидимо в фоні поки користувач на preview сторінці
 */
const SplinePreloader: React.FC<SplinePreloaderProps> = ({
  sceneUrl,
  onPreloaded
}) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    if (!sceneUrl || !sceneUrl.includes('.splinecode')) {
      return;
    }

    const preloadSplineAssets = async () => {
      setIsPreloading(true);
      
      try {
        console.log('🚀 Starting advanced Spline preload...');
        
        // 1. Preload main scene file
        setPreloadProgress(20);
        const sceneResponse = await fetch(sceneUrl);
        
        if (sceneResponse.ok) {
          const sceneData = await sceneResponse.text();
          console.log('✅ Scene data preloaded');
          setPreloadProgress(50);
          
          // 2. Extract and preload asset URLs from scene data
          const assetUrls = extractAssetUrls(sceneData);
          console.log(`🎯 Found ${assetUrls.length} assets to preload`);
          
          // 3. Preload critical assets
          await preloadAssets(assetUrls.slice(0, 5)); // Top 5 критичних ресурсів
          setPreloadProgress(80);
          
          // 4. Create cache entries
          await createCacheEntries(sceneUrl, sceneData);
          setPreloadProgress(100);
          
          console.log('✅ Spline preload completed');
          onPreloaded?.();
        }
      } catch (error) {
        console.warn('⚠️ Spline preload failed:', error);
      } finally {
        setIsPreloading(false);
      }
    };

    preloadSplineAssets();
  }, [sceneUrl, onPreloaded]);

  const extractAssetUrls = (sceneData: string): string[] => {
    const urls: string[] = [];
    
    // Extract texture URLs
    const textureMatches = sceneData.match(/https:\/\/[^"'\s]+\.(jpg|jpeg|png|webp|hdr)/gi);
    if (textureMatches) urls.push(...textureMatches);
    
    // Extract model URLs  
    const modelMatches = sceneData.match(/https:\/\/[^"'\s]+\.(glb|gltf|obj|fbx)/gi);
    if (modelMatches) urls.push(...modelMatches);
    
    // Extract audio URLs
    const audioMatches = sceneData.match(/https:\/\/[^"'\s]+\.(mp3|wav|ogg)/gi);
    if (audioMatches) urls.push(...audioMatches);
    
    return [...new Set(urls)]; // Remove duplicates
  };

  const preloadAssets = async (urls: string[]): Promise<void> => {
    const preloadPromises = urls.map(url => {
      return new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Don't fail on single asset error
        document.head.appendChild(link);
        
        // Cleanup after 30 seconds
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }, 30000);
      });
    });
    
    await Promise.allSettled(preloadPromises);
  };

  const createCacheEntries = async (url: string, data: string): Promise<void> => {
    try {
      if ('caches' in window) {
        const cache = await caches.open('spline-cache-v1');
        const response = new Response(data, {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(url, response);
        console.log('✅ Spline scene cached');
      }
    } catch (error) {
      console.warn('Cache operation failed:', error);
    }
  };

  // Hidden preloader - doesn't render anything visible
  return null;
};

export default SplinePreloader; 