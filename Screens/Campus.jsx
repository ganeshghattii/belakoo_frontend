import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  Image,
  Touchable,
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome";

import { Text } from "react-native";

import { Link, useRouter } from "expo-router";
import CampusIconSvg from "../assets/icons/CampusIconSvg";
import DescriptionComponent from "../Components/TextComponents/DescriptionComponent";
import HeadingComponent from "../Components/TextComponents/HeadingComponent";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import CustomHeader from "../Components/CustomHeader";
import api from "../services/api";
import Toast from "react-native-toast-message";

import useStore from "../store";

import { AntDesign } from "@expo/vector-icons";

const Campus = () => {
  const [campuses, setCampuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userRole } = useStore();
  const isAdmin = userRole === "ADMIN";

  const router = useRouter();

  const [isEditing, setIsEditing] = useState();
  const [isCreating, setIsCreating] = useState();
  const [id, setId] = useState();

  const [campus_code, setCampusCode] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleEditing = (id) => {
    setIsEditing(true);
    setId(id);
  };

  const fetchCampuses = async () => {
    try {
      const response = await api.get("/api/campuses/");
      setCampuses(response.data);
      console.log(isAdmin);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load campuses. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const createCampus = async () => {
    try {
      const formData = {
        campus_code,
        name,
        description,
      };
      console.log(formData);

      const response = api.post("/admin-api/campus/", formData);
      setIsEditing(false);
      setIsCreating(false);
      console.log(response.data);
      fetchCampuses();
      console.log(formData);
    } catch (error) {
      console.error("Error creating campus:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create campus. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const updateCampus = async (id) => {
    try {
      const formData = {
        campus_code,
        name,
        description,
      };
      console.log(formData);

      const response = api.put(`admin-api/campus/${id}/`, formData);
      setIsEditing(false);
      console.log(response.data);
      fetchCampuses();
      console.log(formData);
    } catch (error) {
      console.error("Error updating campus:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update campus. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const deleteCampus = async (id) => {
    try {
      console.log(id);
      const response = api.delete(`/admin-api/campus/${id}/`);
      console.log(response.data);
      fetchCampuses();
    } catch (error) {
      console.error("Error deleting Campus:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete campus. Please try again.",
      });
      setIsLoading(false);
    }
  };

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
              Choose your Campus
            </Text>
          </View>

          <View style={styles.wrapper}>
            {isAdmin && (
              <View className="items-center py-10">
                <Link
                  key={"admin"}
                  href={{
                    pathname: "/admin",
                  }}
                  asChild
                >
                  <TouchableOpacity className="bg-[#F56E00] flex items-center border rounded-lg border-[#F56E00] justify-center w-48 h-16">
                    <Text className="text-center text-white text-lg font-bold">
                      Go to Admin Panel
                    </Text>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity
                  onPress={() => setIsCreating(!isEditing)}
                  className="bg-[#F56E00] mt-2 text-sm flex items-center border rounded-lg border-[#F56E00] justify-center w-48 h-16"
                >
                  <Text className="text-white font-bold text-lg">
                    Create a Campus
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.campusContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#740000" />
              ) : (
                <View
                  style={styles.cardContainer}
                  className="flex-wrap gap-2 px-4 justify-between"
                >
                  {campuses.map((campus) => (
                    <Link
                      key={campus.id}
                      href={{
                        pathname: "/grades",
                        params: { campusId: campus.id },
                      }}
                      asChild
                    >
                      <TouchableOpacity className="bg-white rounded-xl shadow-xl border border-white w-[45%] h-[95%] items-center justify-center">
                        {isAdmin && (
                          <TouchableOpacity
                            className="absolute z-10 right-12 top-5"
                            onPress={() => handleEditing(campus.id)}
                          >
                            <Icon2 name="edit" size={20} color="blue" />
                          </TouchableOpacity>
                        )}
                        {isAdmin && (
                          <TouchableOpacity
                            className="absolute z-10 right-4 top-5"
                            onPress={() => deleteCampus(campus.id)}
                          >
                            <Icon name="delete" size={18} color="red" />
                          </TouchableOpacity>
                        )}

                        <Text className="text-[#F56E00] text-2xl font-bold text-center">
                          {campus.name}
                        </Text>
                        <Text className="text-[#F56E00] font-bold text-center">
                          {campus.description}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
        {isCreating && (
          <View className="absolute transition ease-in h-screen w-[100%] flex items-center justify-center bg-black/70">
            <View className="bg-gray-100 h-fit py-6 w-[90%] border flex items-center justify-center rounded-xl space-y-5 border-white px-4">
              <Text className="font-bold text-center py-3 text-xl">
                Create a New Campus
              </Text>
              <TextInput
                placeholder="enter your campus code."
                name="code"
                value={campus_code}
                onChangeText={(text) => setCampusCode(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter your campus name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter campus description."
                name="description"
                value={description}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TouchableOpacity
                onPress={() => createCampus()}
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
                Edit this Campus
              </Text>
              <TextInput
                placeholder="enter your campus code."
                name="code"
                value={campus_code}
                onChangeText={(text) => setCampusCode(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter your campus name."
                name="name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4  w-full  rounded-xl border-[#F56E00] border-2"
              />
              <TextInput
                placeholder="enter campus description."
                name="description"
                value={description}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
                placeholderTextColor="#CCCCCC"
                clearButtonMode="while-editing"
                className="bg-white text-lg p-4 w-full rounded-xl border-[#F56E00] border-2"
              />
              <TouchableOpacity
                onPress={() => updateCampus(id)}
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
  wrapper: {
    flex: 1,
    justifyContent: "starts",
    alignItems: "center",
    paddingBottom: 60, // Adjust this value to account for the status bar and header
  },
  campusContainer: {
    width: "95%",
    paddingVertical: 44,
    borderRadius: 15,
  },
  cardContainer: {
    flexDirection: "row",
    marginTop: 0,
    width: "100%",
  },
  campusCard: {
    width: "30%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    rowGap: 10,
    alignItems: "center",
    borderRadius: 29,
    backgroundColor: "#FFF4E6",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10.7,
    elevation: 5,
  },
});

export default Campus;
