import React from "react";
import { View, StyleSheet } from "react-native";
//Components
import { Header, ContactBody } from "./components";

export const ContactScreen = ({ navigation } : any) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ContactBody />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
