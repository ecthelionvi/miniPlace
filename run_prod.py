import subprocess
import os
import signal
import sys

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


def clear_screen():
    print("\033[2J\033[H", end="")


# Function to handle the keyboard interrupt (Ctrl+C)
def handle_keyboard_interrupt(signal, frame):
    stop_processes()
    clear_screen()
    sys.exit(0)


# Function to stop the PM2 and serve processes
def stop_processes():
    # Stop the backend server using PM2
    subprocess.run(["pm2", "stop", "app"], check=True)

    # Stop the frontend server (serve) by terminating the process
    if frontend_process.poll() is None:
        frontend_process.terminate()
        frontend_process.wait()


# Register the keyboard interrupt handler
signal.signal(signal.SIGINT, handle_keyboard_interrupt)

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
