'use client';

import { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';
import { getCurrentProgressValue } from '@/lib/get-current-progress-value';
import Only100KLogo from '@/public/100kLogoBLue.png';
import Image from 'next/image';

const ProgressBar = () => {
  const [progressRealValue, setProgressRealValue] = useState(40);
  const [progressAnimatedValue, setProgressAnimatedValue] = useState(0);

  useEffect(() => {
    const currentProgress = getCurrentProgressValue();
    setProgressRealValue(currentProgress);
  }, []);

  useEffect(() => {
    setProgressAnimatedValue((progressRealValue * 100) / 5000);
  }, [progressRealValue]);

  return (
    <div className="relative w-full h-7 mt-2">
      <Progress value={progressAnimatedValue} className="h-3 bg-border" />
      <p className="absolute left-0 top-4 text-xs text-center text-foreground">
        0
      </p>
      <p className="absolute right-0 top-4 text-xs  text-center text-foreground">
        5000
      </p>
      <div className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-center text-foreground flex flex-center">
        <p className="pr-1">{progressRealValue}</p>
        <div className="w-2 h-2 bg-gold rounded-full">
          <div className="w-2 h-2 bg-gold rounded-full animate-ping"></div>
        </div>
        <Image
          loading={'lazy'}
          className="w-11"
          src={Only100KLogo}
          alt="Only 100K Logo"
        />
      </div>
    </div>
  );
};
export default ProgressBar;
