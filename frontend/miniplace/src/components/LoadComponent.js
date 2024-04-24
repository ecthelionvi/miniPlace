import "../styles/GalleryComponent.css";
import Gallery from "react-photo-gallery";
import React, { useState, useEffect } from "react";
import loadText from "../images/load.png";

const LoadComponent = ({ userId, handleLoadGrid }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8000/grid-designs/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          const photoData = data.gridDesigns.map((design) => ({
            src: `data:image/png;base64,${design.screenshot}`,
            width: design.width,
            height: design.height,
            id: design.id,
          }));
          setPhotos(photoData);
        })
        .catch((error) => {
          console.error("Error loading photos:", error);
        });
    }
  }, [userId]);

  const handleImageClick = (event, { photo }) => {
    if (photo.id) {
      handleLoadGrid(photo.id);
    }
  };

  return (
    <div className="gallery-container-hero">
      <img src={loadText} alt="LoadText" className="gallery-text-load" />
      <div className="gallery-container">
        <Gallery photos={photos} onClick={handleImageClick} />
      </div>
    </div>
  );
};

export default LoadComponent;
