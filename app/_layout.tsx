import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Quiz App",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          title: "Quiz",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: "Results",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
