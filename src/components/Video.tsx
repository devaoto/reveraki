'use client';

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function RenderVideo({
  trailer,
}: Readonly<{ trailer: string }>) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleVideoEnded = () => {
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <motion.video
        src={trailer as string}
        preload="auto"
        autoPlay={isPlaying}
        muted
        onEnded={handleVideoEnded}
        className="h-[300px] min-w-[500px] rounded-lg object-cover md:h-[350px] md:min-w-[1000px] lg:h-[600px] lg:min-w-[2000px]"
      ></motion.video>
    </div>
  );
}
