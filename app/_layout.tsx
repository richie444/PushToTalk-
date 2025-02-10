import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" /> 
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "gray",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#1E1E1E" }, 
          headerStyle: { backgroundColor: "#1E1E1E" }, 
          headerTintColor: "white", 
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Users List",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
