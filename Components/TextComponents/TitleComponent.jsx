import React from "react";
import { Text, StyleSheet } from "react-native";

const TitleComponent = ({ titleText }) => {
  return <Text style={styles.title}>{titleText}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F77904",
    textAlign: "center",
    fontFamily: "gothambold",
  },
});

export default TitleComponent;
