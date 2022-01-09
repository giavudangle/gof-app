import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
//Text
import CustomText from "../../../../components/UI/CustomText";
//PropTypes check

const SearchItem = ({ item, navigation } : any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { item })}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Ionicons
          name='ios-search'
          size={22}
          color={Colors.grey}
          style={{ marginRight: 20 }}
        />
        <Image style={styles.image} source={{ uri: item.thumb }} />
        <CustomText style={styles.name}>{item.title}</CustomText>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_grey,
    justifyContent: "center",
  },
  image: {
    height: 80,
    width: 70,
    resizeMode:'cover',
    borderRadius: 10,
    marginRight: 30,
    
  },
  name:{
    width:200 // this style will break item into another line

  }
});

export default SearchItem