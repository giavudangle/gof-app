import React, { useState, useEffect, useRef } from "react";

import { View, StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
//Redux
import { useDispatch } from "react-redux";
//Action
import { EditButton, ProfilePic, ProfileBody } from "./components";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
//Loader
import Loader from "../../components/Loaders/Loader";

import Colors from '../../utils/Colors'

import {AntDesign} from '@expo/vector-icons'
import { EditPassword } from "./components/EditPassword";
import { useAppSelector } from "../../store";
import UserSingleton from "../../cores/Singleton/UserSingleton";

const { width, height } = Dimensions.get("window");

export const ProfileScreen = (props : any) => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.isLoading);
  const [imageUri, setImageUri] = useState("");
  const [filename, setFilename] = useState("");
  const [type, setType] = useState("");
  const [uploadButton, setUploadButton] = useState(true);

  const dispatch = useDispatch();
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const UploadProfile = async () => {
    try {
      const instance = UserSingleton.getInstance();
      await dispatch(instance.uploadPicture(imageUri,filename,type))
      setUploadButton(true);
      if (!unmounted.current) {
        Alert.alert("Cập nhật", "Cập nhật thành công", [
          {
            text: "Ok",
          },
        ]);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        <TouchableOpacity style={{ zIndex: 99 }} onPress={() => props.navigation.goBack()}>
          <AntDesign style={{ top: 40, right: 320, position: 'absolute' }} name='arrowleft' size={30} color='white' />
        </TouchableOpacity>
        <View style={styles.header}>
        </View>
        {loading ? <Loader /> : <></>}
        <View style={styles.profileContainer}>

          <View style={styles.profileBox}>
            <EditButton navigation={props.navigation} user={user} />
            <EditPassword navigation={props.navigation} user={user}/>
            <ProfilePic
              user={user}
              imageUri={imageUri}
              setImageUri={setImageUri}
              setType={setType}
              setFilename={setFilename}
              setUploadButton={setUploadButton}
            />
            <ProfileBody
              user={user}
              uploadButton={uploadButton}
              setUploadButton={setUploadButton}
              setImageUri={setImageUri}
              loading={loading}
              UploadProfile={UploadProfile}
            />
          </View>
        </View>
      </View>
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width,
    flexDirection: "row",
    height: 0.15 * height,
    justifyContent: "center",
    backgroundColor: Colors.primary
  },
  profileContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  profileBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width,
    alignItems: "center",
  },
});
