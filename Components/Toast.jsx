import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Toast = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      default:
        return styles.default;
    }
  };

  if (!visible) return null;

  return (
    <View style={[styles.toastContainer, getToastStyle()]}>
      <Text style={[styles.message, getToastStyle()]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 20,
    borderRadius: 5,
    margin: 10,
    position: "absolute",
    bottom: 60,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    fontSize: 14,
  },
  success: {
    backgroundColor: "#FFFFFF",
    color: "#368a0c",
  },
  error: {
    backgroundColor: "#F44336",
    color: "#FFFFFF",
  },
  default: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
  },
});

export default Toast;
