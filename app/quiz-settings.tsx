import { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    loadQuestions,
    loadTimer,
    Question,
    saveQuestions,
    saveTimer,
} from "./utils/storage";

export default function QuizSettings() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState(300);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    type: "multiple",
    question: "",
    choices: { A: "", B: "", C: "", D: "" },
    answer: "",
  });

  useEffect(() => {
    const initialize = async () => {
      const loadedQuestions = await loadQuestions();
      setQuestions(loadedQuestions);
      const loadedTimer = await loadTimer();
      setTimer(loadedTimer);
    };
    initialize();
  }, []);

  const handleSaveTimer = async () => {
    await saveTimer(timer);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setNewQuestion({
      id: questions.length + 1,
      type: "multiple",
      question: "",
      choices: { A: "", B: "", C: "", D: "" },
      answer: "",
    });
    setModalVisible(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({ ...question });
    setModalVisible(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    await saveQuestions(updated);
  };

  const handleSaveQuestion = async () => {
    let updatedQuestions;
    if (editingQuestion) {
      updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? newQuestion : q,
      );
    } else {
      updatedQuestions = [...questions, newQuestion];
    }
    setQuestions(updatedQuestions);
    await saveQuestions(updatedQuestions);
    setModalVisible(false);
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.questionItem}>
      <Text style={styles.questionText}>{item.question}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditQuestion(item)}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteQuestion(item.id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Settings</Text>

      <Text style={styles.label}>Timer (seconds):</Text>
      <TextInput
        style={styles.input}
        value={timer.toString()}
        onChangeText={(text) => setTimer(parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <Button title="Save Timer" onPress={handleSaveTimer} />

      <Text style={styles.label}>Questions:</Text>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <Button title="Add Question" onPress={handleAddQuestion} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {editingQuestion ? "Edit Question" : "Add Question"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Question"
            value={newQuestion.question}
            onChangeText={(text) =>
              setNewQuestion({ ...newQuestion, question: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Choice A"
            value={newQuestion.choices.A}
            onChangeText={(text) =>
              setNewQuestion({
                ...newQuestion,
                choices: { ...newQuestion.choices, A: text },
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Choice B"
            value={newQuestion.choices.B}
            onChangeText={(text) =>
              setNewQuestion({
                ...newQuestion,
                choices: { ...newQuestion.choices, B: text },
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Choice C"
            value={newQuestion.choices.C}
            onChangeText={(text) =>
              setNewQuestion({
                ...newQuestion,
                choices: { ...newQuestion.choices, C: text },
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Choice D"
            value={newQuestion.choices.D}
            onChangeText={(text) =>
              setNewQuestion({
                ...newQuestion,
                choices: { ...newQuestion.choices, D: text },
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Answer"
            value={newQuestion.answer as string}
            onChangeText={(text) =>
              setNewQuestion({ ...newQuestion, answer: text })
            }
          />
          <View style={styles.modalButtons}>
            <Button title="Save" onPress={handleSaveQuestion} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  questionItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  edit: {
    color: "blue",
  },
  delete: {
    color: "red",
  },
  modal: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
