import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import React, { useState } from 'react';

export const Podcast = ({isActive}) => { 
      const [currentPodcast, setCurrentPodcast] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      if (!isActive) return null;

      // Danh sách nhạc mẫu
      const playlist = [
        { id: 1, title: 'Khởi nghiệp trong thời đại số', description: 'Chia sẻ kinh nghiệm khởi nghiệp từ các founder thành công', duration: '45:30' },
        { id: 2, title: 'Tương lai của AI trong giáo dục', description: 'Thảo luận về ứng dụng AI trong việc học tập và giảng dạy',duration: '38:15'},
    
      ];
    
      const playPause = () => {
        setIsPlaying(!isPlaying);
      };
    
      const nextPodcast = () => {
        setCurrentPodcast((prev) => (prev + 1) % playlist.length);
      };
    
      const prevPodcast = () => {
        setCurrentPodcast((prev) => (prev - 1 + playlist.length) % playlist.length);
      };
    
      const selectPodcast = (index) => {
        setCurrentPodcast(index);
        setIsPlaying(true);
      };
    return (<>
        {/* Current Playing */}
        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm flex-shrink-0">
          <div className="text-sm font-medium text-gray-800 truncate">
            {playlist[currentPodcast].title}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {playlist[currentPodcast].description}
          </div>
          <div className="text-xs text-gray-500">
            {playlist[currentPodcast].duration}
          </div>
          
          {/* Player Controls */}
          <div className="flex items-center justify-center space-x-4 mt-3">
            <button onClick={prevPodcast} className="text-gray-600 hover:text-gray-800">
              <SkipBack className="h-5 w-5" />
            </button>
            <button 
              onClick={playPause}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={nextPodcast} className="text-gray-600 hover:text-gray-800">
              <SkipForward className="h-5 w-5" />
            </button>
            <Volume2 className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="space-y-2 pb-6">
              {playlist.map((podcast, index) => (
                <div
                  key={podcast.id}
                  onClick={() => selectPodcast(index)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${index === currentPodcast 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {podcast.title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {podcast.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {podcast.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>)
}
