import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import React, { useState } from 'react';

export const Therapy = ({isActive}) => { 
      const [currentTherapy, setCurrentTherapy] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      if (!isActive) return null;
      // Danh sách nhạc mẫu
      const playlist = [
        { id: 1, title: 'Thở sâu để giảm căng thẳng', description: 'Hướng dẫn kỹ thuật thở sâu để giảm căng thẳng và lo âu trong cuộc sống hàng ngày', duration: '15:30' },
        { id: 2, title: 'Quản lý cảm xúc tiêu cực', description: 'Học cách nhận diện, chấp nhận và chuyển hóa các cảm xúc tiêu cực một cách lành mạnh',duration: '38:15'},
    
      ];
    
      const playPause = () => {
        setIsPlaying(!isPlaying);
      };
    
      const nextTherapy = () => {
        setCurrentTherapy((prev) => (prev + 1) % playlist.length);
      };
    
      const prevTherapy = () => {
        setCurrentTherapy((prev) => (prev - 1 + playlist.length) % playlist.length);
      };
    
      const selectTherapy = (index) => {
        setCurrentTherapy(index);
        setIsPlaying(true);
      };
    return (<>
        {/* Current Playing */}
        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm flex-shrink-0">
          <div className="text-sm font-medium text-gray-800 truncate">
            {playlist[currentTherapy].title}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {playlist[currentTherapy].description}
          </div>
          <div className="text-xs text-gray-500">
            {playlist[currentTherapy].duration}
          </div>
          
          {/* Player Controls */}
          <div className="flex items-center justify-center space-x-4 mt-3">
            <button onClick={prevTherapy} className="text-gray-600 hover:text-gray-800">
              <SkipBack className="h-5 w-5" />
            </button>
            <button 
              onClick={playPause}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={nextTherapy} className="text-gray-600 hover:text-gray-800">
              <SkipForward className="h-5 w-5" />
            </button>
            <Volume2 className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="space-y-2 pb-6">
              {playlist.map((therapy, index) => (
                <div
                  key={therapy.id}
                  onClick={() => selectTherapy(index)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${index === currentTherapy 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {therapy.title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {therapy.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {therapy.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>)
}
