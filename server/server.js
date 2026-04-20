const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { setIO } = require('./utils/socket');
const connectDB = require('./config/database');
const app = require('./app');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.io to HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log("✅ User connected: " + socket.id);

  socket.on('disconnect', (reason) => {
    console.log("❌ User disconnected: " + socket.id + " (" + reason + ")");
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
  console.log("🔌 Socket.io ready for connections");
});

// Make io available to controllers
setIO(io);