const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const https = require("https");
const helmet = require("helmet");
const activityLogger = require("./middleware/activityLogger");

dotenv.config();
connectDB();

const key = fs.readFileSync("./ssl/key.pem");
const cert = fs.readFileSync("./ssl/cert.pem");

const app = express();
app.use(
  cors({
    origin: "https://192.168.1.75:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  })
);

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

app.use(activityLogger);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/userRoutes"));

app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.get("/", (req, res) => {
  res.send("Donation API Running ✅");
});

const PORT = process.env.PORT || 8000;
https.createServer({ key, cert }, app).listen(PORT, "0.0.0.0", () => {
  console.log("HTTPS server running on https://192.168.1.75:8000");
});
