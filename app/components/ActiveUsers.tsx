import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { COLORS } from "../../utils/constants";

export const ActiveUsersList = ({ activeUsers }: { activeUsers: string[] }) => (
  <View style={styles.listContainer}>
    <Text style={styles.listHeading}>Active Users</Text>
    <FlatList
      data={activeUsers}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View style={styles.userItem}>
          <View style={styles.userIndicator} />
          <Text style={styles.userId}>{item}</Text>
        </View>
      )}
    />
  </View>
);


const styles = StyleSheet.create({
  listContainer: {
    height: 200,
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 16,
  },
  listHeading: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: "#3E3E3E",
  },
  userIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.active,
    marginRight: 12,
  },
  userId: { color: COLORS.text, fontSize: 14, fontWeight: "500" },
});
