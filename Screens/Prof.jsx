import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import api from "../services/api";


import { Link } from "expo-router";

const Prof = () => {
  const { subjectId, subjectName } = useLocalSearchParams();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [profTab, setProfTab] = useState(false);

  const [prof, setProf] = useState([]);
  const [isprof, setIsProf] = useState(false);

  const [selectGrade, setSelectGrade] = useState();

  useEffect(() => {
    fetchProf();
  }, []);



  const fetchProf = async () => {
    try {
      const response = await api.get(
        `https://belakoo-backend-02sy.onrender.com/api/subjects/${subjectId}/`
      );
      setProf(response.data.proficiencies);
      setIsProf(true);
      setProfTab(true)
      setIsLoading(false)
      setSelectGrade(subjectName);
    } catch (error) {
      console.error("Error fetching Proficiency", error);
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
          <TouchableOpacity className="absolute left-0 ml-5" onPress={() => router.back()}>
          <Image source={require("../assets/arrow.png")}  className="w-9 h-7"/>
     
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
                onPress={() => setGradeTab(!gradeTab)}
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
                    <Link key={prof.id} href={{
                        pathname: "/chapters",
                        params: {
                            proficiencyId: prof.id,
                            proficiencyName: prof.name,
                            },
                        }} asChild>
                    <TouchableOpacity
                      key={prof.id}
                      className="bg-white border-b border-b-black/10 mb-2 w-64 h-16 flex items-center justify-center rounded-xl"
                    >
                      <Text className="text-black font-semibold text-2xl">
                        {prof.name}
                      </Text>
                    </TouchableOpacity>
                    </Link>
                  ))}
                </ScrollView>
              )}
            </ScrollView>
          )}
        </View>
      </ImageBackground>
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
