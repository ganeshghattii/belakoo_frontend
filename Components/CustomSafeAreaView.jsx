import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';

const CustomSafeAreaView = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'transparent', // Set the default background color
  },
});

export default CustomSafeAreaView;