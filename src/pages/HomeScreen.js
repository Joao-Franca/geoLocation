import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  const handleStart = () => {
    navigation.navigate("MainTabs"); // Navega para o MainTabs
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Geonnect.png")}
        style={styles.logo}
      />
      <LinearGradient colors={["#386E16", "#097EC3"]} style={styles.button}>
        <TouchableOpacity onPress={handleStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  logo: {
    width: 353,
    height: 116,
    marginBottom: 60,
  },
  button: {
    height: 53,
    width: 150,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    backgroundColor: "#0361AB",
    elevation: 3,
    
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
  },
});
