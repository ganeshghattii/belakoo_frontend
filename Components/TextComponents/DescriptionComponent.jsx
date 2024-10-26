import React from "react";
import { Text, StyleSheet } from "react-native";

const DescriptionComponent = ({ descriptionText, style }) => {
  return <Text style={[styles.description, style]}>{descriptionText}</Text>;
};

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    color: "#740000",
    fontWeight: "400",
    fontFamily: "gothambold",
  },
});

export default DescriptionComponent;
