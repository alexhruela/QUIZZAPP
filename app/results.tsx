import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type RouteParams = {
  currentScore?: number;
  correctAnswers?: number;
  totalQuestions?: number;
};

export default function ResultsScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [highestScore, setHighestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const params = searchParams as unknown as RouteParams;
  const currentScore = params?.currentScore ?? 0;
  const correctAnswers = params?.correctAnswers ?? 0;
  const totalQuestions = params?.totalQuestions ?? 0;

  useEffect(() => {
    loadHighestScore();
  }, []);

  const loadHighestScore = async () => {
    try {
      const saved = await AsyncStorageLib.getItem("highestScore");
      if (saved) {
        const highestValue = parseInt(saved, 10);
        setHighestScore(highestValue);
        setIsNewRecord(currentScore > highestValue);
      }
    } catch (error) {
      console.error("Error loading highest score:", error);
    }
  };

  const handleRetakeQuiz = () => {
    router.replace("/quiz");
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return "🎉 Excellent!";
    if (score >= 75) return "👏 Great Job!";
    if (score >= 60) return "✅ Good!";
    if (score >= 50) return "💪 Keep Learning!";
    return "📚 Try Again!";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "#34C759";
    if (score >= 75) return "#007AFF";
    if (score >= 60) return "#FF9500";
    return "#FF3B30";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Quiz Complete!</Text>

        {isNewRecord && (
          <View style={styles.newRecordBanner}>
            <Text style={styles.newRecordText}>🏆 New Personal Record!</Text>
          </View>
        )}

        <View
          style={[
            styles.scoreCard,
            { borderBottomColor: getScoreColor(currentScore) },
          ]}
        >
          <Text style={styles.scoreMessage}>
            {getScoreMessage(currentScore)}
          </Text>
          <Text
            style={[
              styles.currentScore,
              { color: getScoreColor(currentScore) },
            ]}
          >
            {currentScore}%
          </Text>
          <Text style={styles.scoreDetails}>
            {correctAnswers} out of {totalQuestions} questions correct
          </Text>
        </View>

        <View style={styles.scoreComparisonContainer}>
          <View style={styles.scoreComparisonCard}>
            <Text style={styles.scoreComparisonLabel}>Current Score</Text>
            <Text style={styles.scoreComparisonValue}>{currentScore}%</Text>
          </View>
          <View style={styles.scoreComparisonCard}>
            <Text style={styles.scoreComparisonLabel}>Highest Score</Text>
            <Text style={styles.scoreComparisonValue}>{highestScore}%</Text>
          </View>
        </View>

        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Results Breakdown</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Correct Answers:</Text>
            <Text style={styles.breakdownValue}>{correctAnswers}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Wrong Answers:</Text>
            <Text style={styles.breakdownValue}>
              {totalQuestions - correctAnswers}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Total Questions:</Text>
            <Text style={styles.breakdownValue}>{totalQuestions}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Accuracy:</Text>
            <Text style={styles.breakdownValue}>{currentScore}%</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoHome}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRetakeQuiz}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>Retake Quiz</Text>
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
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  newRecordBanner: {
    backgroundColor: "#FFD60A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  scoreCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreMessage: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  currentScore: {
    fontSize: 56,
    fontWeight: "700",
    marginBottom: 8,
  },
  scoreDetails: {
    fontSize: 14,
    color: "#666",
  },
  scoreComparisonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  scoreComparisonCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreComparisonLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  scoreComparisonValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
  },
  breakdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#666",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
