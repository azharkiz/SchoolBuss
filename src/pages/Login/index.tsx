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
  Image,
  ImageStyle
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
  logo: ImageStyle,
}

const Login: React.FC = () => {
  const screenContext = useScreenContext();
  const { setIsLoggedIn } = useAuthCheck();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
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
          <Image
            source={require("../../assets/schoolbus.jpg")} // or use a remote URI: { uri: "https://example.com/logo.png" }
            style={screenStyles.logo}
            resizeMode="contain"
          />
          <Text style={screenStyles.titleHead}>SchoolBuss</Text>
          {/* <Text style={screenStyles.titleHeadDec}>
            Please login with your credemtials
          </Text> */}

          <TextInput
            style={screenStyles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={Colors.name.DarkTextGray}
          />
          <TextInput
            style={screenStyles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholderTextColor={Colors.name.DarkTextGray}
            secureTextEntry
          />

          {error ? <Text style={screenStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={screenStyles.button} onPress={handleLogin}>
            <Text style={screenStyles.buttonText}>
              {isSubmitting ? "loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity>
            <Text style={screenStyles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (screenContext: any, width: number, height: number): Styles =>
  StyleSheet.create<Styles>({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.name.yellow,
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
    logo: {
        width: 80,
        height: 80,
      },
    titleHead: {
      fontSize: 26,
      fontWeight: "bold",
      color: Colors.name.black,
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
      backgroundColor: Colors.name.yellow,
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
      color: "#000",
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

export default Login;
