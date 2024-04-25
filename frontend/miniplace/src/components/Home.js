import "../styles/Home.css";
import html2canvas from "html2canvas";
import Grid from "../components/Grid";
import footer from "../images/footer.png";
import reddit from "../images/reddit.png";
import Menubar from "../components/MenuBar";
import twitter from "../images/twitter.png";
import React, { useState, useEffect } from "react";
import ColorPalette from "../components/ColorPalette";
import LoadComponent from "../components/LoadComponent";
import GalleryComponent from "../components/GalleryComponent";
import RecButton from "../images/rec-button.png";
import StopButton from "../images/stop-button.png";
import PlayButton from "../images/play.png";
import JoinButton from "../images/join.png";
import RoomCodePopup from "../components/RoomCodePopup";

const Home = ({ loggedIn, handleLogout, handleLogin, userId }) => {
  const [grid, setGrid] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [playClicked, setPlayClicked] = useState(false);
  const [showComponent, setShowComponent] = useState("grid");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [pickerColor, setPickerColor] = useState("#FFC0CB");
  const [activeTool, setActiveTool] = useState("colorBlock");
  const [lastPickerColor, setLastPickerColor] = useState("#FFC0CB");
  const [showRoomCodePopup, setShowRoomCodePopup] = useState(false);
  const [previousColor, setPreviousColor] = useState("#ffffff");

  useEffect(() => {
    createGrid(30);
  }, []);

  const handleTrashClick = () => {
    if (showComponent === "grid") {
      createGrid(30);
    } else {
      setShowComponent("grid");
      setActiveTool("colorBlock");
      if (currentColor === pickerColor) {
        setActiveTool("colorPicker");
      }
    }
  };

  const handleJoinButtonClick = () => {
    setShowRoomCodePopup(true);
  };

  const handleJoinRoom = (roomCode) => {
    console.log("Joining room with code:", roomCode);
    setShowRoomCodePopup(false);
  };

  const handlePlayClick = () => {
    if (playClicked === true) {
    } else {
      setPlayClicked(!playClicked);
    }
  };

  const handleStopClick = () => {
    if (playClicked === true) {
      setPlayClicked(!playClicked);
    }
  };

  const handleLogoutGrid = () => {
    handleLogout();
    createGrid(30);
  };

  const handleGalleryClick = () => {
    setShowComponent("gallery");
  };

  const handleHomeClick = () => {
    setShowComponent("grid");
  };

  const handleEraserClick = () => {
    if (showComponent === "grid") {
      if (activeTool === "eraser") {
        if (previousColor !== "#ffffff") {
          setCurrentColor(previousColor);
          if (previousColor === pickerColor) {
            setActiveTool("colorPicker");
          } else {
            setActiveTool("colorBlock");
          }
        } else {
          setCurrentColor("#000000");
          setActiveTool("colorBlock");
        }
      } else {
        setPreviousColor(currentColor);
        setCurrentColor("#ffffff");
        setActiveTool("eraser");
      }
    } else {
      setShowComponent("grid");
      setCurrentColor("#ffffff");
      setActiveTool("eraser");
    }
  };

  const handleColorPickerChange = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    setPickerColor(color);
    setLastPickerColor(color);
    setActiveTool("colorPicker");
  };

  const handleColorPickerClick = () => {
    if (currentColor !== pickerColor) {
      setCurrentColor(lastPickerColor);
      setPickerColor(lastPickerColor);
    }
    setActiveTool("colorPicker");
  };

  const handleColorBlockClick = (color) => {
    setCurrentColor(color);
    setActiveTool("colorBlock");
    console.log("Color selected:", color);
  };

  const handlePixelClick = (index) => {
    const newGrid = [...grid];
    const prevColor = newGrid[index];
    newGrid[index] = currentColor;
    setGrid(newGrid);
    setUndoStack([...undoStack, { pixelIndex: index, color: prevColor }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (showComponent === "grid" && undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const newGrid = [...grid];
      newGrid[lastAction.pixelIndex] = lastAction.color;
      setGrid(newGrid);
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([
        ...redoStack,
        { pixelIndex: lastAction.pixelIndex, color: grid[lastAction.pixelIndex] },
      ]);
    } else {
      setShowComponent("grid");
    }
  };

  const handleRedo = () => {
    if (showComponent === "grid" && redoStack.length > 0) {
      const lastUndo = redoStack[redoStack.length - 1];
      const newGrid = [...grid];
      newGrid[lastUndo.pixelIndex] = lastUndo.color;
      setGrid(newGrid);
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([
        ...undoStack,
        { pixelIndex: lastUndo.pixelIndex, color: grid[lastUndo.pixelIndex] },
      ]);
    } else {
      setShowComponent("grid");
    }
  };

  const handleSave = () => {
    if (loggedIn && userId && showComponent === "grid") {
      const isAllWhite = grid.every((color) => color === "#ffffff");

      if (isAllWhite) {
        console.log("Cannot save an empty grid.");
        return;
      }

      const gridData = {
        grid,
        undoStack,
        redoStack,
      };

      html2canvas(document.getElementById("grid")).then((canvas) => {
        canvas.toBlob((blob) => {
          const formData = new FormData();
          formData.append("screenshot", blob, "screenshot.png");
          formData.append("userId", userId);
          formData.append("gridData", JSON.stringify(gridData));

          fetch("http://localhost:8000/save-grid-design", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.message);
            })
            .catch((error) => {
              console.error("Error saving grid design:", error);
            });
        });
      });
    } else {
      setShowComponent("grid");
      console.log("User not logged in. Cannot save grid design.");
    }
  };
  const handleLoad = () => {
    if (loggedIn && userId) {
      setShowComponent("load");
    } else if (showComponent != "grid") {
      setShowComponent("grid");
    }
  };

  const handleLoadGrid = (gridId) => {
    if (userId) {
      fetch(`http://localhost:8000/grid-designs/${userId}/${gridId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.gridDesign) {
            const gridData = JSON.parse(data.gridDesign.gridData);
            setGrid(gridData.grid);
            setUndoStack(gridData.undoStack);
            setRedoStack(gridData.redoStack);
            setShowComponent("grid");
          } else {
            console.log("Grid design not found.");
          }
        })
        .catch((error) => {
          console.error("Error loading grid design:", error);
        });
    } else {
      console.log("User not logged in. Cannot load grid design.");
    }
  };

  const handleDownload = () => {
    if (showComponent === "grid") {
      html2canvas(document.getElementById("grid")).then((canvas) => {
        const image = document.createElement("a");
        image.href = canvas.toDataURL("image/png");
        image.download = "miniPlace-artwork.png";
        document.body.appendChild(image);
        image.click();
        document.body.removeChild(image);
      });
    }
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
        handleLogout={handleLogoutGrid}
        loggedIn={loggedIn}
        handleGalleryClick={handleGalleryClick}
        handleHomeClick={handleHomeClick}
        handleTrashClick={handleTrashClick}
      />
      <div
        id="mainContainer"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id="buttonContainer">
          {showComponent === "grid" ? (
            <>
              {playClicked ? <img src={RecButton} alt="Record Button" id="recButton" /> : null}
              <div className="tooltip-button">
                <img src={PlayButton} alt="Play Button" id="playButton" onClick={handlePlayClick} />
                <span className="tooltiptext-button">Play</span>
              </div>
              <div className="tooltip-button">
                <img src={StopButton} alt="Stop Button" id="stopButton" onClick={handleStopClick} />
                <span className="tooltiptext-button">Stop</span>
              </div>
              <div className="tooltip-button">
                <img
                  src={JoinButton}
                  alt="Join Button"
                  id="joinButton"
                  onClick={handleJoinButtonClick}
                />
                <span className="tooltiptext-button">Join</span>
              </div>
            </>
          ) : null}
        </div>
        {showRoomCodePopup && (
          <RoomCodePopup onJoinRoom={handleJoinRoom} onClose={() => setShowRoomCodePopup(false)} />
        )}
        <div id="gridContainer">
          {showComponent === "grid" ? (
            <>
              <Grid grid={grid} handlePixelClick={handlePixelClick} />
              <ColorPalette
                currentColor={currentColor}
                pickerColor={pickerColor}
                handleColorBlockClick={handleColorBlockClick}
                handleColorPickerChange={handleColorPickerChange}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                handleColorPickerClick={handleColorPickerClick}
              />
              <img src={footer} alt="Text" id="footerText" />
            </>
          ) : showComponent === "gallery" ? (
            <GalleryComponent />
          ) : (
            <LoadComponent
              userId={userId}
              handleLoadGrid={handleLoadGrid}
              setShowComponent={setShowComponent}
            />
          )}
        </div>
      </div>
      <img src={twitter} alt="Twitter" id="twitterButton" onClick={handleTwitterShare} />
      <img src={reddit} alt="Reddit" id="redditButton" onClick={handleRedditShare} />
    </div>
  );
};

export default Home;
