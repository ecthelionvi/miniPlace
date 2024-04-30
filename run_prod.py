import subprocess
import os
import signal
import psutil
import sys
from halo import Halo

os.environ["NODE_ENV"] = "production"

build_command = ["npm", "run", "build"]
serve_command = ["serve", "-s", "build"]
backend_command = ["pm2", "start", "app.js"]

backend_dir = os.path.join("backend", "miniplace")
frontend_dir = os.path.join("frontend", "miniplace")


def clear_screen():
    print("\033[2J\033[H", end="")


def handle_keyboard_interrupt(signal, frame):
    stop_processes()
    clear_screen()
    sys.exit(0)


def stop_processes():
    for proc in psutil.process_iter(["pid", "name"]):
        if proc.info["name"] == "serve":
            proc.send_signal(signal.SIGINT)
            proc.wait()

    # Stop the backend server using PM2 with force flag and suppress output
    subprocess.run(
        ["pm2", "stop", "app", "--force"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # Kill the PM2 daemon and suppress output
    subprocess.run(
        ["pm2", "kill"],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


signal.signal(signal.SIGINT, handle_keyboard_interrupt)

os.chdir(backend_dir)
subprocess.run(
    backend_command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)

os.chdir(os.path.join("..", "..", frontend_dir))
subprocess.run(
    build_command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)

clear_screen()

spinner = Halo(text="Server Running: http://localhost:3000", spinner="dots")
spinner.start()

subprocess.Popen(serve_command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

signal.pause()
