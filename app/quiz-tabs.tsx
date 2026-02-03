import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PreviewQuiz from "./preview-quiz";
import QuizSettings from "./quiz-settings";

const Tab = createBottomTabNavigator();

export default function QuizTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Preview Quiz" component={PreviewQuiz} />
      <Tab.Screen name="Quiz Settings" component={QuizSettings} />
    </Tab.Navigator>
  );
}
