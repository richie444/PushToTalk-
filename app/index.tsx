import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const WS_URL = 'wss://jubilant-enigma-wjr4gpqv5rv359xr-8080.app.github.dev/'; // WebSocket server URL
const USER_ID = `user_${Math.floor(Math.random() * 1000)}`; // Generate a random user ID

export default function PushToTalkApp() {
  const [isTalking, setIsTalking] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      // Send a handshake message with user ID
      ws.current?.send(JSON.stringify({ type: 'handshake', userId: USER_ID }));
    };

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'start_talking') {
          setActiveUsers((prev) => [...new Set([...prev, data.userId])]);
        } else if (data.type === 'stop_talking') {
          setActiveUsers((prev) => prev.filter((user) => user !== data.userId));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (error) => console.error('WebSocket Error:', error);
    ws.current.onclose = () => console.log('WebSocket Disconnected');

    return () => {
      // Close WebSocket connection on component unmount
      ws.current?.close();
    };
  }, []);

  interface Message {
    type: 'start_talking' | 'stop_talking';
    userId: string;
  }

  const sendMessage = (msg: Message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start();
    setIsTalking(true);
    sendMessage({ type: 'start_talking', userId: USER_ID });
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    setIsTalking(false);
    sendMessage({ type: 'stop_talking', userId: USER_ID });
  };

  return (
    <View style={styles.container}>
      {/* Status Indicator */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {activeUsers.length > 0 ? `🎤 Talking: ${activeUsers.join(', ')}` : 'No one is talking'}
        </Text>
      </View>

      {/* Push-to-Talk Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.button, isTalking && styles.buttonActive]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isTalking ? 'Release to Stop' : 'Hold to Talk'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Active Users List */}
      <View style={styles.userList}>
        {activeUsers.map((user) => (
          <View key={user} style={styles.userPill}>
            <Text style={styles.userText}>🎤 {user}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2E2E2E',
    padding: 24,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3E3E3E',
  },
  buttonActive: {
    backgroundColor: '#FF4757',
    borderColor: '#FF6B81',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusBar: {
    position: 'absolute',
    top: 50,
    padding: 10,
    backgroundColor: '#2E2E2E',
    borderRadius: 20,
  },
  statusText: {
    color: '#00FF9D',
    fontSize: 14,
  },
  userList: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  userPill: {
    backgroundColor: '#3E3E3E',
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  userText: {
    color: 'white',
  },
});