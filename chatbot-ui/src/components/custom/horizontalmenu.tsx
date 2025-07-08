import React from 'react';
import { Box, Typography } from '@mui/material';
import * as RadixNavigationMenu from '@radix-ui/react-navigation-menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import SpaIcon from '@mui/icons-material/Spa';
const HorizontalMenu = ({ activeTab, onTabChange }) => {
  const handelOnClick = (item) => {
    onTabChange(item)
  } 


  return (
    <Box sx={{ mb: 3 }}>
      <RadixNavigationMenu.Root className='text-center'>
        <RadixNavigationMenu.List className="flex list-none p-0 bg-gray-800 justify-center">
          <RadixNavigationMenu.Item className="flex-1">
            <RadixNavigationMenu.Link asChild>
              <Box
                component="a"
                onClick={() => onTabChange('music')}
                className="flex items-center justify-center px-5 py-3 text-white no-underline font-sans hover:bg-gray-600 w-full"
              >
                <MusicNoteIcon/>
              </Box>
            </RadixNavigationMenu.Link>
          </RadixNavigationMenu.Item>
          
          <RadixNavigationMenu.Item className="flex-1">
            <RadixNavigationMenu.Link asChild>
              <Box
                component="a"
                onClick={() => onTabChange('podcast')}
                className="flex items-center justify-center px-5 py-3 text-white no-underline font-sans hover:bg-gray-600 w-full"
              >
                <PodcastsIcon/>
              </Box>
            </RadixNavigationMenu.Link>
          </RadixNavigationMenu.Item>
          
          <RadixNavigationMenu.Item className="flex-1">
            <RadixNavigationMenu.Link asChild>
              <Box
                component="a"
                onClick={() => onTabChange('therapy')}
                className="flex items-center justify-center px-5 py-3 text-white no-underline font-sans hover:bg-gray-600 w-full"
              >
                <SpaIcon/>
              </Box>
            </RadixNavigationMenu.Link>
          </RadixNavigationMenu.Item>
        </RadixNavigationMenu.List>
      </RadixNavigationMenu.Root>
    </Box>
  );
};

export default HorizontalMenu;