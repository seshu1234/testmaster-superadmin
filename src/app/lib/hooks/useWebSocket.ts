import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
      path: "/ws/admin",
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("message", (data) => {
      setLastMessage(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribe = (channel: string, callback?: (data: any) => void) => {
    if (!socket) return;
    
    socket.on(channel, (data) => {
      if (callback) {
        callback(data);
      } else {
        setLastMessage(data);
      }
    });
    
    socket.emit("subscribe", { channel });
  };

  const unsubscribe = (channel: string) => {
    if (!socket) return;
    socket.off(channel);
    socket.emit("unsubscribe", { channel });
  };

  const emit = (event: string, data: any) => {
    if (!socket) return;
    socket.emit(event, data);
  };

  return {
    socket,
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    emit
  };
}
