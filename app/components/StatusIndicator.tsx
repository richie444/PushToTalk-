import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../utils/constants";

export const StatusIndicator = ({ activeUsers }: { activeUsers: number }) => (
  <View style={styles.statusContainer}>
    <Text style={styles.statusText}>
      {activeUsers} {activeUsers === 1 ? "Person" : "People"} Talking
    </Text>
    <View style={styles.activeDot} />
  </View>
);

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 24,
    borderRadius: 16,
    marginTop: 24,
  },
  statusText: {
    color: COLORS.active,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.active,
  },
});
