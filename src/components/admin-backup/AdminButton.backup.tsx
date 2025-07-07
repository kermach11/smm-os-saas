import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AdminButtonProps {
  onClick: () => void;
  isVisible?: boolean;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick, isVisible = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={onClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              size="lg"
              className="w-14 h-14 rounded-full bg-gray-900/80 hover:bg-gray-900 backdrop-blur-sm border border-gray-700 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <motion.div
                animate={{ rotate: isHovered ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.div>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-gray-900 text-white border-gray-700">
          <p>Панель адміністратора</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminButton; 