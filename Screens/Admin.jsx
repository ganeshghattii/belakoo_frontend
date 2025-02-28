import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";

import { Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import Toast from "../Components/Toast";

import { ScrollView } from "react-native";
import useStore from "../store";

import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import api from "../services/api";

import { useRouter } from "expo-router";

const Admin = () => {
  const router = useRouter();

  const [volunteer, setVolunteer] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isEditing, setIsEditing] = useState();

  const [isDeleting, setIsDeleting] = useState();
  const [id, setId] = useState();

  const { adminEmail } = useStore();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  const handleDeleting = (id) => {
    setIsDeleting(true);
    setId(id);
  };

  const fetchVolunteer = async () => {
    try {
      const response = await api.get("/admin-api/volunteers/");
      setVolunteer(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load campuses. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const createVolunteer = async () => {
    try {
      const formData = {
        email,
        password,
        name,
      };
      console.log(formData);

      const response = await api.post(
        "/admin-api/volunteers/create/",
        formData
      );
      setIsEditing(false);
      console.log(response.data);
      fetchVolunteer();
      console.log(formData);
      setToastType("success");
      setToastMessage("Volunteer created successfully.");
    } catch (error) {
      console.error("Error creating volunteer:", error);
      setToastType("error");
      setToastMessage("Volunteer was not created successfully.");
      setIsLoading(false);
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/admin-api/volunteers/${id}/delete/`);
      console.log(response.data);
      fetchVolunteer();
      setIsDeleting(false);
      setToastType("success");
      setToastMessage("Volunteer deleted successfully.");
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      setToastType("errorr");
      setToastMessage("Volunteer did not get created.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteer();
  }, []);

  const markLessonNotDone = async (id) => {
    try {
      const response = await api.post(`/api/lessons/${id}/mark-not-done/`);
      console.log(response.data);
      fetchUnverifiedLessons();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lesson marked as not done.",
      });
    } catch (error) {
      console.error("Error marking lesson as not done:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to mark lesson as not done. Please try again.",
      });
    }
  };

  const verifyLesson = async (id) => {
    const formData = {
      verified: true,
    };

    try {
      const response = await api.put(`/admin-api/lesson/${id}/`, formData);
      console.log(response.data);
      fetchUnverifiedLessons();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Lesson verified successfully.",
      });
    } catch (error) {
      console.error("Error verifying lesson:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify lesson. Please try again.",
      });
    }
  };

  const [unverifiedLessons, setUnverifiedLessons] = useState([]);

  const fetchUnverifiedLessons = async () => {
    try {
      const response = await api.get(
        "/admin-api/unverified-completed-lessons/"
      );
      setUnverifiedLessons(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching unverified lessons:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load unverified lessons. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchUnverifiedLessons();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="bg-[#F56E00]/70">
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
            <Text className="text-2xl font-bold text-white">Admin Panel</Text>
          </View>

          <View className="h-screen pt-4 pb-20 px-4">
            <ScrollView>
              <Text className="text-2xl px-3 font-semibold text-[#F56E00]">
                Welcome Admin !
              </Text>
              <Text className="text-md px-3 font-semibold text-black/50">
                Email : {adminEmail}
              </Text>
              <View className="bg-white p-5 space-y-3 border-2 border-white rounded-xl my-5">
                <Text className="text-xl font-bold">Volunteer Information</Text>
                <Text className="text-md font-medium text-gray-600">
                  Here is the list of all the volunteer that falls under the
                  authority of Belakoo.
                </Text>
                <View className="w-full border border-gray-300"></View>
                <View className="h-96">
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {volunteer?.map((item, index) => (
                      <View
                        key={index}
                        className="bg-gray-100 my-2 p-4 border border-gray-100 rounded-xl"
                      >
                        <TouchableOpacity
                          onPress={() => handleDeleting(item.id)}
                          className="absolute z-10 right-4 top-5 border-red-700 border rounded-md "
                        >
                          <Text className="text-center text-sm font-bold p-1 text-red-700">
                            <Icon
                              name="delete"
                              size={20}
                              color="#B91C1C"
                              className="absolute p-5"
                            />
                          </Text>
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold capitalize">
                          {item.name}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Email : {item.email}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Active : {item.is_active === true ? "True" : "False"}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  className="bg-[#F56E00] py-4 mt-4 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
                >
                  <Text className="text-white font-bold text-xl">
                    Add a Volunteer
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="bg-white p-5 space-y-3 border-2 border-white rounded-xl my-5">
                <Text className="text-xl font-bold">Verify Lessons</Text>
                {unverifiedLessons.length === 0 ? (
                  <View className="p-5 bg-gray-200 border rounded-xl border-gray-200">
                    <Text className="text-gray-600 font-bold text-center text-md">
                      No Pending Lessons for Verification
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    className="h-96"
                  >
                    {unverifiedLessons?.map((item, index) => (
                      <View
                        className="bg-gray-200 p-5 rounded-xl space-y-1 my-3"
                        key={index}
                      >
                        <Text className="text-lg font-bold">{item.name}</Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Subject : {item.subject.name}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Grade : {item.grade.name}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Proficiency : {item.proficiency.name}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          Completed By: {item.completed_by.name}
                        </Text>
                        <View className="flex flex-row gap-4">
                          <TouchableOpacity
                            className="border-green-700 border rounded-md px-3 py-1"
                            onPress={() => verifyLesson(item.id)}
                          >
                            <Text className="text-center text-sm font-bold p-1 text-green-700">
                              Approve
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="border-red-700 border rounded-md px-3 py-1"
                            onPress={() => markLessonNotDone(item.id)}
                          >
                            <Text className="text-center text-sm font-bold p-1 text-red-700">
                              Reject
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        {isEditing && (
          <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
            <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
              <Text className="font-bold text-center py-3 text-xl">
                Add a New Volunteer
              </Text>
              <TextInput
                placeholder="enter your volunteer name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter your volunteer's email."
                name="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                keyboardType="email-address"
                className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter volunteer's password."
                name="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor="#CCCCCC"
                keyboardType="visible-password"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TouchableOpacity
                onPress={() => createVolunteer()}
                className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
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
                Are you sure you want to delete this Volunteer?
              </Text>

              <TouchableOpacity
                onPress={() => deleteVolunteer(id)}
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
});

export default Admin;
