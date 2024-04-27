import subprocess
import os

# Path to the backend directory
backend_dir = os.path.join("backend", "miniplace")

# Path to the frontend directory
frontend_dir = os.path.join("frontend", "miniplace")

# Command to start the backend server using PM2
backend_command = ["pm2", "start", "app.js"]

# Command to build the frontend
build_command = ["npm", "run", "build"]

# Command to serve the frontend using serve package
serve_command = ["serve", "-s", "build"]

# Set the NODE_ENV environment variable to "production"
os.environ["NODE_ENV"] = "production"

# Change to the backend directory and start the server using PM2
os.chdir(backend_dir)
subprocess.run(backend_command, check=True)

# Change to the frontend directory
os.chdir(os.path.join("..", "..", frontend_dir))

# Build the React app
subprocess.run(build_command, check=True)

# Serve the built React app using the serve package
frontend_process = subprocess.Popen(serve_command)

# Wait for the frontend process to finish
frontend_process.wait()
