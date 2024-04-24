import React, { useState, useCallback, useEffect } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import "../styles/GalleryComponent.css";

const GalleryComponent = ({ userId, handleLoadGrid, setShowGrid }) => {
  const [photos, setPhotos] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8000/user-grid-designs/${userId}`)
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

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const handleImageClick = (event, { photo }) => {
    if (photo.id) {
      handleLoadGrid(photo.id);
    }
  };

  return (
    <div className="gallery-container">
      <Gallery photos={photos} onClick={handleImageClick} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map((x) => ({
                ...x,
                srcset: x.srcSet,
                caption: `ID: ${x.id}`,
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
};

export default GalleryComponent;
