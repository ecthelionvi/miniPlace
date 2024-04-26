import React, { useRef, useEffect } from "react";
import "../styles/TrashPopup.css";

const TrashPopup = ({ onConfirm, onClose }) => {
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
    <div className="trash-popup-overlay">
      <div className="trash-popup-container" ref={popupRef}>
        <div className="trash-popup-content">
          <h2 className="trash-popup-title">Delete Design?</h2>
          <div className="trash-popup-buttons">
            <button className="trash-popup-button" onClick={onConfirm}>
              Yes
            </button>
            <button className="trash-popup-button" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashPopup;
