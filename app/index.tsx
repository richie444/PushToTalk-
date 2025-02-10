import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { StatusIndicator } from "./components/StatusIndicator";
import { TalkButton } from "./components/TalkButton";
import { ActiveUsersList } from "./components/ActiveUsers";
import { WS_EVENTS, WS_URL, USER_ID, COLORS } from "../utils/constants";

export default function PushToTalkApp() {
  const [isTalking, setIsTalking] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false); // Track WebSocket state
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      ws.current?.send(JSON.stringify({ type: WS_EVENTS.HANDSHAKE, userId: USER_ID }));
    };

    ws.current.onmessage = (e) => {
      try {
        const { type, userId } = JSON.parse(e.data);
        setActiveUsers((prev) =>
          type === WS_EVENTS.START_TALKING
            ? Array.from(new Set([...prev, userId]))
            : prev.filter((user) => user !== userId)
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
      ws.current?.close();
    };
  }, []);

  const sendWebSocketMessage = useCallback((type: string) => {
    if (ws.current && isConnected && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, userId: USER_ID }));
    } else {
      console.warn("WebSocket not connected. Message not sent.");
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <StatusIndicator activeUsers={activeUsers.length} />
      <TalkButton
        isTalking={isTalking}
        sendWebSocketMessage={sendWebSocketMessage}
        setIsTalking={setIsTalking}
      />
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
