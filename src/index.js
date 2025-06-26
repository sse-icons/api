const express = require("express");
const { notFound } = require("./middleware/notfound.js");
const { errorHandler } = require("./middleware/error.js");
const { PORT } = require("./utils/env.js");
const connectDB = require("./utils/connect.js");
const rateLimit = require("express-rate-limit");
const iconsRouter = require("./router/icons.js");

// Use
const app = express();
const limiter = rateLimit({
  window: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Use apps
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// use routes
app.use("/api/icons", iconsRouter);

// Middleware for handling 404 Not Found errors
app.use(notFound);
app.use(errorHandler);
app.use(limiter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
