import "../styles/Home.css";
import html2canvas from "html2canvas";
import Grid from "../components/Grid";
import footer from "../images/footer.png";
import reddit from "../images/reddit.png";
import Menubar from "../components/MenuBar";
import twitter from "../images/twitter.png";
import React, { useState, useEffect } from "react";
import ColorPalette from "../components/ColorPalette";

const Home = ({ loggedIn, handleLogout, handleLogin, userId }) => {
  const [grid, setGrid] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [pickerColor, setPickerColor] = useState("#FFC0CB");
  const [activeTool, setActiveTool] = useState("colorBlock");
  const [lastPickerColor, setLastPickerColor] = useState("#FFC0CB");

  useEffect(() => {
    createGrid(30);
  }, []);

  const handleEraserClick = () => {
    setCurrentColor("#ffffff");
    setActiveTool("eraser");
  };

  const handleColorPickerWrapperClick = () => {
    setActiveTool("colorPicker");
    if (currentColor !== pickerColor) {
      setCurrentColor(lastPickerColor);
      setPickerColor(lastPickerColor);
    }
  };

  const handleColorPickerChange = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    setPickerColor(color);
    setLastPickerColor(color);
    setActiveTool("colorPicker");
  };
  const handleColorBlockClick = (color) => {
    setCurrentColor(color);
    setActiveTool("colorBlock");
  };

  const handlePixelClick = (index) => {
    const newGrid = [...grid];
    const previousColor = newGrid[index];
    newGrid[index] = currentColor;
    setGrid(newGrid);
    setUndoStack([...undoStack, { pixelIndex: index, color: previousColor }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const newGrid = [...grid];
      newGrid[lastAction.pixelIndex] = lastAction.color;
      setGrid(newGrid);
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([
        ...redoStack,
        { pixelIndex: lastAction.pixelIndex, color: grid[lastAction.pixelIndex] },
      ]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastUndo = redoStack[redoStack.length - 1];
      const newGrid = [...grid];
      newGrid[lastUndo.pixelIndex] = lastUndo.color;
      setGrid(newGrid);
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([
        ...undoStack,
        { pixelIndex: lastUndo.pixelIndex, color: grid[lastUndo.pixelIndex] },
      ]);
    }
  };

  const handleSave = () => {
    const savedState = {
      grid,
      undoStack,
      redoStack,
    };
    localStorage.setItem("savedState", JSON.stringify(savedState));
  };

  const handleLoad = () => {
    const savedStateString = localStorage.getItem("savedState");
    if (savedStateString) {
      const savedState = JSON.parse(savedStateString);
      setGrid(savedState.grid);
      setUndoStack(savedState.undoStack);
      setRedoStack(savedState.redoStack);
    }
  };

  const handleDownload = () => {
    html2canvas(document.getElementById("grid")).then((canvas) => {
      const image = document.createElement("a");
      image.href = canvas.toDataURL("image/png");
      image.download = "miniPlace-artwork.png";
      document.body.appendChild(image);
      image.click();
      document.body.removeChild(image);
    });
  };

  const handleTwitterShare = () => {
    const pageUrl = "https://miniplace.net";
    const pageTitle = encodeURIComponent(document.title);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    window.open(twitterUrl, "_blank");
  };

  const handleRedditShare = () => {
    const pageUrl = "https://miniplace.net";
    const title = encodeURIComponent(document.title);
    const redditUrl = `https://reddit.com/submit?url=${pageUrl}&title=${title}`;
    window.open(redditUrl, "_blank");
  };

  const createGrid = (size) => {
    const newGrid = Array(size * size).fill("#ffffff");
    setGrid(newGrid);
  };

  return (
    <div id="homeBody">
      <Menubar
        createGrid={createGrid}
        setCurrentColor={setCurrentColor}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSave={handleSave}
        handleLoad={handleLoad}
        handleDownload={handleDownload}
        handleEraserClick={handleEraserClick}
        handleLogout={handleLogout}
        loggedIn={loggedIn}
      />
      <main id="homeMain">
        <Grid grid={grid} handlePixelClick={handlePixelClick} />
        <ColorPalette
          currentColor={currentColor}
          pickerColor={pickerColor}
          handleColorBlockClick={handleColorBlockClick}
          handleColorPickerChange={handleColorPickerChange}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleColorPickerWrapperClick={handleColorPickerWrapperClick}
        />
        <img src={footer} alt="Text" id="footerText" />
      </main>
      <img src={twitter} alt="twitter" id="twitterButton" onClick={handleTwitterShare} />
      <img src={reddit} alt="reddit" id="redditButton" onClick={handleRedditShare} />
    </div>
  );
};
export default Home;
