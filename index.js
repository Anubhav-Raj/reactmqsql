const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "8877",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Route to update a task
app.post("/tasks/:taskId", async (req, res) => {
  try {
    // console.log(req.params);
    // console.log(req.body);
    const { taskId } = req.params;
    const { data } = req.body;

    const updated = await updateTask(taskId, data);
    if (updated) {
      res.status(200).json({ message: "Task updated successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to update a task
const updateTask = (id, newData1) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE my_table SET value = ? WHERE id = ?";
    pool.execute(query, [newData1, id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.affectedRows > 0);
      }
    });
  });
};

// Route to fetch all data from the table
app.get("/alltasks", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to get all tasks from the table
const getAllTasks = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM my_table";
    pool.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
