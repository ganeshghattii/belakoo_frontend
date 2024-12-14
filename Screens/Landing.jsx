import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import TitleComponent from "../Components/TextComponents/TitleComponent";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { Link } from "expo-router";

import useStore from "../store";
import api from "../services/api";
import authService from "../services/authService";

const Landing = () => {
  const { refreshToken } = useStore();

  const router = useRouter();

  const isLoggedIn = refreshToken !== "";

  const handleRefreshToken = async () => {
    if (refreshToken) {
      const { access } = await authService.refreshToken();
      if (access) {
        router.push("/instructions");
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <CustomSafeAreaView>
      <ImageBackground
        source={require("../assets/Landing/kids.png")}
        style={styles.background}
      />
      <View style={styles.content}>
        <View style={styles.mainContainer}>
          <View style={styles.subContainer}>
            <View
              style={styles.cardsContainer}
              className="flex flex-wrap gap-2"
            >
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/educate.png")}
                  className="h-14 w-14"
                />
                <TitleComponent titleText="Educate" />
              </View>
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/empower.png")}
                  className="h-14 w-14"
                />
                <TitleComponent titleText="Empower" />
              </View>
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/intel.png")}
                  className="h-14 w-14"
                />
                <TitleComponent titleText="Instill Curiosity" />
              </View>
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/smile.png")}
                  className="h-16 w-12"
                />
                <TitleComponent titleText="Create Smiles" />
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleRefreshToken()}
            >
              <Text style={styles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    height: "110%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  mainContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
  },
  subContainer: {
    width: "100%",
    paddingVertical: 28,
    paddingHorizontal: 14,
    flexDirection: "column",
    gap: 15,
    borderRadius: 15,
  },
  cardsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  card: {
    width: "45%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    gap: 4,
  },
  loginButton: {
    backgroundColor: "#F56E00",
    padding: 15,
    borderRadius: 25,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Landing;
