import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { COLORS, WS_EVENTS } from "../../utils/constants";

// TalkButton component: Handles the push-to-talk functionality with animations
export const TalkButton = ({ isTalking, sendWebSocketMessage, setIsTalking }: any) => {
  // Animated values for button scaling and pulse effect
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Function to start the pulsing animation
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

  // Function to handle press-in event (start talking)
  const handlePressIn = () => {
    // Shrink button slightly for a press effect
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    // Start pulsing animation
    startPulse();

    // Update state and send WebSocket message
    setIsTalking(true);
    sendWebSocketMessage(WS_EVENTS.START_TALKING);
  };

  // Function to handle press-out event (stop talking)
  const handlePressOut = () => {
    // Restore button to original size
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

    // Stop the pulsing animation
    pulseAnim.stopAnimation();

    // Update state and send WebSocket message
    setIsTalking(false);
    sendWebSocketMessage(WS_EVENTS.STOP_TALKING);
  };

  return (
    <View style={styles.buttonContainer}>
      {/* Animated pulse effect around the button */}
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5], // Expanding effect
                }),
              },
            ],
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 0], // Fade-out effect
            }),
          },
        ]}
      />

      {/* Animated button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.button, isTalking && styles.buttonActive]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8} // Reduces the opacity when pressed
        >
          <Text style={styles.buttonText}>
            {isTalking ? "Speaking..." : "Hold to Talk"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Styles for the button and animations
const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 32,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#3E3E3E",
  },
  buttonActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: "#FF6B81" 
  },
  buttonText: { 
    color: COLORS.text, 
    fontSize: 20, 
    fontWeight: "600" 
  },
  pulse: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
});
