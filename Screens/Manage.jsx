import React, { useEffect, useState } from "react";

import { Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { ScrollView } from "react-native";
import useStore from "../store";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import api from "../services/api";
import Toast from "../Components/Toast";
import { useRouter } from "expo-router";

import { useLocalSearchParams } from "expo-router";

import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

const Manage = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subject_code, setSubjectCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const { adminEmail } = useStore();

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  const { gradeId } = useLocalSearchParams();

  const fetchSubjects = async () => {
    try {
      const response = await api.get(`/api/grades/${gradeId}/`);
      setSubjects(response.data.subjects);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load subjects. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const createSubject = async () => {
    try {
      const formData = {
        subject_code,
        name,
        grade_id: gradeId,
        colorcode: "#FF5733",
        icon: "sd",
      };
      const response = await api.post(`/admin-api/subject/`, formData);
      setName("");
      setSubjectCode("");
      fetchSubjects();
      setToastType("success");
      setToastMessage("Subject created successfully.");
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating subject:", error);
      setToastType("error");
      setToastMessage("Subject was not created successfully.");
    }
  };

  const editSubject = async () => {
    try {
      const formData = { name };
      const response = await api.put(`/admin-api/subject/${id}/`, formData);
      setIsEditing(false);
      fetchSubjects();
      setToastType("success");
      setToastMessage("Subject edited successfully.");
    } catch (error) {
      console.error("Error editing subject:", error);
      setToastType("error");
      setToastMessage("Failed to update subject. Please try again.");
    }
  };

  const deleteSubject = async (id) => {
    try {
      const response = await api.delete(`/admin-api/subject/${id}/`);
      fetchSubjects();
      setIsDeleting(false);
      setToastType("success");
      setToastMessage("Subject deleted successfully.");
    } catch (error) {
      console.error("Error deleting subject:", error);
      setToastType("error");
      setToastMessage("Failed to delete subject. Please try again.");
    }
  };

  useEffect(() => {
    fetchSubjects();
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
            <Text className="text-2xl font-bold text-white">
              Manage Subjects
            </Text>
          </View>

          <View className="h-screen pt-4 pb-20 px-4">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-white p-5 space-y-3 border-2 border-white rounded-xl my-5">
                <Text className="text-xl font-bold">Subject Information</Text>
                <Text className="text-md font-medium text-gray-600">
                  Here is the list of all the subjects.
                </Text>
                <View className="w-full border border-gray-300"></View>
                <ScrollView className="h-96">
                  {subjects?.map((item, index) => (
                    <View
                      key={index}
                      className="bg-gray-100 my-2 p-4 border border-gray-100 rounded-xl"
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditing(true);
                          setId(item.id);
                          setName(item.name);
                        }}
                        className="absolute z-10 right-16 top-5 border-blue-700 border rounded-md"
                      >
                        <Text className="text-center text-sm font-bold p-1 text-blue-700">
                          <Icon
                            name="edit"
                            size={16}
                            color="#1C7CB9"
                            className="absolute p-5"
                          />
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsDeleting(true);
                          setId(item.id);
                        }}
                        className="absolute z-10 right-4 top-5 border-red-700 border rounded-md ml-10"
                      >
                        <Text className="text-center text-sm font-bold p-1 text-red-700">
                          <Icon
                            name="delete"
                            size={16}
                            color="#B91C1C"
                            className="absolute p-5"
                          />
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-lg font-semibold capitalize">
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setIsCreating(true)}
                  className="bg-[#F56E00] py-4 mt-4 mx-3  flex border-[#F56E00] items-center justify-center border rounded-3xl"
                >
                  <Text className="text-white font-bold text-xl">
                    Add a New Subject
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        {isCreating && (
          <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
            <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
              <Text className="font-bold text-center py-3 text-xl">
                Add Subject
              </Text>
              <TextInput
                placeholder="Enter subject code."
                name="name"
                value={subject_code}
                onChangeText={(text) => setSubjectCode(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="Enter subject name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TouchableOpacity
                onPress={() => createSubject()}
                className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsCreating(!isCreating)}
                className="bg-white py-3 mt-4 w-full flex border-red-700 items-center justify-center border rounded-3xl"
              >
                <Text className="text-red-700 font-bold text-xl">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {isEditing && (
          <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
            <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
              <Text className="font-bold text-center py-3 text-xl">
                Edit Subject
              </Text>
              <TextInput
                placeholder="Enter subject name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TouchableOpacity
                onPress={() => editSubject()}
                className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className="bg-white py-3 mt-4 w-full flex border-red-700 items-center justify-center border rounded-3xl"
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
                Are you sure you want to delete this subject?
              </Text>
              <TouchableOpacity
                onPress={() => deleteSubject(id)}
                className="bg-[#F56E00] py-3 mt-4 w-full flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsDeleting(!isDeleting)}
                className="bg-white py-3 mt-4 w-full flex border-red-700 items-center justify-center border rounded-3xl"
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

export default Manage;
