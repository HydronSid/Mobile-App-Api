const dotenv = require("dotenv");
const mongoose = require("mongoose");
console.log(
  "🧪 Chrome Executable Path:",
  require("puppeteer").executablePath()
);

// Load env variables from config.env
dotenv.config({ path: "./config.env" });

// Import your Express app
const app = require("./app");

// Declare server with let so we can assign it later
let server;

// Handle uncaught exceptions (e.g. undefined variables)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  // replace;

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the server only after DB connection is successful
    const port = process.env.PORT || 3000;
    server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections (e.g. failed DB connection)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
