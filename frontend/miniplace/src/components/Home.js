import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "../styles/Home.css";
import logo from "../images/logo.png";
import home from "../images/home.png";
import gallery from "../images/gallery.png";
import clear from "../images/clear.png";
import eraser from "../images/eraser.png";
import undoGrid from "../images/undo.png";
import redoGrid from "../images/redo.png";
import hardDrive from "../images/hard-drive.png";
import floppyDisk from "../images/floppy-disk.png";
import download from "../images/download.png";
import signIn from "../images/sign-in.png";
import footer from "../images/footer.png";
import twitter from "../images/twitter.png";
import reddit from "../images/reddit.png";

const MiniPlace = () => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [previousColorPickerValue, setPreviousColorPickerValue] = useState("#000000");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const gridRef = useRef(null);
  const colorPickerRef = useRef(null);
  const colorBlockRefs = useRef([]);

  useEffect(() => {
    createGrid(30);

    const colorPicker = colorPickerRef.current;
    const colorBlocks = colorBlockRefs.current;

    const handleColorPickerInput = () => {
      if (colorPicker.value !== previousColorPickerValue) {
        colorBlocks.forEach((block) => block.classList.remove("selected"));
        colorPicker.classList.add("selected");
        setCurrentColor(colorPicker.value);
        setPreviousColorPickerValue(colorPicker.value);
      }
    };

    const handleColorPickerClick = () => {
      colorBlocks.forEach((block) => block.classList.remove("selected"));
      colorPicker.classList.add("selected");
      setCurrentColor(colorPicker.value);
    };

    const handleColorBlockClick = (index) => {
      colorBlocks.forEach((block) => block.classList.remove("selected"));
      colorPicker.classList.remove("selected");
      colorBlocks[index].classList.add("selected");
      setCurrentColor(colorBlocks[index].style.backgroundColor);
    };

    colorPicker.addEventListener("input", handleColorPickerInput);
    colorPicker.addEventListener("click", handleColorPickerClick);

    colorBlocks.forEach((block, index) => {
      block.addEventListener("click", () => handleColorBlockClick(index));
    });

    return () => {
      colorPicker.removeEventListener("input", handleColorPickerInput);
      colorPicker.removeEventListener("click", handleColorPickerClick);

      colorBlocks.forEach((block, index) => {
        block.removeEventListener("click", () => handleColorBlockClick(index));
      });
    };
  }, [previousColorPickerValue]);

  const createGrid = (size) => {
    const grid = gridRef.current;
    grid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement("div");
      pixel.id = `pixel-${i}`;
      pixel.addEventListener("click", function () {
        const previousColor = this.style.backgroundColor;
        this.style.backgroundColor = currentColor;
        setUndoStack([...undoStack, { pixelId: this.id, color: previousColor }]);
        setRedoStack([]);
      });
      fragment.appendChild(pixel);
    }
    grid.appendChild(fragment);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const pixel = document.getElementById(lastAction.pixelId);
      const currentColor = pixel.style.backgroundColor;
      pixel.style.backgroundColor = lastAction.color;
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([...redoStack, { pixelId: lastAction.pixelId, color: currentColor }]);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const lastUndo = redoStack[redoStack.length - 1];
      const pixel = document.getElementById(lastUndo.pixelId);
      const currentColor = pixel.style.backgroundColor;
      pixel.style.backgroundColor = lastUndo.color;
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([...undoStack, { pixelId: lastUndo.pixelId, color: currentColor }]);
    }
  };

  const saveGridState = () => {
    const gridState = getGridState();
    const savedState = {
      gridState: gridState,
      undoStack: undoStack,
      redoStack: redoStack,
    };
    localStorage.setItem("savedState", JSON.stringify(savedState));
  };

  const loadGridState = () => {
    const savedStateString = localStorage.getItem("savedState");
    if (savedStateString) {
      const savedState = JSON.parse(savedStateString);
      recreateGrid(savedState.gridState);
      setUndoStack(savedState.undoStack);
      setRedoStack(savedState.redoStack);
    } else {
      console.log("No saved state found in localStorage");
    }
  };

  const recreateGrid = (gridStateString) => {
    const gridState = JSON.parse(gridStateString);
    const gridSize = gridState.size;
    const pixelData = gridState.pixels;

    const grid = gridRef.current;
    grid.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.id = `pixel-${row * gridSize + col}`;
        pixel.style.backgroundColor = pixelData[row][col];
        pixel.addEventListener("click", function () {
          const previousColor = this.style.backgroundColor;
          this.style.backgroundColor = currentColor;
          setUndoStack([...undoStack, { pixelId: this.id, color: previousColor }]);
          setRedoStack([]);
        });
        fragment.appendChild(pixel);
      }
    }
    grid.appendChild(fragment);
  };

  const getGridState = () => {
    const gridSize = 30;
    const pixelData = [];

    const pixels = document.querySelectorAll("#grid > div");
    pixels.forEach((pixel, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      if (!pixelData[row]) {
        pixelData[row] = [];
      }

      pixelData[row][col] = pixel.style.backgroundColor;
    });

    const gridState = {
      size: gridSize,
      pixels: pixelData,
    };

    return JSON.stringify(gridState);
  };

  const downloadImage = () => {
    html2canvas(gridRef.current).then((canvas) => {
      let image = document.createElement("a");
      image.href = canvas.toDataURL("image/png");
      image.download = "miniPlace-artwork.png";
      document.body.appendChild(image);
      image.click();
      document.body.removeChild(image);
    });
  };

  const shareOnTwitter = () => {
    const pageUrl = "https://miniplace.net";
    const pageTitle = encodeURIComponent(document.title);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnReddit = () => {
    const pageUrl = "https://miniplace.net";
    const title = encodeURIComponent(document.title);
    const redditUrl = `https://reddit.com/submit?url=${pageUrl}&title=${title}`;
    window.open(redditUrl, "_blank");
  };

  return (
    <div>
      <header>
        <nav id="menuBar">
          <img src={logo} alt="Logo" id="navbarLogo" />
          <div className="tooltip">
            <img src={home} alt="Home" id="homeGrid" />
            <span className="tooltiptext">Home</span>
          </div>
          <div className="tooltip">
            <img src={gallery} alt="Gallery" id="galleryGrid" />
            <span className="tooltiptext">Gallery</span>
          </div>
          <div className="tooltip">
            <img src={clear} alt="Reset" id="resetGrid" onClick={() => createGrid(30)} />
            <span className="tooltiptext">Trash</span>
          </div>
          <div className="tooltip">
            <img
              src={eraser}
              alt="Eraser"
              id="eraserGrid"
              onClick={() => setCurrentColor("#ffffff")}
            />
            <span className="tooltiptext">Eraser</span>
          </div>
          <div className="tooltip">
            <img src={undoGrid} alt="Undo" id="undoGrid" onClick={undo} />
            <span className="tooltiptext">Undo</span>
          </div>
          <div className="tooltip">
            <img src={redoGrid} alt="Redo" id="redoGrid" onClick={redo} />
            <span className="tooltiptext">Redo</span>
          </div>
          <div className="tooltip">
            <img src={hardDrive} alt="Save" id="saveGrid" onClick={saveGridState} />
            <span className="tooltiptext">Save</span>
          </div>
          <div className="tooltip">
            <img src={floppyDisk} alt="Save" id="loadGrid" onClick={loadGridState} />
            <span className="tooltiptext-load">Load</span>
          </div>
          <div className="tooltip">
            <img src={download} alt="Download" id="downloadGrid" onClick={downloadImage} />
            <span className="tooltiptext-load">Download</span>
          </div>
          <div className="tooltip">
            <img src={signIn} alt="Account" id="accountGrid" />
            <span className="tooltiptext-load">Sign In</span>
          </div>
        </nav>
      </header>
      <main>
        <div id="gridWrapper">
          <div id="grid" ref={gridRef}></div>
        </div>
        <div id="colorPalette">
          <div
            className="colorBlock"
            style={{ backgroundColor: "#ff0000" }}
            ref={(el) => (colorBlockRefs.current[0] = el)}
          ></div>
          <div
            className="colorBlock"
            style={{ backgroundColor: "#ffa500" }}
            ref={(el) => (colorBlockRefs.current[1] = el)}
          ></div>
          <div
            className="colorBlock"
            style={{ backgroundColor: "#ffff00" }}
            ref={(el) => (colorBlockRefs.current[2] = el)}
          ></div>
          <div
            className="colorBlock"
            style={{ backgroundColor: "#008000" }}
            ref={(el) => (colorBlockRefs.current[3] = el)}
          ></div>
          <div
            className="colorBlock"
            style={{ backgroundColor: "#0000ff" }}
            ref={(el) => (colorBlockRefs.current[4] = el)}
          ></div>
          <div
            className="colorBlock"
            style={{ backgroundColor: "#4b0082" }}
            ref={(el) => (colorBlockRefs.current[5] = el)}
          ></div>
          <div
            className="colorBlock selected"
            style={{ backgroundColor: "#000000" }}
            ref={(el) => (colorBlockRefs.current[6] = el)}
          ></div>
          <input
            type="color"
            id="colorPicker"
            ref={colorPickerRef}
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>
        <img src={footer} alt="Text" id="footerText" />
      </main>
      <img src={twitter} alt="twitter" id="twitterButton" onClick={shareOnTwitter} />
      <img src={reddit} alt="reddit" id="redditButton" onClick={shareOnReddit} />
    </div>
  );
};

export default MiniPlace;
