import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server) {
    console.error("Socket server is not available");
    res.status(500).json({ error: "Socket server not available" });
    return;
  }

  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    
    try {
      const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
        cors: {
          origin: process.env.NODE_ENV === "production" 
            ? process.env.NEXT_PUBLIC_SITE_URL 
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
          methods: ["GET", "POST"],
          credentials: false
        },
        transports: ["polling", "websocket"],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        
        socket.on("disconnect", (reason) => {
          console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        });

        socket.on("error", (error) => {
          console.error(`Socket error for ${socket.id}:`, error);
        });
      });

      // Handle Socket.IO server errors
      io.engine.on("connection_error", (err) => {
        console.error("Socket.IO connection error:", err.req, err.code, err.message, err.context);
      });

      res.socket.server.io = io;
      console.log("Socket.IO server initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Socket.IO server:", error);
      res.status(500).json({ error: "Failed to initialize Socket.IO server" });
      return;
    }
  } else {
    console.log("Socket.IO server already initialized");
  }

  res.end();
};

export default ioHandler;