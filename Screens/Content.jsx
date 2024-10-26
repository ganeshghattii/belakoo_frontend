import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomSafeAreaView from "../Components/CustomSafeAreaView";
import api from "../services/api";
import Toast from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons';

const Content = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lessonId, lessonCode } = params;
  const [lessonData, setLessonData] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLessonDetails();
  }, []);

  const fetchLessonDetails = async () => {
    try {
      const response = await api.get(`/api/lessons/${lessonCode}/`);
      setLessonData(response.data);
      setIsDone(response.data.is_done);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Requested URL:", error.config?.url);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load lesson details. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleMarkDone = async () => {
    setShowPopup(true);
  };

  const confirmMarkDone = async () => {
    try {
      const endpoint = isDone ? "mark-not-done" : "mark-done";
      await api.post(`/api/lessons/${lessonId}/${endpoint}/`);
      setIsDone(!isDone);

      setShowPopup(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Lesson marked as ${isDone ? "not done" : "done"}.`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error marking lesson:", error);
      setShowPopup(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update lesson status. Please try again.",
        position: "bottom",
      });
    }
  };

  const renderSection = (title, content) => {
    if (content && typeof content === 'string' && content.trim() !== '') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionContent}>{content}</Text>
        </View>
      );
    }
    return null;
  };

  const renderJsonSection = (title, content) => {
    if (content && typeof content === 'object' && Object.keys(content).length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {Object.entries(content).map(([key, value]) => (
            <View key={key} style={styles.jsonItem}>
              <Text style={styles.jsonKey}>{key}:</Text>
              <Text style={styles.jsonValue}>{value}</Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#740000" />
      </View>
    );
  }

  if (!lessonData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load lesson data. Please try again.</Text>
        <TouchableOpacity onPress={fetchLessonDetails} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CustomSafeAreaView>
      <ImageBackground
        source={require("../assets/Content/bg.png")}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#740000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.markButton, isDone && styles.markButtonDone]}
              onPress={handleMarkDone}
            >
              <Text style={styles.markButtonText}>
                {isDone ? "Mark as not done" : "Mark as done"}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.lessonTitle}>{lessonData.name || 'Untitled Lesson'}</Text>
            {renderSection("Objective", lessonData.objective)}
            {renderSection("Duration", lessonData.duration)}
            {renderSection("Specific Learning Outcome", lessonData.specific_learning_outcome)}
            {renderSection("Behavioural Outcome", lessonData.behavioural_outcome)}
            {renderSection("Materials Required", lessonData.materials_required)}
            {renderJsonSection("Activate", lessonData.activate)}
            {renderJsonSection("Acquire", lessonData.acquire)}
            {renderJsonSection("Apply", lessonData.apply)}
            {renderJsonSection("Assess", lessonData.assess)}
          </ScrollView>
        </View>
      </ImageBackground>
      <Modal
        transparent={true}
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
        animationType="fade"
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Confirm Action</Text>
            <Text style={styles.popupText}>
              Are you sure you want to mark this lesson as {isDone ? "not done" : "done"}?
            </Text>
            <View style={styles.popupButtonContainer}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={confirmMarkDone}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 5,
  },
  markButton: {
    backgroundColor: '#740000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 2,
  },
  markButtonDone: {
    backgroundColor: '#4CAF50',
  },
  markButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#740000',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#740000',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  jsonItem: {
    marginBottom: 10,
  },
  jsonKey: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#740000',
  },
  jsonValue: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#740000',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  popupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#740000',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  retryButton: {
    backgroundColor: '#740000',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Content;
