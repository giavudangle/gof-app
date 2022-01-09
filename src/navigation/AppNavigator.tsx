import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { DrawerNavigator, IntroStackScreen } from './PookNavigator';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store'
//Modalize
import { Host } from 'react-native-portalize';
//Deep Link
import { urlRedirect } from '../utils/Tools';
import * as Linking from 'expo-linking';


//Types
import {IS_FIRST_TIME} from '../@types/firstTimeOpenActionTypes'
import { secretKey } from '../utils/Config';
import { useAppSelector } from '../store';
import UserSingleton from '../cores/Singleton/UserSingleton';


const AppNavigator = () => {
  const [value, setValue] = useState<any>(null);
  const dispatch = useDispatch();
    // Get Value connection is first time from store
  const isFirstOpen = useAppSelector((state) => state.auth!.isFirstTime);


  /**
  |--------------------------------------------------
  | Deep linking event listener
  | Listening all new url events coming from Expo
  |--------------------------------------------------
  */
  useEffect(() => {
    // listen for new url events coming from Expo
    Linking.addEventListener('url',(event : any) => {
      urlRedirect(event.url)
    })
    Linking.getInitialURL().then(urlRedirect as any);
    Linking.removeEventListener(
      'url',
      (event) => {
        urlRedirect(event.url);
      }
    );
  }, [urlRedirect]);

  const unmounted = useRef(true);

  /**
  |--------------------------------------------------
  | CHECK IS FIRST TIME OPEN APP & AUTO LOGOUT
  |--------------------------------------------------
  */

  const clearStorageDataForTesting = async () => {
    await AsyncStorage.clear(); // use this for testing
    await SecureStore.deleteItemAsync(secretKey)
  }


  const isUserHaveYet = async () => {
    const user = await AsyncStorage.getItem('user');
    if(typeof Object.keys(user as any)!=='undefined' && user!=null ) {
      const parsedUser = JSON.parse(user);
      const {email,rawPassword,expireTime} = parsedUser.resData as import('@types').IUser;
      const instance = UserSingleton.getInstance()
      if (expireTime - Date.now() < 0) {
        dispatch(instance.logout());
      } else {
        dispatch(instance.login(email,rawPassword));
      }
    }
    if(!unmounted.current) return null;
    return ;
  }  
  
  const isFirstTime = async () => {
    const firstOpen = await AsyncStorage.getItem(IS_FIRST_TIME);
    setValue(firstOpen);
    if(!unmounted.current) return null;
    return;
  };

  useEffect(() : any =>  {
    //clearStorageDataForTesting();
    isFirstTime();
    isUserHaveYet()
    return () => unmounted.current = false
  },[])


  /**
  |--------------------------------------------------
  | AUTO LOGOUT SUBSCRIPTION
  |--------------------------------------------------
  */

  return (
    <NavigationContainer ref={navigationRef as any}>
      <Host>  
        {
          (!isFirstOpen && value === null) 
          ? <IntroStackScreen />
          : <DrawerNavigator/>
        }
      </Host>
    </NavigationContainer>
  );
};

export default AppNavigator;