import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { questions } from "../questions";

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (choice: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: choice,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScoreAndNavigate();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScoreAndNavigate = async () => {
    let correctCount = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.answer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    setScore(percentage);

    // Save highest score
    try {
      const saved = await AsyncStorageLib.getItem("highestScore");
      const currentHighest = saved ? parseInt(saved, 10) : 0;

      if (percentage > currentHighest) {
        await AsyncStorageLib.setItem("highestScore", percentage.toString());
      }
    } catch (error) {
      console.error("Error saving highest score:", error);
    }

    // Navigate to results with parameters
    router.push({
      pathname: "/results",
      params: {
        currentScore: percentage,
        correctAnswers: correctCount,
        totalQuestions: totalQuestions,
      },
    });
  };

  const isAnswerSelected = !!userAnswers[currentQuestion.id];
  const selectedAnswer = userAnswers[currentQuestion.id];

  const choiceLabels = Object.keys(currentQuestion.choices) as Array<
    keyof typeof currentQuestion.choices
  >;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz</Text>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.choicesContainer}>
            {choiceLabels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.choiceButton,
                  selectedAnswer === label && styles.choiceButtonSelected,
                ]}
                onPress={() => handleSelectAnswer(label)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.choiceCircle,
                    selectedAnswer === label && styles.choiceCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      selectedAnswer === label && styles.choiceLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.choiceText,
                    selectedAnswer === label && styles.choiceTextSelected,
                  ]}
                >
                  {currentQuestion.choices[label]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !isAnswerSelected && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isAnswerSelected}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navButtonText,
              !isAnswerSelected && styles.navButtonTextDisabled,
            ]}
          >
            {currentQuestionIndex === totalQuestions - 1 ? "Complete" : "Next"}
          </Text>
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
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    lineHeight: 26,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  choiceButtonSelected: {
    backgroundColor: "#e7f3ff",
    borderColor: "#007AFF",
  },
  choiceCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  choiceCircleSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  choiceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  choiceLabelSelected: {
    color: "#fff",
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  choiceTextSelected: {
    fontWeight: "600",
    color: "#007AFF",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nextButton: {
    backgroundColor: "#34C759",
  },
  navButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
});
