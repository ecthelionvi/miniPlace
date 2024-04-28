import "../styles/GalleryComponent.css";
import Gallery from "react-photo-gallery";
import React, { useState, useEffect } from "react";
import loadText from "../images/load.png";

const LoadComponent = ({ userId, handleLoadGrid }) => {
  const [photos, setPhotos] = useState([]);
  const [galleryWidth, setGalleryWidth] = useState(0); // state to store gallery width

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

      const handleResize = () => {
        const maxImagesPerRow = Math.floor(window.innerWidth / 268); // calculate images per row
        const newGalleryWidth = maxImagesPerRow * 268; // calculate new gallery width
        const maxWidth = 1300; // Define your maximum width here
        setGalleryWidth(Math.min(newGalleryWidth, maxWidth)); // Set the smaller of calculated or max width
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // Initial call

      return () => window.removeEventListener("resize", handleResize);
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
      <div className="gallery-container" style={{ width: `${galleryWidth}px` }}>
        <Gallery photos={photos} onClick={handleImageClick} />
      </div>
    </div>
  );
};

export default LoadComponent;
