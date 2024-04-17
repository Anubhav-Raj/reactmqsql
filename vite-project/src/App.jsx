import React, { useState, useEffect } from "react";
import axios from "axios";

// Left arrow SVG icon
const LeftArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M14 7l-5 5 5 5V7z" />
    <path fill="none" d="M24 0v24H0V0h24z" />
  </svg>
);

// Right arrow SVG icon
const RightArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M10 17l5-5-5-5v10z" />
    <path fill="none" d="M0 24V0h24v24H0z" />
  </svg>
);

const VirtualKeyboard = ({ inputValue, setInputValue, handleSave, handleClose }) => {
  const handleClick = (char) => {
    setInputValue((prevValue) => prevValue + char);
  };

  const handleDelete = () => {
    setInputValue((prevValue) => prevValue.substring(1)); // Remove characters from the beginning
  };

  const handleBackspace = () => {
    setInputValue((prevValue) => prevValue.substring(0, prevValue.length - 1));
  };

  const handleMoveCursorLeft = () => {
    const input = document.getElementById("inputField");
    if (input) {
      input.focus();
      if (input.selectionStart > 0) {
        input.setSelectionRange(input.selectionStart - 1, input.selectionStart - 1);
      }
    }
  };
  
  const handleMoveCursorRight = () => {
    const input = document.getElementById("inputField");
    if (input) {
      input.focus();
      if (input.selectionStart < input.value.length) {
        input.setSelectionRange(input.selectionStart + 1, input.selectionStart + 1);
      }
    }
  };

  // Add event listener for keydown event
  document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        handleEscape();
    }
  });
  
  

  const handleEnter = () => {
    handleSave();
  };

  const handleEscape = () => {
    console.log("Escape button clicked");
    handleClose(); // Call the handleClose function to close the virtual keyboard or any other component
};


  return (
    <div
      className="keyboard" // Apply the "keyboard" class for the container
      style={{
        position: "absolute",
        bottom: "-190px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        zIndex: "999",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "5px",
        maxWidth: "150px",
        margin: "0 auto",
      }}
    >
      <button className="key" onClick={() => handleClick("1")}>1</button>
      <button className="key" onClick={() => handleClick("2")}>2</button>
      <button className="key" onClick={() => handleClick("3")}>3</button>
      <button className="key" onClick={() => handleClick("4")}>4</button>
      <button className="key" onClick={() => handleClick("5")}>5</button>
      <button className="key" onClick={() => handleClick("6")}>6</button>
      <button className="key" onClick={() => handleClick("7")}>7</button>
      <button className="key" onClick={() => handleClick("8")}>8</button>
      <button className="key" onClick={() => handleClick("9")}>9</button>
      <button className="key" onClick={() => handleClick("0")}>0</button>
      <button className="key" onClick={handleDelete}>Del</button>
      <button className="key" onClick={handleBackspace}>BS</button>
      <button className="arrow" onClick={handleMoveCursorLeft}>
        <LeftArrowIcon />
      </button>
      <button className="arrow" onClick={handleMoveCursorRight}>
        <RightArrowIcon />
      </button>
      <button className="key" onClick={handleEnter}>Enter</button>
      <button className="key" onClick={handleEscape}>ESC</button> 
      <button className="key" onClick={() => setInputValue("")}>Clear</button>
    </div>
  );
};

const Box = ({ initialValue, onSave, id }) => {
  const [number, setNumber] = useState(initialValue);
  const [inputValue, setInputValue] = useState("");
  const [isInputVisible, setInputVisible] = useState(false);

  const handleClick = () => {
    setInputVisible(true);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    onSave(inputValue, id, setInputVisible); // Pass setInputVisible to onSave function
    setNumber(inputValue);
    setInputVisible(false); // Hide the input after saving
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleCloseKeyboard = () => {
    setInputVisible(false); // Close the virtual keyboard
};

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        width: "200px",
        height: "200px",
        margin: "10px",
        padding: "10px",
        background: "#f9f9f9",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <div style={{ textAlign: "center" }}>
        Num: {isInputVisible === false ? number : null}
      </div>
      {isInputVisible && (
        <div style={{ marginTop: "10px", position: "relative" }}>
      <input
        id="inputField"
        type="text"
        value={inputValue}
        onChange={handleChange}
        onClick={(e) => e.target.select()} // Select all text when clicked
        onKeyDown={handleKeyDown}
        style={{
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          width: "50px",
          marginRight: "5px",
        }}
      />
          <button
            onClick={handleSave}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      )}
      {isInputVisible && (
        <VirtualKeyboard
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSave={handleSave} // Pass handleSave to VirtualKeyboard
          handleClose={handleCloseKeyboard} // Pass handleClose to VirtualKeyboard
        />
      )}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]); // State to hold the fetched data

  useEffect(() => {
    // Fetch the data when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/alltasks");
      setData(response.data); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveToDatabase = async (value, id, setInputVisible) => {
    console.log("Saving to database:", value);
    try {
      await axios.post(`http://localhost:3000/tasks/${id}`, {
        data: value,
      });
      console.log("Data updated successfully.");
      // Hide the input box and the "Save" button after updating data
      setInputVisible(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 100px)",
        gridTemplateRows: "repeat(3, 200px)",
        gap: "400px",
        gridTemplateAreas: `
          "a a b"
          "a a b"
          "c d d"`,
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Map over the data array and render a Box component for each item */}
      {data.map((item) => (
        <Box
          key={item.id}
          initialValue={item.value} // Set the initial value of the box to the fetched value
          onSave={saveToDatabase}
          id={item.id}
        />
      ))}
    </div>
  );
};

export default App;
