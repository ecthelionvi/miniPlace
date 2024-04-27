import "../styles/Home.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import Grid from "../components/Grid";
import footer from "../images/footer.png";
import Menubar from "../components/MenuBar";
import PlayButton from "../images/play.png";
import JoinButton from "../images/join.png";
import RecButton from "../images/rec-button.png";
import TrashPopup from "../components/TrashPopup";
import StopButton from "../images/stop-button.png";
import React, { useState, useEffect } from "react";
import ColorPalette from "../components/ColorPalette";
import LoadComponent from "../components/LoadComponent";
import RoomCodePopup from "../components/RoomCodePopup";
import GalleryComponent from "../components/GalleryComponent";
import NewPopup from "../components/NewPopup";
import SavePopup from "../components/SavePopup";
import ClipboardPopup from "../components/ClipboardPopup";

const Home = ({ loggedIn, handleLogout, handleLogin, userId }) => {
  const [grid, setGrid] = useState([]);
  const [gridId, setGridId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [socket, setSocket] = useState(null);
  const [playClicked, setPlayClicked] = useState(false);
  const [showComponent, setShowComponent] = useState("grid");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [pickerColor, setPickerColor] = useState("#FFC0CB");
  const [activeTool, setActiveTool] = useState("colorBlock");
  const [roomCode, setRoomCode] = useState("");
  const [lastPickerColor, setLastPickerColor] = useState("#FFC0CB");
  const [showRoomCodePopup, setShowRoomCodePopup] = useState(false);
  const [previousColor, setPreviousColor] = useState("#ffffff");
  const [showTrashPopup, setShowTrashPopup] = useState(false);
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showClipboardPopup, setShowClipboardPopup] = useState(false);

  useEffect(() => {
    if (grid.length > 0) {
      const gridData = {
        grid,
        undoStack,
        redoStack,
        activeTool,
        currentColor,
        pickerColor,
        lastPickerColor,
        previousColor,
      };
      sessionStorage.setItem("gridData", JSON.stringify(gridData));
    }
  }, [
    grid,
    undoStack,
    redoStack,
    activeTool,
    currentColor,
    lastPickerColor,
    pickerColor,
    previousColor,
  ]);

  useEffect(() => {
    const storedGrid = sessionStorage.getItem("gridData");
    if (storedGrid) {
      const parsedGrid = JSON.parse(storedGrid);
      setGrid(parsedGrid.grid);
      setUndoStack(parsedGrid.undoStack || []);
      setRedoStack(parsedGrid.redoStack || []);
      setPickerColor(parsedGrid.pickerColor);
      if (parsedGrid.activeTool === "eraser") {
        setPreviousColor(parsedGrid.previousColor);
        setActiveTool("eraser");
      } else {
        setActiveTool(parsedGrid.activeTool || "colorBlock");
        setCurrentColor(parsedGrid.currentColor || "#000000");
      }
    } else {
      console.log("No grid state found in session storage.");
      createGrid(30);
    }
  }, []);

  // useEffect(() => {
  //   createGrid(30);
  // }, []);

  useEffect(() => {
    if (roomCode.length > 0) {
      sessionStorage.setItem("roomCode", roomCode);
    }
  }, [roomCode]);

  useEffect(() => {
    const savedRoomCode = sessionStorage.getItem("roomCode");
    if (savedRoomCode) {
      setRoomCode(savedRoomCode);
    }
  }, []);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:8001");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    let newSocket;
    const savedRoomCode = sessionStorage.getItem("roomCode");
    // console.log("Saved Room Code:", savedRoomCode);

    if (savedRoomCode) {
      newSocket = io("http://localhost:8001");
      newSocket.emit("joinRoom", savedRoomCode);
      newSocket.on("connect", () => {
        // console.log("Reconnected to room:", savedRoomCode);
        newSocket.emit("requestGridState", savedRoomCode);
      });
      setSocket(newSocket);
    } else {
      newSocket = io("http://localhost:8001");
      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("pixelUpdate", ({ pixelIndex, color }) => {
        const newGrid = [...grid];
        newGrid[pixelIndex] = color;
        setGrid(newGrid);
      });

      socket.on("requestGridState", () => {
        socket.emit("gridState", { roomCode, grid });
      });

      socket.on("gridState", (receivedGrid) => {
        setGrid(receivedGrid);
      });

      socket.on("activeRoomCodes", (roomCodes) => {
        // console.log("Active Room Codes:", roomCodes);
      });

      return () => {
        socket.off("pixelUpdate");
        socket.off("requestGridState");
        socket.off("gridState");
        socket.off("activeRoomCodes");
      };
    }
  }, [socket, grid, roomCode]);

  const handleTrashClick = () => {
    const isAllWhite = grid.every((color) => color === "#ffffff");
    if ((showComponent === "grid" && !isAllWhite) || gridId) {
      setShowTrashPopup(true);
    } else {
      setShowComponent("grid");
      setActiveTool("colorBlock");
      if (currentColor === pickerColor) {
        setActiveTool("colorPicker");
      }
    }
  };

  const handleNewClick = () => {
    const isAllWhite = grid.every((color) => color === "#ffffff");

    if (showComponent !== "grid") {
      setShowComponent("grid");
      if (!isAllWhite || gridId) {
        setTimeout(() => {
          setShowNewPopup(true);
        }, 300);
      }
    } else if (showComponent === "grid" && !isAllWhite) {
      setShowNewPopup(true);
    }

    if (currentColor === pickerColor) {
      setActiveTool("colorPicker");
      setCurrentColor(pickerColor);
    } else if (currentColor !== "#ffffff") {
      setActiveTool("colorBlock");
      setCurrentColor(currentColor);
    } else if (previousColor === pickerColor) {
      setActiveTool("colorPicker");
      setCurrentColor(pickerColor);
    } else {
      setActiveTool("colorBlock");
      setCurrentColor(previousColor);
    }
  };

  const handleNewConfirm = () => {
    setGridId(null);
    createGrid(30);
    setUndoStack([]);
    setRedoStack([]);
    setShowNewPopup(false);
  };

  const handleNewCancel = () => {
    setShowNewPopup(false);
  };

  const handleDeleteConfirm = () => {
    if (gridId && userId) {
      fetch(`http://localhost:8000/grid-designs/${userId}/${gridId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          createGrid(30);
          setShowTrashPopup(false);
          setGridId(null);
        })
        .catch((error) => {
          console.error("Error deleting grid design:", error);
        });
    } else {
      createGrid(30);
      setShowTrashPopup(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowTrashPopup(false);
  };

  const handleCopyRoomCode = () => {
    if (!roomCode) {
      alert("No room code available to copy.");
      return;
    }
    navigator.clipboard
      .writeText(roomCode)
      .then(() => {
        handleClipboardPopup();
        console.log("Room code copied to clipboard");
      })
      .catch((error) => {
        alert("Failed to copy room code. Please try again.");
        console.error("Failed to copy room code:", error);
      });
  };

  const handleJoinButtonClick = () => {
    setShowRoomCodePopup(true);
  };

  const handleJoinRoom = (enteredRoomCode, callback) => {
    // console.log("Joining room with code:", enteredRoomCode);
    setRoomCode(enteredRoomCode);
    sessionStorage.setItem("roomCode", enteredRoomCode);

    if (!socket) {
      const newSocket = io("http://localhost:8001");
      setSocket(newSocket);

      newSocket.emit("checkRoomCode", enteredRoomCode, (isValid) => {
        if (isValid) {
          setRoomCode(enteredRoomCode);
          setShowRoomCodePopup(false);
          newSocket.emit("joinRoom", enteredRoomCode);
          newSocket.emit("requestGridState", enteredRoomCode);
          setPlayClicked(true);
        } else {
          console.log("Invalid room code:", enteredRoomCode);
          callback(false);
        }
      });
    } else {
      socket.emit("checkRoomCode", enteredRoomCode, (isValid) => {
        if (isValid) {
          setRoomCode(enteredRoomCode);
          setShowRoomCodePopup(false);
          socket.emit("joinRoom", enteredRoomCode);
          socket.emit("requestGridState", enteredRoomCode);
          setPlayClicked(true);
        } else {
          console.log("Invalid room code:", enteredRoomCode);
          callback(false);
        }
      });
    }
  };

  const handlePlayClick = () => {
    if (playClicked === true) {
      setPlayClicked(false);
      setRoomCode("");
      if (socket) {
        socket.disconnect();
        setSocket(null);
        // console.log("Socket disconnected");
      }
    } else {
      setPlayClicked(true);
      const newRoomCode = uuidv4().slice(0, 8);
      setRoomCode(newRoomCode);
      // console.log("Room Code:", newRoomCode);
      const newSocket = io("http://localhost:8001");
      setSocket(newSocket);
      newSocket.emit("createRoom", newRoomCode);
      newSocket.emit("requestGridState", newRoomCode);
    }
  };

  const handleStopClick = () => {
    if (socket) {
      setRoomCode("");
      setPlayClicked(false);
      socket.disconnect();
      setSocket(null);
      sessionStorage.removeItem("roomCode");
      // console.log("Socket disconnected");
    } else if (playClicked === true) {
      setPlayClicked(false);
      setRoomCode("");
    }
  };

  const handleLogoutGrid = () => {
    handleLogout();
    createGrid(30);
    setGridId(null);
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
    // console.log("Color selected:", color);
  };

  const handlePixelClick = (index) => {
    const newGrid = [...grid];
    const prevColor = newGrid[index];
    newGrid[index] = currentColor;
    setGrid(newGrid);
    setUndoStack([...undoStack, { pixelIndex: index, color: prevColor }]);
    setRedoStack([]);

    if (socket) {
      socket.emit("pixelUpdate", { roomCode, pixelIndex: index, color: currentColor });
    }
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

      if (socket) {
        socket.emit("pixelUpdate", {
          roomCode,
          pixelIndex: lastAction.pixelIndex,
          color: lastAction.color,
        });
      }
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

      if (socket) {
        socket.emit("pixelUpdate", {
          roomCode,
          pixelIndex: lastUndo.pixelIndex,
          color: lastUndo.color,
        });
      }
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

          if (gridId) {
            formData.append("gridId", gridId);
          }

          fetch("http://localhost:8000/save-grid-design", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log(data.message);
              if (data.gridId) {
                setGridId(data.gridId);
              }
              if (
                data.message === "Grid design saved successfully" ||
                data.message === "Grid design updated successfully"
              ) {
                handleSavePopup();
              }
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

  const handleSavePopup = () => {
    setShowSavePopup(true);
  };

  const handleClipboardPopup = () => {
    setShowClipboardPopup(true);
  };

  const handleLoad = () => {
    if (loggedIn && userId) {
      setShowComponent("load");
    } else if (showComponent !== "grid") {
      setShowComponent("grid");
    }
  };

  const handleLoadGrid = (gridId) => {
    if (userId) {
      setGridId(gridId);
      fetch(`http://localhost:8000/grid-designs/${userId}/${gridId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.gridDesign) {
            const gridData = JSON.parse(data.gridDesign.gridData);
            setGrid(gridData.grid);
            setUndoStack(gridData.undoStack);
            setRedoStack(gridData.redoStack);
            setShowComponent("grid");

            if (socket) {
              socket.emit("gridState", { roomCode, grid: gridData.grid });
            }
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
        handleTwitterShare={handleTwitterShare}
        handleNewClick={handleNewClick}
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
              {roomCode && (
                <div id="roomCodeContainer">
                  <span>🏠#️⃣ {roomCode} </span>
                  <button onClick={handleCopyRoomCode}>Copy</button>
                </div>
              )}
            </>
          ) : null}
        </div>
        {showRoomCodePopup && (
          <RoomCodePopup onJoinRoom={handleJoinRoom} onClose={() => setShowRoomCodePopup(false)} />
        )}
        {showTrashPopup && (
          <TrashPopup onConfirm={handleDeleteConfirm} onClose={handleDeleteCancel} />
        )}
        {showNewPopup && <NewPopup onConfirm={handleNewConfirm} onClose={handleNewCancel} />}
        {showSavePopup && <SavePopup onClose={() => setShowSavePopup(false)} />}
        {showClipboardPopup && <ClipboardPopup onClose={() => setShowClipboardPopup(false)} />}
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
    </div>
  );
};

export default Home;
