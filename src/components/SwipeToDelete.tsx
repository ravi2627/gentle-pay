import { ReactNode, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  className?: string;
}

export function SwipeToDelete({ children, onDelete, className = "" }: SwipeToDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const deleteThreshold = -80;
  
  // Transform for the delete background opacity
  const deleteOpacity = useTransform(x, [0, deleteThreshold], [0, 1]);
  const deleteScale = useTransform(x, [0, deleteThreshold], [0.5, 1]);
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < deleteThreshold) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, 200);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Delete background */}
      <motion.div 
        className="absolute inset-y-0 right-0 w-20 bg-destructive flex items-center justify-center"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ scale: deleteScale }}>
          <Trash2 className="w-5 h-5 text-destructive-foreground" />
        </motion.div>
      </motion.div>
      
      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: deleteThreshold, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isDeleting ? { x: -300, opacity: 0 } : {}}
        transition={{ duration: 0.2 }}
        className="relative bg-background touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}
