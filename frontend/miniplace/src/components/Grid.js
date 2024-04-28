import React, { useEffect } from "react";
import "../styles/Grid.css";

const Grid = ({ grid, handlePixelClick }) => {
  useEffect(() => {
    const updateGridSize = () => {
      const wrapperBorderWidth = 10;
      const maxWidth = Math.min(window.innerWidth - wrapperBorderWidth, 639);
      const maxHeight = Math.min(window.innerHeight - wrapperBorderWidth, 797);
      const minDimension = Math.min(maxWidth, maxHeight);
      const sizePerDiv = Math.floor(minDimension / 30);
      document.documentElement.style.setProperty("--grid-size", `${sizePerDiv}px`);

      const gridWrapper = document.getElementById("gridWrapper");
      const totalSize = sizePerDiv * 30 + 1;
      gridWrapper.style.width = `${totalSize}px`;
      gridWrapper.style.height = `${totalSize}px`;
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);

    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  return (
    <div id="gridWrapper">
      <div id="grid">
        {grid.map((color, index) => (
          <div
            key={index}
            className="pixel"
            style={{ backgroundColor: color }}
            onClick={() => handlePixelClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
