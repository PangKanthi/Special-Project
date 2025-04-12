import React from "react";

const SimulatedColorShutter = ({ imageUrl, selectedColor }) => {
  const containerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "black",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: selectedColor,
    mixBlendMode: "multiply",
    opacity: 0.5,
    pointerEvents: "none",
  };
  

  return (
    <div style={containerStyle}>
      <img src={imageUrl} alt="Door" style={imageStyle} />
      <div style={overlayStyle} />
    </div>
  );
};

export default SimulatedColorShutter;
