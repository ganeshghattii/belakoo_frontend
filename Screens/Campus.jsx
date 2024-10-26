import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Image
} from "react-native";

import { Text } from "react-native";

import { Link, useRouter } from "expo-router";
import CampusIconSvg from "../assets/icons/CampusIconSvg";
import DescriptionComponent from "../Components/TextComponents/DescriptionComponent";
import HeadingComponent from "../Components/TextComponents/HeadingComponent";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import CustomHeader from "../Components/CustomHeader";
import api from "../services/api";
import Toast from "react-native-toast-message";

import { AntDesign } from "@expo/vector-icons";

const Campus = () => {
  const [campuses, setCampuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const response = await api.get("/api/campuses/");
      setCampuses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load campuses. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="bg-[#F56E00]/70">
        <ImageBackground
          source={require("../assets/Content/bg2.png")}
          style={styles.background}
        >
          <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
          <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
          </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">
              Choose your Campus
            </Text>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.campusContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#740000" />
              ) : (
                <View style={styles.cardContainer}>
                  {campuses.map((campus) => (
                    <Link
                      key={campus.id}
                      href={{
                        pathname: "/subjects",
                        params: { campusId: campus.id },
                      }}
                      asChild
                    >
                      <TouchableOpacity className="bg-white rounded-xl shadow-xl border border-white px-8 py-16">
                        <Text className="text-[#F56E00] text-2xl font-bold text-center">
                          {campus.name}
                        </Text>
                        <Text className="text-[#F56E00] font-bold text-center">
                          {campus.description}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDDEBC",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "starts",
    alignItems: "center",
    paddingBottom: 60, // Adjust this value to account for the status bar and header
  },
  campusContainer: {
    width: "95%",
    paddingVertical: 44,
    borderRadius: 15,
  },
  cardContainer: {
    flexDirection: "row",
    marginTop: 0,
    justifyContent: "space-around",
    width: "100%",
  },
  campusCard: {
    width: "45%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    rowGap: 10,
    alignItems: "center",
    borderRadius: 29,
    backgroundColor: "#FFF4E6",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10.7,
    elevation: 5,
  },
});

export default Campus;
