// src/hooks/useWindowWidth.ts

import { useState, useEffect } from 'react';

const useWindowWidth = (breakpoint: number = 768) => {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= breakpoint);
    };

    // リサイズイベントリスナーを設定
    window.addEventListener('resize', handleResize);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isWideScreen;
};

export default useWindowWidth;