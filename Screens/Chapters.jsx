import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import api from "../services/api";
import Toast from "react-native-toast-message";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";

import { useContext } from "react";
import { MyContext } from "../context/context";

const Chapters = () => {
  const { proficiencyId, proficiencyName } = useLocalSearchParams();
  const router = useRouter();
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {profId, setProfId} = useContext(MyContext)

  useEffect(() => {
    fetchGradeDetails();
  }, []);

  const fetchGradeDetails = async () => {
    try {
      const response = await api.get(
        `https://belakoo-backend.onrender.com/api/proficiencies/${proficiencyId}/lessons/`
      );
      setChapters(response.data.lessons);
      setIsLoading(false);
      setProfId(proficiencyId)
    } catch (error) {
      console.error("Error fetching grade details:", error);
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
      <ImageBackground source={require("../assets/Content/bg2.png")} />
      <View className="bg-[#F56E00]/10  h-screen">
        <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
        <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Select Chapters</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#740000"
            style={styles.loader}
          />
        ) : (
          <View className="flex  flex-row flex-wrap items-center justify-center">
            {chapters.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white h-20 flex items-center justify-center  space-y-3 border border-white rounded-lg m-5 w-20"
                onPress={() =>
                  router.push({
                    pathname: "/lesson",
                    params: {
                      lessonCode: item.lesson_code,
                      lessonName: item.name,
                    },
                  })
                }
              >
                {item.is_done && (
                  <AntDesign name="checkcircle" size={20} color="green" />
                )}

                <Text className="font-semibold text-md">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Chapters;
