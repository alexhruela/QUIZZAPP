import AsyncStorage from "@react-native-async-storage/async-storage";
import { questions as defaultQuestions } from "../../questions";

export interface Question {
  id: number;
  type: string;
  question: string;
  choices: { [key: string]: string | undefined };
  answer: string | string[];
}

export const initializeStorage = async () => {
  const storedQuestions = await AsyncStorage.getItem("questions");
  if (!storedQuestions) {
    await AsyncStorage.setItem("questions", JSON.stringify(defaultQuestions));
  }

  const storedTimer = await AsyncStorage.getItem("quizTimer");
  if (!storedTimer) {
    await AsyncStorage.setItem("quizTimer", "300"); // 5 minutes default
  }
};

export const loadQuestions = async (): Promise<Question[]> => {
  const stored = await AsyncStorage.getItem("questions");
  return stored ? JSON.parse(stored) : defaultQuestions;
};

export const saveQuestions = async (questions: Question[]) => {
  await AsyncStorage.setItem("questions", JSON.stringify(questions));
};

export const loadTimer = async (): Promise<number> => {
  const stored = await AsyncStorage.getItem("quizTimer");
  return stored ? parseInt(stored, 10) : 300;
};

export const saveTimer = async (timer: number) => {
  await AsyncStorage.setItem("quizTimer", timer.toString());
};
