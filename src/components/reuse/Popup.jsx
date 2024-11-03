import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from "framer-motion";

function Popup({ isOpen, onClose, children }) {

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

  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="popupFramePortal fixed inset-0 flex items-center justify-center bg-[#00000099] z-[5]"
          onClick={(e) => {
            if (!e.target.classList.contains('popupFramePortal')) return;
            onClose();
          }}
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="popupFramePortal fixed inset-0 flex items-center justify-center"
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
    ,
    document.body
  ) : null;
}

export default Popup;