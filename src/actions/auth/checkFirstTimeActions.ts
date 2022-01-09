import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThunkDispatchType } from 'store';

import {IS_FIRST_TIME,FIRST_OPEN,FIRST_TIME_OPEN_VALUE} from '../../@types/firstTimeOpenActionTypes'


//Check first Open
export const firstOpen =  () => {
  return async (dispatch : ThunkDispatchType) => {
   await AsyncStorage.setItem(IS_FIRST_TIME,JSON.stringify(FIRST_TIME_OPEN_VALUE))
    dispatch({
      type: FIRST_OPEN,
    })
  }
};
