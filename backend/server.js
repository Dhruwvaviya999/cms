import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import router from "./routes/v1/index.routes.js";
import { configDotenv } from "dotenv";
configDotenv();
const app = express();


const PORT = process.env.PORT;
connectDB();

app.use(cors());
// parse json
app.use(express.json());

app.use("/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to the application");
});

// 404 handler - should be after all routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
