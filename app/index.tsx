import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { StatusIndicator } from "./components/StatusIndicator";
import { TalkButton } from "./components/TalkButton";
import { ActiveUsersList } from "./components/ActiveUsers";
import { WS_EVENTS, WS_URL, USER_ID, COLORS } from "../utils/constants";

export default function PushToTalkApp() {
  // State to track if the user is currently talking
  const [isTalking, setIsTalking] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Send a handshake message to identify the user
      ws.current?.send(
        JSON.stringify({ type: WS_EVENTS.HANDSHAKE, userId: USER_ID })
      );
    };

    ws.current.onmessage = (e) => {
      try {
        const { type, userId } = JSON.parse(e.data);

        // Update active users list based on the message type
        setActiveUsers((prev) =>
          type === WS_EVENTS.START_TALKING
            ? Array.from(new Set([...prev, userId])) // Add user if they start talking
            : prev.filter((user) => user !== userId) // Remove user if they stop talking
        );
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      // Cleanup: Close WebSocket connection when component unmounts
      ws.current?.close();
    };
  }, []);

  // Function to send WebSocket messages
  const sendWebSocketMessage = useCallback(
    (type: string) => {
      if (ws.current && isConnected && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type, userId: USER_ID }));
      } else {
        console.warn("WebSocket not connected. Message not sent.");
      }
    },
    [isConnected]
  );

  return (
    <View style={styles.container}>
      {/* Display the number of active users */}
      <StatusIndicator activeUsers={activeUsers.length} />

      {/* Talk button to start/stop talking */}
      <TalkButton
        isTalking={isTalking}
        sendWebSocketMessage={sendWebSocketMessage}
        setIsTalking={setIsTalking}
      />

      {/* List of currently active users */}
      <ActiveUsersList activeUsers={activeUsers} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 40,
  },
});
