import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../context/AuthContext";

const Home = () => {
  const [user, setUser] = useState<{
    id: number | null;
    username: string | null;
  }>({ id: null, username: null });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/users/self`);
        setUser(response.data);
      } catch (e: any) {
        alert(e.message);
      }
    };
    loadUser();
  }, []);

  return (
    <View>
      <Text>{JSON.stringify(user)}</Text>
    </View>
  );
};

export default Home;
