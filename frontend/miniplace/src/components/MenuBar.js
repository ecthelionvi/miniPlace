import React from "react";
import "../styles/MenuBar.css";
import logo from "../images/logo.png";
import home from "../images/home.png";
import unDo from "../images/undo.png";
import reDo from "../images/redo.png";
import trash from "../images/clear.png";
import eraser from "../images/eraser.png";
import { NavLink } from "react-router-dom";
import signIn from "../images/sign-in.png";
import gallery from "../images/gallery.png";
import download from "../images/download.png";
import hardDrive from "../images/hard-drive.png";
import floppyDisk from "../images/floppy-disk.png";
import signOut from "../images/sign-out.png";
import share from "../images/share.png";

const Menubar = ({
  createGrid,
  setCurrentColor,
  handleUndo,
  handleRedo,
  handleSave,
  handleLoad,
  handleDownload,
  handleEraserClick,
  handleLogout,
  loggedIn,
  handleGalleryClick,
  handleHomeClick,
  handleTrashClick,
  handleTwitterShare,
}) => {
  return (
    <header id="menuBarHeader">
      <nav id="menuBarNav">
        <img src={logo} alt="Logo" id="navbarLogo" />
        <div className="buttonContainer">
          <div className="tooltip">
            <img src={home} alt="Home" id="homeGrid" onClick={handleHomeClick} />
            <span className="tooltiptext">Home</span>
          </div>
          <div className="tooltip">
            <img src={gallery} alt="Gallery" id="galleryGrid" onClick={handleGalleryClick} />
            <span className="tooltiptext">Gallery</span>
          </div>
          <div className="tooltip">
            <img src={trash} alt="Reset" id="resetGrid" onClick={handleTrashClick} />
            <span className="tooltiptext">Trash</span>
          </div>
          <div className="tooltip">
            <img src={eraser} alt="Eraser" id="eraserGrid" onClick={handleEraserClick} />
            <span className="tooltiptext">Eraser</span>
          </div>
          <div className="tooltip">
            <img src={unDo} alt="Reset" id="undoGrid" onClick={handleUndo} />
            <span className="tooltiptext">Undo</span>
          </div>
          <div className="tooltip">
            <img src={reDo} alt="Reset" id="redoGrid" onClick={handleRedo} />
            <span className="tooltiptext">Redo</span>
          </div>
          <div className="tooltip">
            <img src={hardDrive} alt="Save" id="saveGrid" onClick={handleSave} />
            <span className="tooltiptext">Save</span>
          </div>
          <div className="tooltip">
            <img src={floppyDisk} alt="Save" id="loadGrid" onClick={handleLoad} />
            <span className="tooltiptext-load">Load</span>
          </div>
          <div className="tooltip">
            <img src={download} alt="Download" id="downloadGrid" onClick={handleDownload} />
            <span className="tooltiptext-load">Download</span>
          </div>
          <div className="tooltip">
            <img src={share} alt="Share" id="shareGrid" onClick={handleTwitterShare} />
            <span className="tooltiptext-load">Share</span>
          </div>
          <div className="tooltip">
            {loggedIn ? (
              <img src={signOut} alt="Sign Out" id="signOutGrid" onClick={handleLogout} />
            ) : (
              <NavLink to="/login">
                <img src={signIn} alt="Sign In" id="signInGrid" />
              </NavLink>
            )}
            <span className="tooltiptext-load">{loggedIn ? "Sign Out" : "Sign In"}</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Menubar;
