import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import useStore from "../store";

import { useEffect } from "react";

import { Text } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { ActivityIndicator } from "react-native";

import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import Toast from "../Components/Toast";
import api from "../services/api";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ScrollView } from "react-native";

const Lesson = () => {
  const router = useRouter();

  const { lessonCode, lessonName, lessonId, profId, subId } =
    useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [lessonData, setLessonData] = useState();
  const [isEditing, setIsEditing] = useState();
  const [isDeleting, setIsDeleting] = useState();
  const [id, setId] = useState();

  const [objective, setObjective] = useState();
  const [duration, setDuration] = useState();
  const [outcome, setOutcome] = useState();
  const [behaviourOutcome, setBehaviourOutcome] = useState();
  const [materialRequired, setMaterialRequired] = useState();

  const { setLessonId } = useStore();

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  const handleDeleting = () => {
    setIsDeleting(true);
  };

  const handleEditing = () => {
    setIsEditing(true);
    updateLessonData();
  };

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(`/api/lessons/${lessonId}/`);
      setLessonData(response.data);
      setObjective(response.data.objective);
      setDuration(response.data.duration);
      setLessonId(lessonId);
      setOutcome(response.data.specific_learning_outcome);
      setBehaviourOutcome(response.data.behavioral_outcome);
      setMaterialRequired(response.data.materials_required);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      console.log(lessonCode);
      setIsLoading(false);
    }
  };

  const updateLessonData = async () => {
    try {
      const formData = {
        objective,
        duration,
        specific_learning_outcome: outcome,
        behavioral_outcome: behaviourOutcome,
        materials_required: materialRequired,
      };
      console.log(formData);

      const response = api.put(`admin-api/lesson/${lessonId}/`, formData);
      setIsEditing(false);
      console.log(response.data);

      console.log(formData);
      setToastType("success");
      setToastMessage("Lesson updated successfully.");
    } catch (error) {
      console.error("Error updating lesson:", error);
      setToastType("error");
      setToastMessage("Failed to update lesson. Please try again.");
      setIsLoading(false);
    }
  };

  const deleteLesson = async () => {
    try {
      const response = api.delete(`/admin-api/lesson/${lessonId}/`);
      console.log(response.data);
      router.push({
        pathname: "/chapters",
        params: {
          proficiencyId: profId,
          subjectId: subId,
        },
      });
      setToastType("success");
      setToastMessage("Lesson deleted successfully.");
    } catch (error) {
      console.error("Error deleting Lesson:", error);
      setToastType("error");
      setToastMessage("Failed to delete lesson. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetails();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="">
        <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
          <TouchableOpacity
            className="absolute left-0 ml-5"
            onPress={() => router.back()}
          >
            <Image
              source={require("../assets/arrow.png")}
              className="w-9 h-7"
            />
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
                {isEditing ? (
                  <TextInput
                    placeholder="enter your objective"
                    placeholderTextColor="#CCCCCC"
                    value={objective}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                    onChangeText={(text) => setObjective(text)}
                    multiline={true}
                    autoCapitalize="none"
                    className="bg-white text-lg p-2 rounded-xl border-[#F56E00] border-2"
                  />
                ) : (
                  <Text className="text-lg font-medium">{objective}</Text>
                )}
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Duration
                </Text>
                {isEditing ? (
                  <TextInput
                    placeholder="enter your objective"
                    placeholderTextColor="#CCCCCC"
                    value={duration}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                    onChangeText={(text) => setDuration(text)}
                    multiline={true}
                    autoCapitalize="none"
                    className="bg-white text-lg p-2 rounded-xl border-[#F56E00] border-2"
                  />
                ) : (
                  <Text className="text-lg font-medium">{duration}</Text>
                )}
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Specific Learning Outcome
                </Text>
                {isEditing ? (
                  <TextInput
                    placeholder="enter your learning outcome"
                    placeholderTextColor="#CCCCCC"
                    value={outcome}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                    onChangeText={(text) => setOutcome(text)}
                    multiline={true}
                    autoCapitalize="none"
                    className="bg-white text-lg p-2 rounded-xl border-[#F56E00] border-2"
                  />
                ) : (
                  <Text className="text-lg font-medium">{outcome}</Text>
                )}
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Behavioural Outcome
                </Text>
                {isEditing ? (
                  <TextInput
                    placeholder="enter your objective"
                    placeholderTextColor="#CCCCCC"
                    value={behaviourOutcome}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                    onChangeText={(text) => setBehaviourOutcome(text)}
                    multiline={true}
                    autoCapitalize="none"
                    className="bg-white text-lg p-2 rounded-xl border-[#F56E00] border-2"
                  />
                ) : (
                  <Text className="text-lg font-medium">
                    {behaviourOutcome}
                  </Text>
                )}
              </View>
              <View className="bg-[#FFE4CF] p-5 border border-[#FFE4CF] rounded-3xl space-y-2">
                <Text className="text-xl font-bold text-[#F56E00]">
                  Materials Required
                </Text>
                {isEditing ? (
                  <TextInput
                    placeholder="enter your objective"
                    placeholderTextColor="#CCCCCC"
                    value={materialRequired}
                    keyboardType="email-address"
                    clearButtonMode="while-editing"
                    onChangeText={(text) => setMaterialRequired(text)}
                    multiline={true}
                    autoCapitalize="none"
                    className="bg-white text-lg p-2 rounded-xl border-[#F56E00] border-2"
                  />
                ) : (
                  <Text className="text-lg font-medium">
                    {materialRequired}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/principle",
                    params: {
                      lessonCode: lessonCode,
                      lessonName: lessonName,
                      lessonId: lessonId,
                    },
                  })
                }
                className="bg-[#F56E00] py-2 mx-10  flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Next</Text>
              </TouchableOpacity>
              {isAdmin && (
                <View>
                  {isEditing ? (
                    <TouchableOpacity
                      onPress={() => handleEditing()}
                      className="bg-[#F56E00] py-2 mx-10 mb-10 flex border-[#F56E00] items-center justify-center border rounded-3xl"
                    >
                      <Text className="text-white font-bold text-xl">
                        Submit Changes
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setIsEditing(!isEditing)}
                      className="bg-[#F56E00] py-2 mx-10 mb-2 flex border-[#F56E00] items-center justify-center border rounded-3xl"
                    >
                      <Text className="text-white font-bold text-xl">Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleting()}
                    className="bg-[#F56E00] py-2 mx-10 mb-10 flex border-[#F56E00] items-center justify-center border rounded-3xl"
                  >
                    <Text className="text-white font-bold text-xl">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            {isDeleting && (
              <View className="absolute  transition ease-in h-screen w-screen flex items-center justify-center bg-black/70">
                <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
                  <Text className="font-bold text-center py-3 text-xl">
                    Are you sure you want to delete this Lesson?
                  </Text>

                  <TouchableOpacity
                    onPress={() => deleteLesson()}
                    className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
                  >
                    <Text className="text-white font-bold text-xl">Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsDeleting(!isDeleting)}
                    className="bg-white py-3 mt-4 w-full flex border-red-700  items-center justify-center border rounded-3xl"
                  >
                    <Text className="text-red-700 font-bold text-xl">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        {toastMessage && <Toast type={toastType} message={toastMessage} />}
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
