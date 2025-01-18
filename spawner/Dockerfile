# Use a Node.js base image
FROM node:18-buster

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip 

# Install Chrome version 13
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install

# Install Chromedriver version 13
RUN wget -q https://chromedriver.storage.googleapis.com/13.0.782.215/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip -d /usr/local/bin && \
    rm chromedriver_linux64.zip

# Set the working directory
WORKDIR /app

# Copy the application files
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Set executable permissions for shell scripts
RUN chmod +x ./start_MTX_docker.sh ./start_ffmpeg.sh

# Run the application
CMD ["node", "dist/index.js"]
