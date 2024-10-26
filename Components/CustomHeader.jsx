// CustomHeader.js
import React from "react";
import { useRouter, usePathname, useLocalSearchParams } from "expo-router";
import Breadcrumbs from "./BreadCrumbs";
import { View, StyleSheet, Image } from "react-native";

const CustomHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  console.log("CustomHeader - Current params:", params);
  console.log("CustomHeader - Current pathname:", pathname);

  const getBreadcrumbItems = () => {
    const items = [{ key: "campus", label: "Campus", route: "/campus" }];

    if (
      pathname === "/subjects" ||
      pathname === "/grades" ||
      pathname === "/chapters"
    ) {
      items.push({
        key: "subjects",
        label: "Subjects",
        route: {
          pathname: "/subjects",
          params: { campusId: params.campusId },
        },
      });
    }

    if (pathname === "/grades" || pathname === "/chapters") {
      items.push({
        key: "grades",
        label: "Grades",
        route: {
          pathname: "/grades",
          params: {
            campusId: params.campusId,
            subjectId: params.subjectId,
            subjectName: params.subjectName,
          },
        },
      });
    }

    if (pathname === "/chapters") {
      items.push({
        key: "chapters",
        label: "Chapters",
        route: {
          pathname: "/chapters",
          params: {
            campusId: params.campusId,
            subjectId: params.subjectId,
            subjectName: params.subjectName,
            gradeId: params.gradeId,
            gradeName: params.gradeName,
          },
        },
      });
    }

    return items;
  };

  return (
    <View style={styles.header}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Breadcrumbs items={getBreadcrumbItems()} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
  },
  logo: {
    marginRight: 10,
  },
});

export default CustomHeader;
