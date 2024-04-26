import React, { useRef, useEffect } from "react";
import "../styles/ClipboardPopup.css";

const ClipboardPopup = ({ onConfirm, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="clipboard-popup-overlay">
      <div className="clipboard-popup-container" ref={popupRef}>
        <div className="clipboard-popup-content">
          <h2 className="clipboard-popup-title">Code Copied to Clipboard</h2>
          <div className="clipboard-popup-buttons"></div>
        </div>
      </div>
    </div>
  );
};

export default ClipboardPopup;
