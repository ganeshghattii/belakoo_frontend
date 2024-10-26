import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";

import { useEffect } from "react";

import { Text } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { ActivityIndicator } from "react-native";

import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import Toast from "react-native-toast-message";
import api from "../services/api";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ScrollView } from "react-native";

const Lesson = () => {
  const router = useRouter();

  const { lessonCode, lessonName } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [lessonData, setLessonData] = useState();

  useEffect(() => {
    fetchLessonDetails();
  }, []);

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(
        `https://belakoo-backend.onrender.com/api/lessons/${lessonCode}/`
      );
      setLessonData(response.data);
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
        <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
        <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Belakube Lesson Plan
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#740000"
            style={styles.loader}
          />
        ) : (
          <View className="h-screen pt-4 pb-20 px-4 ">
            <View className="gap-4">
              <Text className="text-xl font-bold">
                Lesson Code :{" "}
                <Text className="text-[#F56E00]">{lessonCode}</Text>
              </Text>
              <Text className="text-xl font-bold pb-4">
                Subject :{" "}
                <Text className="text-[#F56E00]">{lessonData?.name}</Text>
              </Text>
            </View>
            <ScrollView
              className=" space-y-3 h-full "
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Objective
                </Text>
                <Text className="text-lg font-medium">
                  {lessonData?.objective}
                </Text>
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Duration
                </Text>
                <Text className="text-lg font-medium">
                  {lessonData?.duration}
                </Text>
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Specific Learning Outcome
                </Text>
                <Text className="text-lg font-medium">
                  {lessonData?.specific_learning_outcome}
                </Text>
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Behavioural Outcome
                </Text>
                <Text className="text-lg font-medium">
                  {lessonData?.behavioural_outcome}
                </Text>
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Materials Required
                </Text>
                <Text className="text-lg font-medium">
                  {lessonData?.materials_required}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/principle",
                    params: {
                      lessonCode: lessonCode,
                      lessonName: lessonName,
                    },
                  })
                }
                className="bg-[#F56E00] py-2 mx-10 flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Next</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Lesson;
