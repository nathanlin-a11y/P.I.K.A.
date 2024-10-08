import subprocess
import os
import sys

def run_command(command, error_message):
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {error_message}")
        print(f"Command '{command}' failed with exit status {e.returncode}")
        sys.exit(1)

def main():
    # Change to the directory containing the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("Updating P.I.K.A....")

    # Pull latest changes from the repository
    print("Pulling latest changes from the repository...")
    run_command("git pull", "Failed to pull latest changes from the repository.")

    # Rebuild Docker images
    print("Rebuilding Docker images...")
    run_command("docker-compose build --no-cache", "Failed to rebuild Docker images.")

    # Run the run.py script
    print("Starting P.I.K.A....")
    run_command("python run.py", "Failed to start P.I.K.A..")

if __name__ == "__main__":
    main()