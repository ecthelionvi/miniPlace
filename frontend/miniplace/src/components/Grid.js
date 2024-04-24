import React from "react";
import "../styles/Grid.css";

const Grid = ({ grid, handlePixelClick }) => {
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
