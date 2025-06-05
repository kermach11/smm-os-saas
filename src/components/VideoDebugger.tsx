import React, { useState, useEffect } from 'react';

interface VideoDebuggerProps {
  videoUrl?: string;
  className?: string;
}

const VideoDebugger: React.FC<VideoDebuggerProps> = ({ videoUrl, className = '' }) => {
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoUrl) {
      console.log('🔍 VideoDebugger: Аналізуємо відео URL:', {
        url: videoUrl.substring(0, 100) + '...',
        length: videoUrl.length,
        isDataUrl: videoUrl.startsWith('data:'),
        mimeType: videoUrl.startsWith('data:') ? videoUrl.split(';')[0] : 'N/A',
        isSvg: videoUrl.includes('data:image/svg+xml'),
        isVideo: videoUrl.startsWith('data:video/')
      });

      setVideoInfo({
        url: videoUrl.substring(0, 100) + '...',
        length: videoUrl.length,
        isDataUrl: videoUrl.startsWith('data:'),
        mimeType: videoUrl.startsWith('data:') ? videoUrl.split(';')[0] : 'N/A',
        isSvg: videoUrl.includes('data:image/svg+xml'),
        isVideo: videoUrl.startsWith('data:video/'),
        sizeKB: (videoUrl.length / 1024).toFixed(2),
        sizeMB: (videoUrl.length / 1024 / 1024).toFixed(2)
      });
    }
  }, [videoUrl]);

  const handleCanPlay = () => {
    console.log('✅ VideoDebugger: Відео може відтворюватися');
    setCanPlay(true);
    setError(null);
  };

  const handleError = (e: any) => {
    const errorMsg = `Помилка відтворення відео: ${e.target?.error?.message || 'Невідома помилка'}`;
    console.error('❌ VideoDebugger:', errorMsg);
    setError(errorMsg);
    setCanPlay(false);
  };

  const handleLoadedMetadata = (e: any) => {
    const video = e.target;
    console.log('📹 VideoDebugger: Метадані завантажено:', {
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      readyState: video.readyState
    });
  };

  if (!videoUrl) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold mb-2">🔍 Video Debugger</h3>
        <p className="text-gray-600">Немає відео для перевірки</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-2">🔍 Video Debugger</h3>
      
      {/* Інформація про відео */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">📊 Інформація про файл:</h4>
        {videoInfo && (
          <div className="text-sm space-y-1">
            <div><strong>URL превью:</strong> {videoInfo.url}</div>
            <div><strong>Розмір:</strong> {videoInfo.length} байт ({videoInfo.sizeKB} KB / {videoInfo.sizeMB} MB)</div>
            <div><strong>Data URL:</strong> {videoInfo.isDataUrl ? '✅ Так' : '❌ Ні'}</div>
            <div><strong>MIME тип:</strong> {videoInfo.mimeType}</div>
            <div><strong>Це SVG:</strong> {videoInfo.isSvg ? '⚠️ Так (превью)' : '✅ Ні'}</div>
            <div><strong>Це відео:</strong> {videoInfo.isVideo ? '✅ Так' : '❌ Ні'}</div>
          </div>
        )}
      </div>

      {/* Статус відтворення */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">🎬 Статус відтворення:</h4>
        <div className="flex items-center space-x-4">
          <div className={`px-2 py-1 rounded text-sm ${canPlay ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {canPlay ? '✅ Готове до відтворення' : '⏳ Завантаження...'}
          </div>
          {error && (
            <div className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {/* Відео елемент для тестування */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">🎥 Тест відтворення:</h4>
        <div className="border rounded overflow-hidden">
          {videoInfo?.isSvg ? (
            <div className="p-4 bg-yellow-50 text-yellow-800">
              ⚠️ Це SVG превью, а не відео файл
            </div>
          ) : (
            <video
              src={videoUrl}
              controls
              muted
              className="w-full max-w-md"
              onCanPlay={handleCanPlay}
              onError={handleError}
              onLoadedMetadata={handleLoadedMetadata}
              style={{ maxHeight: '200px' }}
            />
          )}
        </div>
      </div>

      {/* Рекомендації */}
      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <h4 className="font-medium mb-2 text-blue-800">💡 Рекомендації:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {videoInfo?.isSvg && <div>• Це SVG превью. Потрібно завантажити повний відео файл з IndexedDB</div>}
          {!videoInfo?.isVideo && !videoInfo?.isSvg && <div>• URL не містить валідний відео MIME-тип</div>}
          {videoInfo?.length < 100000 && <div>• Файл занадто малий для відео ({videoInfo.sizeKB} KB)</div>}
          
          {/* Специфічні рекомендації для QuickTime */}
          {videoInfo?.mimeType === 'data:video/quicktime' && (
            <div className="p-2 bg-orange-50 rounded border border-orange-200 mt-2">
              <div className="font-medium text-orange-800 mb-1">⚠️ Проблема з форматом QuickTime:</div>
              <div className="text-orange-700 space-y-1">
                <div>• QuickTime (.mov) не підтримується більшістю браузерів для веб-відтворення</div>
                <div>• <strong>Рішення:</strong> Перезавантажте відео в форматі MP4, WebM або OGV</div>
                <div>• Використайте онлайн конвертер або медіа програму для конвертації</div>
              </div>
            </div>
          )}
          
          {videoInfo?.isVideo && !canPlay && !videoInfo?.mimeType?.includes('quicktime') && (
            <div>• Відео файл валідний, але браузер не може його відтворити. Спробуйте інший формат.</div>
          )}
          
          {canPlay && <div>• ✅ Відео готове до використання!</div>}
          
          {error?.includes('Unable to load URL due to content type') && (
            <div className="p-2 bg-red-50 rounded border border-red-200 mt-2">
              <div className="font-medium text-red-800 mb-1">❌ Помилка відтворення:</div>
              <div className="text-red-700 space-y-1">
                <div>• Браузер не підтримує цей формат відео</div>
                <div>• <strong>Рекомендовані формати:</strong> MP4 (H.264), WebM, OGV</div>
                <div>• Конвертуйте відео в підтримуваний формат</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDebugger; 