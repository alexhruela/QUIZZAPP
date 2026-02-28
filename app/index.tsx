import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    loadHighestScore();
  }, []);

  const loadHighestScore = async () => {
    try {
      const saved = await AsyncStorageLib.getItem("highestScore");
      if (saved) {
        setHighestScore(parseInt(saved, 10));
      }
    } catch (error) {
      console.error("Error loading highest score:", error);
    }
  };

  const handleStartQuiz = () => {
    router.push("/quiz");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Quiz App</Text>
        <Text style={styles.subtitle}>Test your knowledge!</Text>

        {highestScore > 0 && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Highest Score</Text>
            <Text style={styles.scoreValue}>{highestScore}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleStartQuiz}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  scoreContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
