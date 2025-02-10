import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, FlatList } from 'react-native';

const WS_URL = 'ws://pushtotalk-7xur.onrender.com/';
const USER_ID = `user_${Math.floor(Math.random() * 1000)}`;
const COLORS = {
  primary: '#FF4757',
  secondary: '#2E2E2E',
  background: '#1A1A1A',
  text: '#FFFFFF',
  active: '#00FF9D',
};

export default function PushToTalkApp() {
  const [isTalking, setIsTalking] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);
  
  // Animations
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ type: 'handshake', userId: USER_ID }));
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setActiveUsers(prev => {
          const newUsers = data.type === 'start_talking' 
            ? [...prev, data.userId]
            : prev.filter(user => user !== data.userId);
          return Array.from(new Set(newUsers));
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => ws.current?.close();
  }, []);

  const startPulse = () => {
    pulseAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
    startPulse();
    setIsTalking(true);
    ws.current?.send(JSON.stringify({ type: 'start_talking', userId: USER_ID }));
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
    pulseAnim.stopAnimation();
    setIsTalking(false);
    ws.current?.send(JSON.stringify({ type: 'stop_talking', userId: USER_ID }));
  };

  const pulseInterpolation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.statusContainer, { opacity: listOpacity }]}>
        <Text style={styles.statusText}>
          {activeUsers.length} {activeUsers.length === 1 ? 'Person' : 'People'} Talking
        </Text>
        <View style={styles.activeDot} />
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseInterpolation }],
              opacity: pulseOpacity,
            },
          ]}
        />
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.button, isTalking && styles.buttonActive]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isTalking ? 'Speaking...' : 'Hold to Talk'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View style={[styles.listContainer, { opacity: listOpacity }]}>
        <FlatList
          data={activeUsers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userIndicator} />
              <Text style={styles.userId}>{item}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 24,
    borderRadius: 16,
    marginTop: 24,
  },
  statusText: {
    color: COLORS.active,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.active,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 32,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3E3E3E',
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#FF6B81',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  listContainer: {
    height: 200,
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#3E3E3E',
  },
  userIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.active,
    marginRight: 12,
  },
  userId: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
});