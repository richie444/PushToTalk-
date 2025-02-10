import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function UsersScreen() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const backgroundColor = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2E2E2E", "#3E3E3E"], // Shimmer effect
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Users History</Text>
      <View style={styles.suspenseContainer}>
        {[...Array(5)].map((_, index) => (
          <Animated.View key={index} style={[styles.suspenseLine, { backgroundColor }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", 
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "gray",
    fontSize: 18,
    marginBottom: 20,
  },
  suspenseContainer: {
    width: "90%",
  },
  suspenseLine: {
    height: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
});
