import React, { useState, useRef, useEffect } from "react";
import "../styles/RoomCodePopup.css";

const RoomCodePopup = ({ onJoinRoom, onClose }) => {
  const [roomCode, setRoomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRoomCodeValid, setIsRoomCodeValid] = useState(false);
  const popupRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRoomCodeValid) {
      onJoinRoom(roomCode, (isValid) => {
        if (!isValid) {
          setErrorMessage("Invalid Room Code");
        }
      });
    }
  };

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

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isRoomCodeValid) {
        e.preventDefault();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRoomCodeValid, onClose]);

  return (
    <div className="room-code-popup-overlay">
      <div className="room-code-popup-container" ref={popupRef}>
        <div className="room-code-popup-content">
          <h2 className="room-code-popup-title">Enter Room Code</h2>
          <form onSubmit={handleSubmit} className="room-code-popup-form">
            <div className="room-code-popup-group">
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => {
                  const code = e.target.value;
                  setRoomCode(code);
                  setIsRoomCodeValid(code.trim().length > 0);
                  setErrorMessage("");
                }}
                required
                className={`room-code-popup-input ${errorMessage ? "invalid" : ""}`}
              />
              {errorMessage && <span className="room-code-popup-error">{errorMessage}</span>}
            </div>
            <button type="submit" className="room-code-popup-button" disabled={!isRoomCodeValid}>
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomCodePopup;
