import { useEffect, useState, useRef } from "react";
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from "framer-motion";

/**
 * @example
 *  <KF_modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <>
        <style jsx>{`.scrollbar::-webkit-scrollbar {width: 5px;height: 5px;border-radius:10px;}.scrollbar::-webkit-scrollbar-track {background: var(--cms-bg);}.scrollbar::-webkit-scrollbar-thumb {background: var(--cms-text);}.scrollbar::-webkit-scrollbar-thumb:hover {background: var(--cms-bg_hover);}.input_text::placeholder {color: var(--cms-text);}`}</style>

        <div className="w-[600px] max-w-[90%] max-h-[90%] bg-[--cms-bg] text-[--cms-text] rounded-[25px] shadow-sm overflow-hidden flex flex-col">

          <div className="scrollbar flex flex-col gap-[15px] p-[20px] text-[12px] overflow-auto ">
            <h2 className="text-xl mb-4">
              {_key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
            </h2>
            <JSONBuilder value={row[_key]} readOnly />
          </div >
        </div >
      </>
    </KF_modal >
 */
function Popup({ isOpen, onClose, children, relative, target }) {
  const modalId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`);

  const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const variantsChild = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.8 },
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackgroundClick = (e) => {
    if (e.target.id === modalId.current) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={modalId.current}
          className="popupFramePortal inset-0 flex items-center justify-center bg-[#00000099] z-[50]"
          style={{ position: relative || target ? 'absolute' : 'fixed' }}
          // onClick={handleBackgroundClick}
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.15 }}
        >
          <motion.div
            id={modalId.current}
            className="popupFramePortal inset-0 flex items-center justify-center"
            style={{ position: relative || target ? 'absolute' : 'fixed' }}
            onClick={handleBackgroundClick}
            variants={variantsChild}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (relative) {
    return modalContent;
  }

  return typeof document !== 'undefined'
    ? createPortal(
      modalContent,
      target ? document.querySelector(target) : document.body
    )
    : null;
}

export default Popup;