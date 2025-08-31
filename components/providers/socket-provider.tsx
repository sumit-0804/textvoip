"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { Socket, io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null,
});

export const useSocket = (): SocketContextType => {
    return useContext(SocketContext);
};

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsConnecting(true);
        setError(null);

        const socketUrl = process.env.NODE_ENV === 'production' 
            ? process.env.NEXT_PUBLIC_SITE_URL! 
            : "http://localhost:3000"!;

        const socketInstance: Socket = ClientIO(socketUrl, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            transports: process.env.NODE_ENV === 'development' 
                ? ["polling"] // Polling only in development to avoid upgrade errors
                : ["polling", "websocket"], // Allow both in production
            upgrade: process.env.NODE_ENV !== 'development', // Only upgrade in production
            rememberUpgrade: false,
            timeout: 20000,
            forceNew: true,
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            console.log("Socket connected:", socketInstance.id);
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);
        });

        socketInstance.on("disconnect", (reason: string) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
            setIsConnecting(false);
        });

        socketInstance.on("connect_error", (err: Error) => {
            console.error("Socket connection error:", err);
            setError(err.message);
            setIsConnecting(false);
            setIsConnected(false);
        });

        socketInstance.on("reconnect", (attemptNumber: number) => {
            console.log("Socket reconnected after", attemptNumber, "attempts");
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);
        });

        socketInstance.on("reconnect_error", (err: Error) => {
            console.error("Socket reconnection error:", err);
            setError(err.message);
        });

        // Handle transport events for debugging
        socketInstance.on("upgrade", () => {
            console.log("Upgraded to transport:", socketInstance.io.engine.transport.name);
        });

        socketInstance.on("upgradeError", (err: Error) => {
            console.warn("Socket upgrade failed:", err.message, "- continuing with polling");
            // This is fine - polling will continue to work
        });

        setSocket(socketInstance);

        return () => {
            console.log("Cleaning up socket connection");
            socketInstance.disconnect();
            setSocket(null);
            setIsConnected(false);
            setIsConnecting(false);
            setError(null);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ 
            socket, 
            isConnected, 
            isConnecting, 
            error 
        }}>
            {children}
        </SocketContext.Provider>
    );
};