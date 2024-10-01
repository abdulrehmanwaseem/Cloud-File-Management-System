import "dotenv/config";
import { app } from "./app.js";
import connectToDatabase from "./src/config/DB/dbConnection.js";

process.on("uncaughtException", (err) => {
  console.log(`Error: Uncaught Exception! Stutting down...`);
  console.log(err.name + ":", err.message + ": " + err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

// Server Listener
const server = app.listen(PORT, () => {
  connectToDatabase();
  console.log(
    `Server is running on port ${PORT} at ${process.env.NODE_ENV}Mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(`Error: Uncaught Rejection! SHutting down...`);
  console.log(err.name + ":", err.message + ": " + err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", (err) => {
  console.log(`Error: SIGTERM Recieved! Stutting Down gracefully...`);
  server.close(() => {
    console.log("Process Terminated!");
    process.exit(1);
  });
});
