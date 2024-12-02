import express from "express";
import http from "http";
import compression from "compression";
import cookieParser from "cookie-parser";
import "dotenv/config";
import "./dbConnection.js";
import userRoutes from "./Routes/UserRoute.js";
import addressRoutes from "./Routes/AddressRoute.js";
import categoryRoutes from "./Routes/CategoryRoute.js"
import QualificationRoute from "./Routes/QualificationRoute.js"
import SourceRoute from "./Routes/SourceRoute.js"
import { connectToMongo } from "./dbConnection.js";
import TestimonialRoute from "./Routes/TestimonialRoute.js"
// import userRoutes from "./Routes/UserRoute.js";
import documentRoutes from "./Routes/DocumentRoute.js";
import occupationRoutes from "./Routes/OccupationRoute.js";
import queryRoutes from "./Routes/QueryRoute.js";
import cors from "cors";
import path from "path"
import paymentRoutes from "./Routes/PaymentHistoryRoute.js";
import mediaRoutes from "./Routes/MediaRoute.js";
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define a function to determine the allowed origin dynamically
const AllowedOrigin = (origin, callback) => {
  // Check if the origin is one of the allowed origins
  const allowedOrigins = [
    "https://admin.knoone.com",
    "https://acc.knoone.com",
    "https://knoone.com",
    "http://localhost:3000",
    "http://localhost:5500",
    "http://localhost:3001",
    "http://192.168.0.243:3000",
    "http://192.168.0.193:3000",
    "http://192.168.0.193:3001",
    "http://192.168.0.150:3000",
    "http://192.168.1.7:3000",
  ];
  const isAllowed = allowedOrigins.includes(origin);

  // Call the callback with the result (error, isAllowed)
  callback(null, isAllowed ? origin : null);
};

// Use CORS middleware with dynamic origin determination
app.use(
  cors({
    origin: AllowedOrigin,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

// ... (rest of your middleware and routes)

app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use('/video', express.static(path.join(__dirname, 'uploads', 'video')));
app.use("/api/v1", userRoutes);
app.use("/api/v1", addressRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", QualificationRoute);
app.use("/api/v1", SourceRoute);
// app.use("/api/v1", userRoutes);
app.use("/api/v1", documentRoutes);
app.use("/api/v1", occupationRoutes);
app.use("/api/v1", queryRoutes);
app.use("/api/v1", documentRoutes);
app.use("/api/v1", occupationRoutes);
app.use("/api/v1", queryRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", addressRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", mediaRoutes);
app.use("/api/v1", TestimonialRoute);
const server = http.createServer(app);
// Set a timeout of 10 minutes (600000 milliseconds)
server.setTimeout(1000000);

(async () => {
  try {
    await server.listen(port); // Start the server
    await connectToMongo();
    console.log(`Server is running. (${port})`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
