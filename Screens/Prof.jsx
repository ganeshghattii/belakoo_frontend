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
import api from "../services/api";

import Toast from "../Components/Toast";

import useStore from "../store";

import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome";

import { Link } from "expo-router";
import { set } from "react-hook-form";

const Prof = () => {
  const { subjectId, subjectName, gradeId } = useLocalSearchParams();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [profTab, setProfTab] = useState(false);

  const [prof, setProf] = useState([]);
  const [isProf, setIsProf] = useState(false);

  const [selectGrade, setSelectGrade] = useState();

  const [isEditing, setIsEditing] = useState();
  const [isCreating, setIsCreating] = useState();
  const [isDeleting, setIsDeleting] = useState();
  const [id, setId] = useState();

  const [proficiency_code, setProficiencyCode] = useState();
  const [name, setName] = useState();

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const [toastType, setToastType] = useState();
  const [toastMessage, setToastMessage] = useState();

  useEffect(() => {
    fetchProf();
  }, []);

  const handleDeleting = (id) => {
    setIsDeleting(true);
    setId(id);
  };

  const handleEditing = (id, code, name) => {
    setIsEditing(true);
    setProficiencyCode(code);
    setName(name);
    setId(id);
  };

  const handleNavigation = (id, name) => {
    router.push({
      pathname: "/chapters",
      params: {
        proficiencyId: id,
        proficiencyName: name,
        subjectId: subjectId,
        gradeId: gradeId,
      },
    });
  };

  const fetchProf = async () => {
    try {
      const response = await api.get(
        `https://belakoo-backend-02sy.onrender.com/api/subjects/${subjectId}/`
      );
      setProf(response.data.proficiencies);
      console.log(response.data.proficiencies);
      setIsProf(true);
      setProfTab(true);
      setIsLoading(false);
      setSelectGrade(subjectName);
    } catch (error) {
      console.error("Error fetching Proficiency", error);
    }
  };

  const createProficiency = async () => {
    try {
      const formData = {
        proficiency_code,
        name,
        subject_id: subjectId,
      };
      console.log(formData);
      const response = api.post("/admin-api/proficiency/", formData);
      setIsCreating(false);
      console.log(response.data);
      setProficiencyCode("");
      setName("");
      fetchProf();
      setToastType("success");
      setToastMessage("Prof created successfully.");
      console.log(formData);
    } catch (error) {
      console.error("Error creating proficiency:", error);
      setToastMessage("Prof was not created successfully.");
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const updateProficiency = async (id) => {
    try {
      const formData = {
        proficiency_code,
        name,
        subject_id: subjectId,
      };
      console.log(formData);

      const response = api.put(`admin-api/proficiency/${id}/`, formData);
      setIsEditing(false);
      console.log(response.data);
      fetchProf();
      setToastType("success");
      setToastMessage("Prof updated successfully.");
      console.log(formData);
    } catch (error) {
      console.error("Error updating proficiency:", error);
      setToastType("error");
      setToastMessage("Failed to update prof. Please try again.");
      setIsLoading(false);
    }
  };

  const deleteProficiency = async (id) => {
    try {
      console.log(id);
      const response = api.delete(`/admin-api/proficiency/${id}/`);
      console.log(response.data);
      setIsDeleting(false);
      fetchProf();
      setToastType("success");
      setToastMessage("Prof deleted successfully.");
    } catch (error) {
      console.error("Error deleting Proficiency:", error);
      setToastType("error");
      setToastMessage("Failed to delete prof. Please try again.");
      setIsLoading(false);
    }
  };

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
              Select the Proficiency
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
                onPress={() => setIsProf(!isProf)}
                className="bg-white  w-64 h-16 flex items-center justify-center border border-white rounded-xl"
              >
                <Text className="text-[#F56E00] font-semibold text-2xl">
                  Select
                </Text>
              </TouchableOpacity>

              {profTab && (
                <ScrollView
                  className="bg-white border mt-5 rounded-lg border-white h-36"
                  showsVerticalScrollIndicator={false}
                >
                  {prof.map((prof) => (
                    <Link
                      key={prof.id}
                      href={{
                        pathname: "/chapters",
                        params: {
                          proficiencyId: prof.id,
                          proficiencyName: prof.name,
                        },
                      }}
                      asChild
                    >
                      <TouchableOpacity>
                        <View className="flex items-center flex-row px-4">
                          {isAdmin && (
                            <View className="flex flex-row items-center justify-center gap-4">
                              <TouchableOpacity>
                                <Icon
                                  name="delete"
                                  size={24}
                                  color="red"
                                  className="absolute p-5"
                                  onPress={() => handleDeleting(prof.id)}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleEditing(
                                    prof.id,
                                    prof.proficiency_code,
                                    prof.name
                                  )
                                }
                              >
                                <Icon2 name="edit" size={24} color="blue" />
                              </TouchableOpacity>
                            </View>
                          )}

                          <TouchableOpacity
                            key={prof.id}
                            onPress={() => handleNavigation(prof.id, prof.name)}
                            className="bg-white border-b border-b-black/10 mb-2 w-64 h-16 flex items-center justify-center rounded-xl"
                          >
                            <Text className="text-black font-semibold text-2xl">
                              {prof.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  ))}
                  <Link href={"#"} asChild>
                    <TouchableOpacity>
                      <View className="flex items-center flex-row px-4">
                        {isAdmin && (
                          <View className="flex flex-row items-center justify-center gap-4">
                            <TouchableOpacity>
                              <Icon
                                name="delete"
                                size={24}
                                color="red"
                                className="absolute p-5"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Icon2 name="edit" size={24} color="blue" />
                            </TouchableOpacity>
                          </View>
                        )}

                        <TouchableOpacity className="bg-white border-b border-b-black/10 mb-2 w-64 h-16 flex items-center justify-center rounded-xl">
                          <Text className="text-gray-500 font-semibold text-2xl">
                            P2
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href={"#"} asChild>
                    <TouchableOpacity>
                      <View className="flex items-center flex-row px-4">
                        {isAdmin && (
                          <View className="flex flex-row items-center justify-center gap-4">
                            <TouchableOpacity>
                              <Icon
                                name="delete"
                                size={24}
                                color="red"
                                className="absolute p-5 opacity-40"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <Icon2 name="edit" size={24} color="blue" />
                            </TouchableOpacity>
                          </View>
                        )}

                        <TouchableOpacity className="bg-white border-b border-b-black/10 mb-2 w-64 h-16 flex items-center justify-center rounded-xl">
                          <Text className="text-gray-500 font-semibold text-2xl">
                            P3
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </ScrollView>
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => setIsCreating(!isEditing)}
                  className="bg-[#F56E00] mt-5 text-sm flex items-center border rounded-lg border-[#F56E00] justify-center w-64 h-16"
                >
                  <Text className="text-white font-bold text-lg">
                    Create New Proficiency
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
              Create a New Proficiency
            </Text>
            <TextInput
              placeholder="enter your proficiency code."
              name="code"
              value={proficiency_code}
              onChangeText={(text) => setProficiencyCode(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter your proficiency name."
              name="name"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />

            <TouchableOpacity
              onPress={() => createProficiency()}
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
              Edit this Proficiency
            </Text>
            <TextInput
              placeholder="enter your proficiency code."
              name="code"
              value={proficiency_code}
              onChangeText={(text) => setProficiencyCode(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
            />
            <TextInput
              placeholder="enter your proficiency name."
              name="name"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#CCCCCC"
              clearButtonMode="while-editing"
              className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
            />
            <TouchableOpacity
              onPress={() => updateProficiency(id)}
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
              Are you sure you want to delete this Proficiency?
            </Text>

            <TouchableOpacity
              onPress={() => deleteProficiency(id)}
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

export default Prof;
