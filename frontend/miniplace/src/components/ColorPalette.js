import React from "react";
import "../styles/ColorPalette.css";

const ColorPalette = ({
  currentColor,
  pickerColor,
  handleColorBlockClick,
  handleColorPickerChange,
  activeTool,
  setActiveTool,
  handleColorPickerClick,
}) => {
  return (
    <div id="colorPalette">
      <div
        className={`colorBlock ${currentColor === "#ff0000" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#ff0000" }}
        onClick={() => handleColorBlockClick("#ff0000")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#ffa500" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#ffa500" }}
        onClick={() => handleColorBlockClick("#ffa500")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#ffff00" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#ffff00" }}
        onClick={() => handleColorBlockClick("#ffff00")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#008000" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#008000" }}
        onClick={() => handleColorBlockClick("#008000")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#0000ff" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#0000ff" }}
        onClick={() => handleColorBlockClick("#0000ff")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#4b0082" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#4b0082" }}
        onClick={() => handleColorBlockClick("#4b0082")}
      ></div>
      <div
        className={`colorBlock ${currentColor === "#000000" && activeTool === "colorBlock" ? "selected" : ""}`}
        style={{ backgroundColor: "#000000" }}
        onClick={() => handleColorBlockClick("#000000")}
      ></div>
      <input
        type="color"
        id="colorPicker"
        value={pickerColor}
        onChange={handleColorPickerChange}
        onClick={handleColorPickerClick}
        className={activeTool === "colorPicker" ? "selected" : ""}
      />
    </div>
  );
};

export default ColorPalette;
