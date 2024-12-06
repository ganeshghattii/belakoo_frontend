import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import api from "../services/api";
import Toast from "../Components/Toast";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";

import { useContext } from "react";
import { MyContext } from "../context/context";

import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome";

import useStore from "../store";

const Chapters = () => {
  const { proficiencyId, proficiencyName, subjectId } = useLocalSearchParams();
  const router = useRouter();
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState();
  const [isCreating, setIsCreating] = useState();

  const [lesson_code, setLessonCode] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  const { grade } = useStore();

  const { userRole } = useStore();

  const isAdmin = userRole === "ADMIN";

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  useEffect(() => {
    fetchGradeDetails();
  }, []);

  const fetchGradeDetails = async () => {
    try {
      const response = await api.get(
        `/api/proficiencies/${proficiencyId}/lessons/`
      );
      setChapters(response.data.lessons);
      console.log(response.data.lessons);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching grade details:", error);
      setIsLoading(false);
    }
  };

  const createLesson = async () => {
    try {
      const formData = {
        lesson_code,
        name,
        subject_id: subjectId,
        grade_id: grade,
        proficiency_id: proficiencyId,
      };
      console.log(formData);

      const response = api.post("/admin-api/lesson/", formData);
      setIsCreating(false);
      console.log(response.data);
      setLessonCode("");
      setName("");
      fetchGradeDetails();
      setToastType("success");
      setToastMessage("Lesson created successfully.");
      console.log(formData);
    } catch (error) {
      console.error("Error creating proficiency:", error);
      setToastType("error");
      setToastMessage("Lesson was not created successfully.");
      setIsLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <ImageBackground source={require("../assets/Content/bg2.png")} />
      <View className="bg-[#F56E00]/10  h-screen">
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
          <Text className="text-2xl font-bold text-white">Select Lessons</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#740000"
            style={styles.loader}
          />
        ) : (
          <View className="flex  flex-row flex-wrap items-center justify-center">
            {chapters
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((item, index) => (
                <View className="Flex items-center justify--center" key={index}>
                  <TouchableOpacity
                    className="bg-white h-20 flex items-center justify-center  space-y-3 border border-white rounded-lg m-5 w-20"
                    onPress={() =>
                      router.push({
                        pathname: "/lesson",
                        params: {
                          lessonCode: item.lesson_code,
                          lessonName: item.name,
                          lessonId: item.id,
                          profId: proficiencyId,
                          subId: subjectId,
                        },
                      })
                    }
                  >
                    {item.verified && item.is_done && (
                      <AntDesign name="checkcircle" size={20} color="green" />
                    )}

                    <Text className="font-semibold text-sm">{item.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
        {isAdmin && (
          <View className="flex items-center">
            <TouchableOpacity
              onPress={() => setIsCreating(!isCreating)}
              className="bg-[#F56E00] mt-5 text-sm flex items-center border rounded-lg border-[#F56E00] justify-center w-64 h-16"
            >
              <Text className="text-white font-bold text-lg">
                Create New Lesson
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isCreating && (
          <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
            <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
              <Text className="font-bold text-center py-3 text-xl">
                Create a New Lesson
              </Text>
              <TextInput
                placeholder="enter your lesson code."
                name="code"
                value={lesson_code}
                onChangeText={(text) => setLessonCode(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter your lesson name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
              />

              <TouchableOpacity
                onPress={() => createLesson()}
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
        {toastMessage && <Toast type={toastType} message={toastMessage} />}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Chapters;
