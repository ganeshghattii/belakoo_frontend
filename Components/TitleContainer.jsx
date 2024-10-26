import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HeadingComponent from "./TextComponents/HeadingComponent";
import DescriptionComponent from "./TextComponents/DescriptionComponent";

const TitleContainer = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <HeadingComponent headingText={title}/>
      <DescriptionComponent descriptionText={subtitle}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    marginTop: 10,
    rowGap: 6,
    columnGap: 6
  }
});

export default TitleContainer;
