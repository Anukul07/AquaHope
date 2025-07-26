const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/campaigns", require("./routes/campaignRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("Donation API Running ✅");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT} 🚀`)
);
