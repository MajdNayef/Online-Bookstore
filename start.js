const { spawn } = require("child_process");
const http = require("http");

const backendPort = 5000; // Replace with your backend port

// Function to check if the backend is ready
const waitForBackend = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      http.get(`http://localhost:${backendPort}`, () => {
        clearInterval(interval);
        resolve();
      }).on("error", () => {
        // Backend not ready yet
      });
    }, 1000);
  });
};

// Start the backend
const backend = spawn("npm", ["run", "start:backend"], { stdio: "inherit" });

// Wait for the backend to be ready, then start the frontend
backend.on("spawn", async () => {
  console.log("Waiting for backend to start...");
  await waitForBackend();
  console.log("Backend is ready. Starting frontend...");
  spawn("npm", ["run", "start:frontend"], { stdio: "inherit" });
});
