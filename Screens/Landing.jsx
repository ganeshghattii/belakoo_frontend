import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import * as Asset from "expo-asset";

import DescriptionComponent from "../Components/TextComponents/DescriptionComponent";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient from expo-linear-gradient
import TitleComponent from "../Components/TextComponents/TitleComponent";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import { Link, useRouter } from "expo-router";

const Landing = () => {
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
                <TitleComponent titleText="Educate" />
              </View>
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/intel.png")}
                  className="h-14 w-14"
                />
                <TitleComponent titleText="  Instil Curiosity" />
              </View>
              <View
                style={styles.card}
                className="flex items-center justify-center h-40"
              >
                <Image
                  source={require("../assets/Landing/smile.png")}
                  className="h-16 w-12"
                />
                <TitleComponent titleText=" Create Smiles" />
              </View>
            </View>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>
            </Link>
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
    height: "100vh",
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
  logo: {
    width: 165,
    height: 60,
    resizeMode: "contain",
    marginTop: 20,
    marginLeft: 10,
  },
  mainContainer: {
    width: "100%",
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  illustration: {
    resizeMode: "contain",
    marginLeft: "10%",
    width: "90%",
    height: "45%",
    marginBottom: 0,
  },
  subContainer: {
    width: "100%",
    bottom: 0,
    zIndex: 1,

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
  cardLink: {
    fontSize: 14,
    color: "#740000",
    fontWeight: "700",
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
  loginText: {
    color: "#740000",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Landing;
