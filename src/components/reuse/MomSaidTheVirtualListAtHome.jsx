import { useEffect, useRef, useState } from 'react';

/**
 * Homemake virtual list
 * Me: Mom, can I have a virtual list?
 * Mom: We have a virtual list at home
 * Virtual list at home:
 */
function MomSaidTheVirtualListAtHome({ inVisibleHeight = '62.5px', ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '10px',
        threshold: 0
      }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      if (blockRef.current) {
        observer.unobserve(blockRef.current);
      }
    };
  }, []);

  return (
    <div {...props} ref={blockRef} style={{ minHeight: isVisible ? 'auto' : inVisibleHeight }}>
      {isVisible && (
        <>
          {props.children}
        </>
      )}
    </div>
  )
}

export default MomSaidTheVirtualListAtHome;