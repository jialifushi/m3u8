# Step 1: Use a Node.js runtime as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all other application files into the container
# This includes your original index.html, the new server.js, and login.html
COPY . .

# Step 6: Expose the port the app runs on
EXPOSE 80

# Step 7: Define the command to run the application
CMD ["node", "server.js"]