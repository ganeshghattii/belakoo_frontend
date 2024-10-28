import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

import { AntDesign } from "@expo/vector-icons";

import api from "../services/api";
import { useLocalSearchParams } from "expo-router";

import { ActivityIndicator } from "react-native";

const Acquire = () => {
  const router = useRouter();

  const [acquireData, setAcquireData] = useState();
  const { lessonCode, lessonName } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLessonDetails();
  }, []);

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(
        `https://belakoo-backend-02sy.onrender.com/api/lessons/${lessonCode}/`
      );
      console.log(response.data);
      setAcquireData(response.data.acquire);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      console.log(lessonCode);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load chapters. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="">
        <ImageBackground
          source={require("../assets/Content/bg2.png")}
          style={styles.background}
        >
          <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
          <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
          </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Acquire</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#740000"
              style={styles.loader}
            />
          ) : (
            <ScrollView className="space-y-3 mt-4 h-[89%]">
              {acquireData?.ENGAGE && (
                <View className="space-y-4 mx-4">
                  <Text className="text-[#F56E00] font-bold text-xl">
                    Engage
                  </Text>
                  <Text className="text-black font-medium text-lg">
                    {acquireData?.ENGAGE}
                  </Text>
                </View>
              )}
              {acquireData?.INFORM && (
                <View className="space-y-4 mx-4">
                  <Text className="text-[#F56E00] font-bold text-xl">
                    Inform
                  </Text>
                  <Text className="text-black font-medium text-lg">
                    {acquireData?.INFORM}
                  </Text>
                </View>
              )}
              {acquireData?.TEACH && (
                <View className="space-y-4 mx-4">
                  <Text className="text-[#F56E00] font-bold text-xl">
                    Teach
                  </Text>
                  <Text className="text-black font-medium text-lg">
                    {acquireData?.TEACH}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/apply",
                    params: {
                      lessonCode: lessonCode,
                      lessonName: lessonName,
                      activate: true,
                      acquire: true,
                      apply: true,
                    },
                  })
                }
                className="bg-[#F56E00] py-4  mx-3 flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">
                  Move to Apply
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <View></View>
        </ImageBackground>
      </View>
    </CustomSafeAreaView>
  );
};

export default Acquire;

const styles = StyleSheet.create({});
