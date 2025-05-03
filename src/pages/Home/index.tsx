import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useAuthCheck } from "../../services/Context/AuthContext";
import { useScreenContext } from "../../services/Context";
import { Colors } from "../../thems/Colors";

// Define the form data type
interface FormData {
  email: string;
  password: string;
}

// Define styles type
interface Styles {
  container: ViewStyle;
  keyboardContainer: ViewStyle;
  cardView: ViewStyle;
  titleHead: TextStyle;
  titleHeadDec: TextStyle;
  input: TextStyle;
  errorText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  forgotPassword: TextStyle;
}

const Home = () => {
  const screenContext = useScreenContext();
  const { setIsLoggedIn } = useAuthCheck();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const screenStyles = styles(
    screenContext,
    screenContext[screenContext.isPortrait ? "windowWidth" : "windowHeight"],
    screenContext[screenContext.isPortrait ? "windowHeight" : "windowWidth"]
  );

  const handleLogin = (): void => {
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate login flow here (replace with actual logic)
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (name: keyof FormData, value: string): void => {
    setError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={screenStyles.keyboardContainer}
      >
        <View style={screenStyles.cardView}>
          <Text style={screenStyles.titleHead}>Shop Manager</Text>
          <Text style={screenStyles.titleHeadDec}>
            Manage your business with ease
          </Text>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (
  screenContext: any,
  width: number,
  height: number
): Styles => StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.name.darkBlue,
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardView: {
    width: "90%",
    padding: width * 0.05,
    backgroundColor: Colors.name.white,
    borderRadius: width * 0.04,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  titleHead: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.name.darkBlue,
    marginBottom: height * 0.008,
  },
  titleHeadDec: {
    fontSize: 14,
    color: Colors.name.darkGrey,
    marginBottom: height * 0.025,
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.name.darkGrey,
    borderRadius: 8,
    backgroundColor: Colors.name.white,
    color: Colors.name.black,
    fontSize: 16,
  },
  errorText: {
    color: Colors.name.red,
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: Colors.name.darkBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.name.darkBlue,
    textDecorationLine: "underline",
  },
});

export default Home;
