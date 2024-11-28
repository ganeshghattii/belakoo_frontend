import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

import { ActivityIndicator } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import useStore from "../store";

import api from "../services/api";
import { useLocalSearchParams } from "expo-router";

const Apply = () => {
  const router = useRouter();

  const [applyData, setApplyData] = useState();
  const { lessonCode, lessonName } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const { lessonId } = useStore();

  const [isEdit, setIsEdit] = useState();
  const [isCreating, setIsCreating] = useState();
  const [index, setIndex] = useState();

  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [hook, setHook] = useState();

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(`/api/lessons/${lessonId}/`);
      console.log(response.data);

      const parsedData = JSON.parse(response.data.apply);
      setApplyData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      console.log(lessonId);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load chapters. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const createField = () => {
    const formData = { title, desc };

    const updatedData = [...(applyData || []), formData];

    const finalData = { apply: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
      setIsCreating(!isCreating);
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const deleteField = (index) => {
    const updatedData = [...applyData];
    updatedData.splice(index, 1);
    setApplyData(updatedData);

    const finalData = { apply: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const handleEditing = (index) => {
    setIsEdit(true);
    setIndex(index);
    startEditing(index);
  };

  const startEditing = (index) => {
    setEditTitle(applyData[index].title);
    setEditDesc(applyData[index].desc);
  };

  const saveEdit = (index) => {
    const updatedData = [...applyData];
    updatedData[index] = {
      ...updatedData[index],
      title: editTitle,
      desc: editDesc,
    };
    const finalData = { apply: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
    }

    setIsEdit(false);
  };

  useEffect(() => {
    fetchLessonDetails();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="">
        <ImageBackground
          source={require("../assets/Content/bg2.png")}
          style={styles.background}
        >
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
            <Text className="text-2xl font-bold text-white">Apply</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#740000"
              style={styles.loader}
            />
          ) : (
            <ScrollView className="space-y-3 mt-4 ">
              {applyData?.map((item, index) => (
                <View key={index} className="space-y-4 mx-4">
                  <View className="flex justify-between flex-row items-center">
                    <Text className="text-[#F56E00] font-bold text-xl">
                      {item.title}
                    </Text>
                    {isAdmin && (
                      <View className="flex flex-row gap-4">
                        <TouchableOpacity
                          className="bg-white px-3 py-1 border border-white rounded-xl"
                          onPress={() => handleEditing(index)}
                        >
                          <Text className="text-blue-500 text-semibold">
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-white px-3 py-1 border border-white rounded-xl"
                          onPress={() => deleteField(index)}
                        >
                          <Text className="text-red-500 text-semibold">
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <Text className="text-lg font-medium">{item.desc}</Text>
                </View>
              ))}
              <View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/assess",
                      params: {
                        lessonCode: lessonCode,
                        lessonName: lessonName,
                        lessonId: lessonId,
                        activate: "true",
                        acquire: true,
                        apply: true,
                        assess: true,
                      },
                    })
                  }
                  className="bg-[#F56E00] py-4 mt-20 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
                >
                  <Text className="text-white font-bold text-xl">
                    Move to Assess
                  </Text>
                </TouchableOpacity>

                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => setIsCreating(!isCreating)}
                    className="bg-[#F56E00] py-4 mt-4 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
                  >
                    <Text className="text-white font-bold text-lg">
                      Create New Field
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </ImageBackground>
        <View className="flex items-center"></View>
      </View>
      {isCreating && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Create a New Field
            </Text>
            <TextInput
              placeholder="enter the content title."
              name="code"
              value={title}
              onChangeText={(text) => setTitle(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter the content description."
              name="desc"
              value={desc}
              onChangeText={(text) => setDesc(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />

            <TouchableOpacity
              onPress={() => createField()}
              className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
            >
              <Text className="text-white font-bold text-xl">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsCreating(!isCreating)}
              className="bg-white py-3 mt-4 w-full flex border-red-700  items-center justify-center border rounded-3xl"
            >
              <Text className="text-red-700 font-bold text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isEdit && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Edit a New Field
            </Text>
            <TextInput
              placeholder="enter the content title."
              value={editTitle}
              onChangeText={(text) => setEditTitle(text)}
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter the content description."
              value={editDesc}
              onChangeText={(text) => setEditDesc(text)}
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />
            <TouchableOpacity
              onPress={() => saveEdit(index)}
              className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
            >
              <Text className="text-white font-bold text-xl">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEdit(false)}
              className="bg-white py-3 mt-4 w-full flex border-red-700  items-center justify-center border rounded-3xl"
            >
              <Text className="text-red-700 font-bold text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

export default Apply;

const styles = StyleSheet.create({});
