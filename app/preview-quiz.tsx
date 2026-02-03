import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { loadQuestions, loadTimer } from "./utils/storage";

export default function PreviewQuiz() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const initialize = async () => {
      const loadedQuestions = await loadQuestions();
      setQuestions(loadedQuestions);
      setAnswers(Array(loadedQuestions.length).fill(null));
      const loadedTimer = await loadTimer();
      setTimer(loadedTimer);
      setTimeLeft(loadedTimer);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleSelect = (choice: string) => {
    const updated = [...answers];
    updated[current] = choice;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach((a: string | null, i: number) => {
      if (a === questions[i].answer) score++;
    });

    router.push({
      pathname: "/result",
      params: { score },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time Left: {formatTime(timeLeft)}</Text>
      <Text style={styles.question}>{questions[current].question}</Text>

      {Object.entries(questions[current].choices).map(([key, choice]) => (
        <TouchableOpacity
          key={key}
          style={[styles.option, answers[current] === key && styles.selected]}
          onPress={() => handleSelect(key)}
        >
          <Text>
            {key}: {String(choice || "")}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttons}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          disabled={current === 0}
        />
        <Button
          title={current === questions.length - 1 ? "Finish" : "Next"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: "#d0ebff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
