import React from "react";
import { View, Text, Button, ImageBackground } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1503264116251-35a269479413" }}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      resizeMode="cover"
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "85%",
          borderRadius: 20,
          padding: 25,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: "#fff",
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Welcome !
        </Text>

        <Text
          style={{
            color: "#dcdcdc",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          Sign in to explore your profile or create a new account below.
        </Text>

        <View style={{ width: "100%", marginBottom: 10 }}>
          <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
        </View>
        <View style={{ width: "100%" }}>
          <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
        </View>
      </View>
    </ImageBackground>
  );
}
