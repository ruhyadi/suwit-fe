import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();

  const login = async () => {
    const response = await onLogin!(username, password);
    console.log(response);
    if (response && response.error) {
      alert(response.msg);
    }
  };

  const register = async () => {
    const response = await onRegister!(username, password);
    if (response && response.error) {
      alert(response.msg);
    } else {
      login();
    }
  };

  return (
    <View>
      <View>
        <TextInput
          placeholder="Username"
          onChangeText={(text: string) => setUsername(text)}
          value={username}
        ></TextInput>
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
        ></TextInput>
        <Button onPress={login} title="Login"></Button>
        <Button onPress={register} title="Register"></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
