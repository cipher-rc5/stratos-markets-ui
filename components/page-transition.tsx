'use client';

import type React from 'react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (displayChildren !== children) {
      setTransitionStage('fadeOut');
    }
  }, [children, displayChildren]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <div
      className={`transition-opacity duration-150 ease-in-out ${transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'}`}
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn');
        }
      }}>
      {displayChildren}
    </div>
  );
}
