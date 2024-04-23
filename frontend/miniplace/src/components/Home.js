import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "../styles/Home.css";

const MiniPlace = () => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    createGrid(30);
  }, []);

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
          <img src="./images/logo.png" alt="Logo" id="navbarLogo" />
          <div className="tooltip">
            <img src="./images/home.png" alt="Home" id="homeGrid" />
            <span className="tooltiptext">Home</span>
          </div>
          <div className="tooltip">
            <img src="./images/gallery.png" alt="Gallery" id="galleryGrid" />
            <span className="tooltiptext">Gallery</span>
          </div>
          <div className="tooltip">
            <img
              src="./images/clear.png"
              alt="Reset"
              id="resetGrid"
              onClick={() => createGrid(30)}
            />
            <span className="tooltiptext">Trash</span>
          </div>
          <div className="tooltip">
            <img
              src="./images/eraser.png"
              alt="Eraser"
              id="eraserGrid"
              onClick={() => setCurrentColor("#ffffff")}
            />
            <span className="tooltiptext">Eraser</span>
          </div>
          <div className="tooltip">
            <img src="./images/undo.png" alt="Reset" id="undoGrid" onClick={undo} />
            <span className="tooltiptext">Undo</span>
          </div>
          <div className="tooltip">
            <img src="./images/redo.png" alt="Reset" id="redoGrid" onClick={redo} />
            <span className="tooltiptext">Redo</span>
          </div>
          <div className="tooltip">
            <img src="./images/hard-drive.png" alt="Save" id="saveGrid" onClick={saveGridState} />
            <span className="tooltiptext">Save</span>
          </div>
          <div className="tooltip">
            <img src="./images/floppy-disk.png" alt="Save" id="loadGrid" onClick={loadGridState} />
            <span className="tooltiptext-load">Load</span>
          </div>
          <div className="tooltip">
            <img
              src="./images/download.png"
              alt="Download"
              id="downloadGrid"
              onClick={downloadImage}
            />
            <span className="tooltiptext-load">Download</span>
          </div>
          <div className="tooltip">
            <img src="./images/sign-in.png" alt="Account" id="accountGrid" />
            <span className="tooltiptext-load">Sign In</span>
          </div>
        </nav>
      </header>
      <main>
        <div id="gridWrapper">
          <div id="grid" ref={gridRef}></div>
        </div>
        <div id="colorPalette">
          <div className="colorBlock" style={{ backgroundColor: "#ff0000" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#ffa500" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#ffff00" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#008000" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#0000ff" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#4b0082" }}></div>
          <div className="colorBlock selected" style={{ backgroundColor: "#000000" }}></div>
          <input
            type="color"
            id="colorPicker"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>
        <img src="./images/footer.png" alt="Text" id="footerText" />
      </main>
      <img src="./images/twitter.png" alt="twitter" id="twitterButton" onClick={shareOnTwitter} />
      <img src="./images/reddit.png" alt="reddit" id="redditButton" onClick={shareOnReddit} />
    </div>
  );
};

export default MiniPlace;
