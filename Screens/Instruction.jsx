import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";

import { Text } from "react-native";

import { ScrollView } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { InstructionContentData } from "../constant";
import { TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";

const InstructionContent = ({ title, description }) => {
  return (
    <View className="py-5 space-y-5">
      <Text className="text-xl font-bold">{title}</Text>
      <Text className="font-medium text-lg">{description}</Text>
    </View>
  );
};

const Instruction = () => {
  const router = useRouter();

  const handleRedirect = async () => {
    router.replace("/campus");
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content} className="bg-[#F56E00]/70">
        <ImageBackground
          source={require("../assets/Content/bg2.png")}
          style={styles.background}
        >
          <View className="flex relative items-center justify-center flex-row bg-[#F56E00] py-5 mt-0">
          <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
          </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">
              Read the Instructions
            </Text>
          </View>

          <View className="h-screen pt-4 pb-20 px-4">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-[#F56E00]">
                Some important guidelines for facilitators:
              </Text>
              {InstructionContentData.map((item, index) => (
                <View key={index}>
                  <InstructionContent
                    title={item.title}
                    description={item.description}
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={handleRedirect}
                className="bg-[#F56E00] py-2 mx-10 flex border-[#F56E00] items-center justify-center border rounded-3xl"
              >
                <Text className="text-white font-bold text-xl">Next</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ImageBackground>
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

export default Instruction;
