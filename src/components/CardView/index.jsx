import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useScreenContext } from "../../services/Context";
import { Colors } from "../../thems/Colors";

const CardView = ({ 
  title,
  email, 
  role, 
  date, 
  amount, 
  category, 
  screenName, 
  icons,
  isSelected,    
  onCheckToggle,
}) => {
  const screenContext = useScreenContext();
  const screenStyles = styles(
    screenContext,
    screenContext[screenContext.isPortrait ? "windowWidth" : "windowHeight"],
    screenContext[screenContext.isPortrait ? "windowHeight" : "windowWidth"],
    screenName,
    category
  );

  return (
    <View style={[screenStyles.card]}>
   
      <View style={{ flex: 0.1, margin: 10, justifyContent: 'center', alignItems: 'center' }}>
          {/* <View style={[
            screenStyles.roundView,
            { backgroundColor: category === 'expense' ? Colors.name.darkRed : Colors.name.green }
          ]}>
            <Text style={{ fontSize: 18, color: "#fff" }}>{category === "income" ? '💰' : '💸'}</Text>
          </View> */}
       
      </View>

      <View style={{ flex: 0.6, margin: screenName === "settings" ? 0 : 5, marginLeft: screenName === "settings" ? 5 : 0, marginBottom: 9 }}>
        <Text style={screenStyles.title}>{title}</Text>
        {email && <Text style={screenStyles.description}>{email}</Text>}
        {role && <Text style={screenStyles.description}>{role}</Text>}
        {date && <Text style={screenStyles.description}>{date}</Text>}
      </View>

    </View>
  );
};

const styles = (screenContext, width, height, screenName, category) => ({
  card: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: screenName === "settings"
      ? Colors.name.lightMediumGrey
      : category === 'expense'
        ? Colors.name.lightOrange
        : Colors.name.lightBgGreen,
    borderColor: screenName === "settings"
      ? Colors.name.gray
      : category === 'expense'
        ? Colors.name.darkRed
        : Colors.name.green,
    padding: 3,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: screenName === "settings" ? 0 : 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: screenName === "settings" ? 2 : 4,
  },
  roundView: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.01,
    right: width * 0.01,
  },
});

export default CardView;
