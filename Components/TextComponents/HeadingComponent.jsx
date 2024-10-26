import React from "react";
import { Text, StyleSheet } from "react-native";

const HeadingComponent = ({ headingText }) => {
  return <Text style={styles.title}>{headingText}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#740000",
    textAlign: "center",
    fontFamily: "gothambold",
  },
});

export default HeadingComponent;
