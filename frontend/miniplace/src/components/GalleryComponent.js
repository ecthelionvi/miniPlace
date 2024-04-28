import React, { useState, useCallback, useEffect } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import "../styles/GalleryComponent.css";
import GalleryText from "../images/gallery-text.png";

const GalleryComponent = () => {
  const [photos, setPhotos] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [galleryWidth, setGalleryWidth] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/all-grid-designs`)
      .then((response) => response.json())
      .then((data) => {
        const photoData = data.gridDesigns.map((design) => ({
          src: `data:image/png;base64,${design.screenshot}`,
          width: design.width,
          height: design.height,
        }));
        setPhotos(photoData);
      })
      .catch((error) => {
        console.error("Error loading photos:", error);
      });

    const handleResize = () => {
      const maxImagesPerRow = Math.floor(window.innerWidth / 268);
      const newGalleryWidth = maxImagesPerRow * 268;
      const maxWidth = 1300;
      setGalleryWidth(Math.min(newGalleryWidth, maxWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentImage((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
      } else if (event.key === "ArrowRight") {
        setCurrentImage((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
      }
    },
    [photos],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="gallery-container-hero">
      <img src={GalleryText} alt="GalleryText" className="gallery-text" />
      <div className="gallery-container" style={{ width: `${galleryWidth}px` }}>
        <Gallery photos={photos} onClick={openLightbox} />
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={photos.map((x) => ({
                  ...x,
                  srcset: x.srcSet,
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    </div>
  );
};

export default GalleryComponent;
