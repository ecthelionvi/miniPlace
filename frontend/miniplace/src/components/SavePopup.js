import React, { useRef, useEffect } from "react";
import "../styles/SavePopup.css";

const SavePopup = ({ onConfirm, onClose }) => {
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
    <div className="save-popup-overlay">
      <div className="save-popup-container" ref={popupRef}>
        <div className="save-popup-content">
          <h2 className="save-popup-title">Design Saved Successfully</h2>
          <div className="save-popup-buttons"></div>
        </div>
      </div>
    </div>
  );
};

export default SavePopup;
