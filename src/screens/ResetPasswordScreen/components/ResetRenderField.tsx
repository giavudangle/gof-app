import React from "react";
import { View, TextInput, TouchableWithoutFeedback } from "react-native";
import CustomText from "../../../components/UI/CustomText";
//Colors
import Colors from "../../../utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const renderField = ({
  keyboardType,
  secureTextEntry,
  icon,
  showPass,
  passIcon,
  placeholder,
  setShowPass,
  showConfirmPass,
  setshowConfirmPass,
  meta: { touched, error },
  input: { onChange, ...restInput },
} : any) => {
  return (
    <View>
      <View
        style={{
          height: 50,
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: Colors.grey,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={Colors.lighter_green}
          />
          <TextInput
            style={{
              height: 40,
              padding: 5,
              width: "80%",
              marginLeft: 10,
            }}
            placeholder={placeholder}
            keyboardType={keyboardType}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            {...restInput}
          />
          {passIcon === "pass" ? (
            <TouchableWithoutFeedback
              onPress={() => setShowPass((prev : any) => !prev)}
            >
              <MaterialCommunityIcons
                name={!showPass ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.lighter_green}
              />
            </TouchableWithoutFeedback>
          ) : passIcon === "confirm" ? (
            <TouchableWithoutFeedback
              onPress={() => setshowConfirmPass((prev : any) => !prev)}
            >
              <MaterialCommunityIcons
                name={!showConfirmPass ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.lighter_green}
              />
            </TouchableWithoutFeedback>
          ) : (
            <View />
          )}
        </View>
      </View>
      {touched && error && (
        <CustomText style={{ color: "red" }}>{error}</CustomText>
      )}
    </View>
  );
};

export default renderField;
