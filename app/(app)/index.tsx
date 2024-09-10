import { Text, View } from "react-native";

import { useSession } from "../../ctx";

export default function Index() {
  const { signOut, session, username, userId } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Session: {session}</Text>
      <Text>Username: {username}</Text>
      <Text>User ID: {userId}</Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
