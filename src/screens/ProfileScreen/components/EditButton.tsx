import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../../utils/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
//PropTypes check

export const EditButton = ({ navigation, user } : any) => {
  return (
    <View style={styles.editButton}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProfileEdit", { user })}
      >
        <FontAwesome5 name='user-edit' size={20} color={Colors.leave_green} />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  editButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
});
