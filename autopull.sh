#!/bin/bash

# Configuration
REMOTE_NAME="Widifirmaan.github.io"
BRANCH_NAME="springboot"

# Function to handle shutdown
cleanup() {
    echo "Stopping application..."
    if [ ! -z "$APP_PID" ]; then
        kill $APP_PID
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Checking for 'mvnw' executable permissions..."
chmod +x mvnw

echo "Starting Auto-Pull Monitor on branch $BRANCH_NAME..."

# Start the application initially
echo "Starting Spring Boot application..."
./mvnw spring-boot:run &
APP_PID=$!

while true; do
    # Check for updates every 10 seconds
    sleep 10
    
    # Fetch latest regular commits
    git fetch $REMOTE_NAME $BRANCH_NAME
    
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse $REMOTE_NAME/$BRANCH_NAME)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Updates detected on remote. Pulling changes..."
        git pull $REMOTE_NAME $BRANCH_NAME
        
        echo "Restarting application due to update..."
        if [ ! -z "$APP_PID" ]; then
            kill $APP_PID
            wait $APP_PID 2>/dev/null
        fi
        
        ./mvnw spring-boot:run &
        APP_PID=$!
    fi
done
