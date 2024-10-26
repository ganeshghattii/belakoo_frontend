import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

const Breadcrumbs = ({ items }) => {
  const router = useRouter();

  const handleNavigation = (route) => {
    console.log("Navigating to:", route);
    if (typeof route === 'string') {
      router.push(route);
    } else {
      router.push({
        pathname: route.pathname,
        params: route.params
      });
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          <TouchableOpacity onPress={() => handleNavigation(item.route)}>
            <Text style={styles.text}>{item.label}</Text>
          </TouchableOpacity>
          {index < items.length - 1 && <Text style={styles.separator}> {'>'} </Text>}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft:55
  },
  text: {
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 12, 
    color: '#740000',
    textTransform: 'uppercase',
  },
  separator: {
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 12, 
    color: '#740000',
  },
});

export default Breadcrumbs;
