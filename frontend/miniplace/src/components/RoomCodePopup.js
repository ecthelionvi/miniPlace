import React, { useState, useRef, useEffect } from "react";
import "../styles/RoomCodePopup.css";

const RoomCodePopup = ({ onJoinRoom, onClose }) => {
  const [roomCode, setRoomCode] = useState("");
  const popupRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoinRoom(roomCode);
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="room-code-popup-overlay">
      <div className="room-code-popup-container" ref={popupRef}>
        <div className="room-code-popup-content">
          {" "}
          <h2 className="room-code-popup-title">Enter Room Code</h2>
          <form onSubmit={handleSubmit} className="room-code-popup-form">
            <div className="room-code-popup-group">
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
                className="room-code-popup-input"
              />
            </div>
            <button type="submit" className="room-code-popup-button">
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomCodePopup;
