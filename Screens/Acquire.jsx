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
import Toast from "../Components/Toast";

import { ActivityIndicator } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import useStore from "../store";

import api from "../services/api";
import { useLocalSearchParams } from "expo-router";

const Acquire = () => {
  const router = useRouter();

  const [acquireData, setAcquireData] = useState();
  const { lessonCode, lessonName } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const { lessonId } = useStore();

  const [isEdit, setIsEdit] = useState();
  const [isCreating, setIsCreating] = useState();
  const [index, setIndex] = useState();

  const [isDeleting, setIsDeleting] = useState();
  const [id, setId] = useState();

  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [hook, setHook] = useState();

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const handleDeleting = (id) => {
    setIsDeleting(true);
    setId(id);
  };

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(`/api/lessons/${lessonId}/`);
      console.log(response.data);

      const parsedData = JSON.parse(response.data.acquire);
      setAcquireData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      console.log(lessonId);
      setToastType("error");
      setToastMessage("Failed to load lessons. Please try again.");
      setIsLoading(false);
    }
  };

  const createField = () => {
    const formData = { title, desc };

    const updatedData = [...(acquireData || []), formData];

    const finalData = { acquire: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
      setIsCreating(!isCreating);
      setToastType("success");
      setToastMessage("Field created successfully.");
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
      setToastType("error");
      setToastMessage("Field was not created successfully.");
    }
  };

  const deleteField = (index) => {
    const updatedData = [...acquireData];
    updatedData.splice(index, 1);
    setAcquireData(updatedData);

    const finalData = { acquire: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
      setToastType("success");
      setToastMessage("Field deleted successfully.");
      setIsDeleting(!isDeleting);
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
      setToastType("error");
      setToastMessage("Failed to delete field. Please try again.");
    }
  };

  const handleEditing = (index) => {
    setIsEdit(true);
    setIndex(index);
    startEditing(index);
  };

  const startEditing = (index) => {
    setEditTitle(acquireData[index].title);
    setEditDesc(acquireData[index].desc);
  };

  const saveEdit = (index) => {
    const updatedData = [...acquireData];
    updatedData[index] = {
      ...updatedData[index],
      title: editTitle,
      desc: editDesc,
    };
    const finalData = { acquire: updatedData };

    try {
      const response = api.put(`admin-api/lesson/${lessonId}/`, finalData);
      console.log("Response data:", response.data);
      console.log(updatedData);
      fetchLessonDetails();
      setToastType("success");
      setToastMessage("Field updated successfully.");
    } catch (error) {
      console.log("Failed to update");
      console.error("Error:", error.response?.data || error.message);
      setToastType("error");
      setToastMessage("Failed to update field. Please try again.");
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
            <Text className="text-2xl font-bold text-white">Acquire</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#740000"
              style={styles.loader}
            />
          ) : (
            <ScrollView
              className=" space-y-3 my-4 h-[60%]"
              showsVerticalScrollIndicator={false}
            >
              {acquireData?.map((item, index) => (
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
                        <TouchableOpacity className="bg-white px-3 py-1 border border-white rounded-xl">
                          <Text
                            className="text-red-500 text-semibold"
                            onPress={() => handleDeleting(index)}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <Text className="text-lg font-medium">{item.desc}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          <View className="bg-transparent">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/apply",
                  params: {
                    lessonCode: lessonCode,
                    lessonName: lessonName,
                    activate: "true",
                    acquire: true,
                    apply: true,
                  },
                })
              }
              className="bg-[#F56E00] mt-10 mb-4 py-4 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
            >
              <Text className="text-white font-bold text-xl">
                Move to Apply
              </Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                onPress={() => setIsCreating(!isCreating)}
                className="bg-[#F56E00] py-4 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-lg">
                  Add New Field
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
        <View className="flex items-center"></View>
      </View>
      {isCreating && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Add a New Field
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
      {isDeleting && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Are you sure you want to delete this Field?
            </Text>

            <TouchableOpacity
              onPress={() => deleteField(id)}
              className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
            >
              <Text className="text-white font-bold text-xl">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsDeleting(!isDeleting)}
              className="bg-white py-3 mt-4 w-full flex border-red-700  items-center justify-center border rounded-3xl"
            >
              <Text className="text-red-700 font-bold text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {toastMessage && <Toast type={toastType} message={toastMessage} />}
    </CustomSafeAreaView>
  );
};

export default Acquire;

const styles = StyleSheet.create({});
