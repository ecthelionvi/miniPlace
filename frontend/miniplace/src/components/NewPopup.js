import React, { useRef, useEffect } from "react";
import "../styles/NewPopup.css";

const NewPopup = ({ onConfirm, onClose }) => {
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
    <div className="new-popup-overlay">
      <div className="new-popup-container" ref={popupRef}>
        <div className="new-popup-content">
          <h2 className="new-popup-title">New Design?</h2>
          <div className="new-popup-buttons">
            <button className="new-popup-button" onClick={onConfirm}>
              Yes
            </button>
            <button className="new-popup-button" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPopup;
