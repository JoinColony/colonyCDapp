import clsx from 'clsx';
import React, {
  useRef,
  useState,
  useEffect,
  type PropsWithChildren,
  type FC,
} from 'react';

import styles from './ArrowScroller.module.css';

interface ArrowScrollerProps extends PropsWithChildren {
  className?: string;
  buttonLeftContent: JSX.Element;
  buttonRightContent: JSX.Element;
}

const SCROLL_OFFSET = 10;

const ArrowScroller: FC<ArrowScrollerProps> = ({
  buttonLeftContent,
  buttonRightContent,
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) {
        return;
      }
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const isAtStart = scrollLeft < 0 + SCROLL_OFFSET;
      const isAtEnd =
        Math.ceil(scrollLeft + clientWidth) > scrollWidth - SCROLL_OFFSET;

      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    };

    const { current } = containerRef;
    current?.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollLeft = () => {
    if (!containerRef.current) {
      return;
    }

    const { clientWidth, scrollLeft: currentScrollLeft } = containerRef.current;
    const boundedScrollLeft = Math.min(clientWidth * 0.5, currentScrollLeft);
    containerRef?.current.scrollBy({
      left: -boundedScrollLeft,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    if (!containerRef.current) {
      return;
    }

    const {
      clientWidth,
      scrollLeft: currentScrollLeft,
      scrollWidth,
    } = containerRef.current;
    const remainingScroll = scrollWidth - currentScrollLeft - clientWidth;
    const boundedScrollLeft = Math.min(clientWidth * 0.5, remainingScroll);
    containerRef?.current.scrollBy({
      left: boundedScrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative max-w-full overflow-hidden">
      {canScrollLeft && (
        <button
          type="button"
          className="absolute left-0 top-0 z-10 h-full"
          onClick={scrollLeft}
        >
          {buttonLeftContent}
        </button>
      )}
      <div
        ref={containerRef}
        className={clsx(
          styles.scrollContainer,
          'scrollbar-hide max-w-full overflow-x-auto',
          className,
        )}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          className="absolute right-0 top-0 z-10 h-full"
          onClick={scrollRight}
        >
          {buttonRightContent}
        </button>
      )}
    </div>
  );
};

export default ArrowScroller;
