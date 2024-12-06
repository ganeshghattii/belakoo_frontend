import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { useRouter } from "expo-router";

import { useEffect } from "react";

import { useState } from "react";

import { AntDesign } from "@expo/vector-icons";

import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import axios from "axios";
import { MyContext } from "../context/context";

import useStore from "../store";
import api from "../services/api";

const Principle = () => {
  const router = useRouter();

  const { lessonCode, lessonName, activate, apply, assess, acquire } =
    useLocalSearchParams();

  const { profId } = useContext(MyContext);

  const [isActivate] = useState(activate);
  const [isAcquire] = useState(acquire);
  const [isAssess] = useState(assess);
  const [isApply] = useState(apply);

  const [isVerify, setIsVerify] = useState(false);

  const { lessonId } = useStore();

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await api.get(`api/lessons/${lessonId}/`);
        console.log(lessonId);
        setIsVerify(response.data.verified);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching lesson data: ", error);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  const handleMarkAsDone = async () => {
    const response = api.post(`api/lessons/${lessonId}/mark-done/`);
    console.log(lessonId);
    console.log("Mark is Done : ", response);
    router.push({
      pathname: `/chapters`,
      params: {
        lessonCode: lessonCode,
        lessonName: lessonName,
        activate: true,
        lessonId: lessonId,
        proficiencyId: profId,
      },
    });
  };

  const handleActivate = () => {
    if (isActivate || isVerify) {
      router.push({
        pathname: `/activate`,
        params: {
          lessonCode: lessonCode,
          lessonName: lessonName,
          lessonId: lessonId,
          activate: true,
        },
      });
    }
  };

  const handleApply = () => {
    if (isApply || isVerify) {
      router.push({
        pathname: `/apply`,
        params: {
          lessonCode: lessonCode,
          lessonName: lessonName,
          lessonId: lessonId,
          activate: true,
        },
      });
    }
  };

  const handleAcquire = () => {
    if (isAcquire || isVerify) {
      router.push({
        pathname: `/acquire`,
        params: {
          lessonCode: lessonCode,
          lessonName: lessonName,
          lessonId: lessonId,
          activate: true,
        },
      });
    }
  };

  const handleAssess = () => {
    if (isAssess || isVerify) {
      console.log(profId);
      router.push({
        pathname: `/assess`,
        params: {
          lessonCode: lessonCode,
          lessonName: lessonName,
          lessonId: lessonId,
          activate: true,
        },
      });
    }
  };

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
            Guiding Principles
          </Text>
        </View>
        <View className="flex items-center justify-center w-full px-4">
          <Text className="text-2xl font-bold text-center py-4">4 A's</Text>
          <View className="flex flex-wrap flex-row mt-20 items-center justify-center">
            <TouchableOpacity
              className={` w-[36%] h-[42%] flex items-center justify-center rounded-2xl  m-5 ${
                activate || isVerify ? "bg-green-500" : "bg-[#ACACAC]"
              }`}
              onPress={handleActivate}
            >
              <Text className="text-white font-bold text-2xl">ACTIVATE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={` w-[36%] h-[42%] flex items-center justify-center rounded-2xl  m-5 ${
                acquire || isVerify ? "bg-green-500" : "bg-[#ACACAC]"
              }`}
              onPress={handleAcquire}
            >
              <Text className="text-white font-bold text-2xl">ACQUIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={` w-[36%] h-[42%]   flex items-center justify-center rounded-2xl  m-5 ${
                apply || isVerify ? "bg-green-500" : "bg-[#ACACAC]"
              }`}
              onPress={handleApply}
            >
              <Text className="text-white font-bold text-2xl">APPLY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={` w-[36%] h-[42%]   flex items-center justify-center rounded-2xl  m-5 ${
                activate || isVerify ? "bg-green-500" : "bg-[#ACACAC]"
              }`}
              onPress={handleAssess}
            >
              <Text className="text-white font-bold text-2xl">ASSESS</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isAssess ? (
          <TouchableOpacity
            className="bg-[#ACACAC] py-4 mt-16 mx-10 flex border-gray-400 items-center justify-center border rounded-3xl"
            onPress={handleMarkAsDone}
          >
            <Text className="text-white font-bold text-xl">Mark as Done</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/activate",
                params: {
                  lessonCode: lessonCode,
                  lessonName: lessonName,
                  lessonId: lessonId,
                  activate: true,
                },
              })
            }
            className="bg-[#ACACAC] py-4 mt-16 mx-10 flex border-gray-400 items-center justify-center border rounded-3xl"
          >
            <Text className="text-white font-bold text-xl">Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

export default Principle;

const styles = StyleSheet.create({});
