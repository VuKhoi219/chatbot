import { Button } from '@/components/ui/button';
import { SurveyAndFeedback } from '@/components/custom/survey-and-feedback';
import HorizontalMenu from '@/components/custom/horizontalmenu'
import { Music } from '@/components/custom/music';
import { Podcast } from '@/components/custom/podcast';
import React, { useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
export const RightSidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('music');

  return (

    <div
      className={`
        bg-gray-200 w-80 p-4 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isOpen ? 'shadow-lg' : ''}
        fixed top-0 right-0 h-full z-40 flex flex-col
      `}
    >
      {/* Close Button */}
      <Button 
        onClick={onClose} 
        className="absolute top-2 left-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        <KeyboardArrowRightIcon/>
      </Button>

      {/*Top Half */}
      <div className="h-1/2 mt-12 mb-2 flex flex-col">
        <HorizontalMenu   activeTab={activeTab} onTabChange={setActiveTab} />
        <Music isActive={activeTab === 'music'} />
        <Podcast isActive={activeTab === 'podcast'} />
      </div>

      {/* Survey Forms Section - Bottom Half */}
      <div className="h-1/2 border-t border-gray-300 pt-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 flex items-center flex-shrink-0">
          📋 Khảo sát & Phản hồi
        </h2>
        <SurveyAndFeedback/>
      </div>
    </div>
  );
};