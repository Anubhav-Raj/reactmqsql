/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

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
    // setInputVisible(false); // Removed from here
  };

  return (
    <div
      style={{
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
      <div style={{ textAlign: "center" }}>Num: {number}</div>
      {isInputVisible && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              width: "30px",
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
      console.log("inputValue", id);

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
