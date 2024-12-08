import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import CustomHeader from "../Components/CustomHeader";
import TitleContainer from "../Components/TitleContainer";
import { AntDesign } from "@expo/vector-icons";
import api from "../services/api";
import Toast from "../Components/Toast";

import { Link } from "expo-router";

import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome";

import useStore from "../store";
import { set } from "react-hook-form";

const Grades = () => {
  const { campusId } = useLocalSearchParams();

  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [gradeTab, setGradeTab] = useState(false);
  const [proficiencyTab, setProficiencyTab] = useState(false);

  const [prof, setProf] = useState([]);
  const [isprof, setIsProf] = useState(false);

  const [selectGrade, setSelectGrade] = useState();

  const [isEditing, setIsEditing] = useState();
  const [isCreating, setIsCreating] = useState();
  const [isDeleting, setIsDeleting] = useState();
  const [id, setId] = useState();

  const [grade_code, setGradeCode] = useState();
  const [name, setName] = useState();

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleDeleting = (id) => {
    setIsDeleting(true);
    setId(id);
  };

  const handleEditing = (id, code, name) => {
    setIsEditing(true);
    setGradeCode(code);
    setName(name);
    setId(id);
  };

  const handleNavigation = (id) => {
    router.push({
      pathname: "/subjects",
      params: { gradeId: id },
    });
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get(`/api/campuses/${campusId}/`);
      setGrades(response.data.grades);
      console.log(response.data.grades);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching grades:", error);

      setIsLoading(false);
    }
  };

  const createGrade = async () => {
    try {
      const formData = {
        grade_code,
        name,
        campus_id: campusId,
      };
      console.log(formData);

      const response = api.post("/admin-api/grade/", formData);
      setIsCreating(false);
      console.log(response.data);
      fetchGrades();
      setGradeCode("");
      setName("");
      console.log(formData);
      setToastType("success");
      setToastMessage("Grade created successfully.");
    } catch (error) {
      console.error("Error creating grades:", error);
      setToastType("error");
      setToastMessage("Grade was not created successfully.");
      setIsLoading(false);
    }
  };

  const updateGrade = async (id) => {
    try {
      const formData = {
        grade_code,
        name,
        campus_id: campusId,
      };
      console.log(formData);

      const response = api.put(`admin-api/grade/${id}/`, formData);
      setIsEditing(false);
      console.log(response.data);
      fetchGrades();
      console.log(formData);
      setToastType("success");
      setToastMessage("Grade updated successfully.");
    } catch (error) {
      console.error("Error updating grades:", error);
      setToastType("error");
      setToastMessage("Failed to update grade. Please try again.");
      setIsLoading(false);
    }
  };

  const deleteGrade = async (id) => {
    try {
      console.log(id);
      const response = api.delete(`/admin-api/grade/${id}/`);
      console.log(response.data);
      setIsDeleting(false);
      fetchGrades();
      setToastType("success");
      setToastMessage("Grade deleted successfully.");
    } catch (error) {
      console.error("Error deleting Grade:", error);
      setToastType("error");
      setToastMessage("Failed to delete grade. Please try again.");
      setIsLoading(false);
    }
  };

  // const fetchProf = async (id, name) => {
  //   try {
  //     const response = await api.get(
  //       `https://belakoo-backend.onrender.com/api/grades/${id}/`
  //     );
  //     setProf(response.data.proficiencies);
  //     setIsProf(true);
  //     setSelectGrade(name);
  //   } catch (error) {
  //     console.error("Error fetching Proficiency");
  //   }
  // };

  return (
    <CustomSafeAreaView>
      <ImageBackground
        source={require("../assets/Grades/bg.png")}
        style={styles.background}
      >
        <View style={styles.content}>
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
              Select the Grade
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#740000"
              style={styles.loader}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <TouchableOpacity
                onPress={() => setGradeTab(!gradeTab)}
                className="bg-white  w-64 h-16 flex items-center justify-center border border-white rounded-xl"
              >
                <Text className="text-[#F56E00] font-semibold text-2xl">
                  {!selectGrade ? "Select" : selectGrade}
                </Text>
              </TouchableOpacity>

              {gradeTab && (
                <ScrollView
                  className="bg-white border mt-5 rounded-lg border-white h-36"
                  showsVerticalScrollIndicator={false}
                >
                  {grades.length === 0 ? (
                    <View className="flex items-center flex-row px-4">
                      <View className="bg-white text-center border-b border-b-black/10 mb-2 w-64 h-16 flex-row  flex items-center justify-center rounded-xl">
                        <Text className="text-lg">No Grades Available</Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      {grades.map((grade, index) => (
                        <Link
                          key={index}
                          href={{
                            pathname: "/subjects",
                            params: { gradeId: grade.id },
                          }}
                          asChild
                        >
                          <TouchableOpacity>
                            <View className="flex flex-row items-center justify-center ">
                              {isAdmin && (
                                <View className="flex flex-row items-center justify-center gap-4 pl-2">
                                  <TouchableOpacity>
                                    <Icon
                                      name="delete"
                                      size={24}
                                      color="red"
                                      className="absolute p-5"
                                      onPress={() => handleDeleting(grade.id)}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleEditing(
                                        grade.id,
                                        grade.grade_code,
                                        grade.name
                                      )
                                    }
                                  >
                                    <Icon2 name="edit" size={24} color="blue" />
                                  </TouchableOpacity>
                                </View>
                              )}

                              <TouchableOpacity
                                key={grade.id}
                                onPress={() => handleNavigation(grade.id)}
                                className="bg-white border-b border-b-black/10 mb-2 w-64 h-16 flex-row  flex items-center justify-center rounded-xl"
                              >
                                <Text className="text-black font-semibold text-2xl">
                                  {grade.name}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        </Link>
                      ))}
                    </View>
                  )}
                </ScrollView>
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => setIsCreating(!isEditing)}
                  className="bg-[#F56E00] mt-5 text-sm flex items-center border rounded-lg border-[#F56E00] justify-center w-64 h-16"
                >
                  <Text className="text-white font-bold text-lg">
                    Add New Grade
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      </ImageBackground>
      {isCreating && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Add a New Grade
            </Text>
            <TextInput
              placeholder="enter your gradecode."
              name="code"
              value={grade_code}
              onChangeText={(text) => setGradeCode(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter your grade name."
              name="name"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />

            <TouchableOpacity
              onPress={() => createGrade()}
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
      {isEditing && (
        <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
          <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
            <Text className="font-bold text-center py-3 text-xl">
              Edit this Grade
            </Text>
            <TextInput
              placeholder="enter your gradecode."
              name="code"
              value={grade_code}
              onChangeText={(text) => setGradeCode(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter your grade name."
              name="name"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />
            <TouchableOpacity
              onPress={() => updateGrade(id)}
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
              Are you sure you want to delete this Grade?
            </Text>

            <TouchableOpacity
              onPress={() => deleteGrade(id)}
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  gradeCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    width: "35%",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#979292",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gradeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Grades;
