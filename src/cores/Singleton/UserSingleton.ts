import { AUTH_FAILURE, AUTH_LOADING, EDIT_INFO, FORGET_PASSWORD, LOGIN, LOGOUT, RESET_PASSWORD, SIGN_UP, UPLOAD_PROFILEPIC } from "../../@types/authActionTypes"
import axios from "axios"
import { Alert,  } from "react-native"
import { ThunkDispatchType } from "../../store"
import { API_URL } from "../../utils/Config"
import { predictTimeoutPromise } from "../../utils/Tools"
import AskingExpoToken from '../../components/Notification/AskingNotificationPermisson';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Network from 'expo-network';

interface IUserModel {
  login(email : string, password : string) : any,
  register(name : string,email : string, password : string) : any,
  resetPassword(password : string,url : any) : any,
  forgetPassword(email : string) : any
  updatePassword(password : string) : any,
  uploadPicture(imageUri : string,fileName : string,type: any) : any,
  updateInformation(  phone: string,address : string,name : string) : any,
  logout():any
}




class UserSingleton implements IUserModel {
  private timer : any;
  private static _instance: UserSingleton
  private constructor(){
  }

  public static getInstance(): UserSingleton {
    if(!UserSingleton._instance){
      UserSingleton._instance = new UserSingleton();
    }
    return UserSingleton._instance;
  }

  clearLogoutTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  setLogoutTimer = (expirationTime : any) => {
    return (dispatch : ThunkDispatchType) => {
      this.timer = setTimeout(async () => {
        await dispatch(this.logout() as any);
        alert('Logout section expired');
      }, expirationTime);
    };
  };
  
  public login(email: string, password: string) {
    return async (dispatch : ThunkDispatchType) => {
      dispatch({
        type: AUTH_LOADING,
      });
      const pushToken = await AskingExpoToken();
      try {

        const response : any = await predictTimeoutPromise(
          axios.post(`${API_URL}/users/login`, {
            email,
            password,
            pushTokens: [pushToken],
          },{
            headers:{
              "Access-Control-Allow-Origin": "*",
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          }),
        );
        if (response.status !== 200) {
          dispatch({
            type: AUTH_FAILURE,
          });
          Alert.alert('Thất Bại','Sai email hoặc mật khẩu')
        }
        const resData = response.data
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            resData
          }),
        );
      
        /**
        |--------------------------------------------------
        | AUTO LOGOUT
        |--------------------------------------------------
        */
        //dispatch(setLogoutTimer(3000)); // 15 seconds for testing
        dispatch(this.setLogoutTimer(60 * 60 * 1000 * 1000)); // 1h = 60m * 60s
        dispatch({
          type: LOGIN,
          user: resData,
        });
      } catch (err) {
        dispatch({
          type:AUTH_FAILURE
        })
        Alert.alert('Thất Bại','Sai email hoặc mật khẩu')
  
      }
    };
  }
  register(name :string,email: string, password: string) {
    return async (dispatch : ThunkDispatchType) => {
      dispatch({
        type: AUTH_LOADING,
      });
      try {

        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/users/register`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }),
        );
        if (!response.ok  ) {
          dispatch({
            type: AUTH_FAILURE,
          });
          alert('Email đã tồn tại trên hệ thống')
        }
        dispatch({
          type: SIGN_UP,
        });
      } catch (err) {
        Alert.alert('Thất Bại','Email đã tồn tại trên hệ thống')
      }
    };
  }
  //#region ResetPassword
  resetPassword(password: string, url: any) {
    return async (dispatch : ThunkDispatchType) => {
      dispatch({
        type: AUTH_LOADING,
      });
      try {
        const response : any = await predictTimeoutPromise(
          fetch(
            `${API_URL}/users/receive_new_password/${url.userid}/${url.token}`,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify({
                password,
              }),
            },
          ),
        );
        if (!response.ok) {
          const errorResData = await response.json();
          dispatch({
            type: AUTH_FAILURE,
          });
          throw new Error(errorResData.err);
        }
        dispatch({
          type: RESET_PASSWORD,
        });
      } catch (err) {
        throw err;
      }
    };
  }
  //#endregion

  //#region ForgetPassword
  forgetPassword(email: string) {
    return async (dispatch : ThunkDispatchType) => {
      dispatch({
        type: AUTH_LOADING,
      });
      
      try {
        const client_ip = await Network.getIpAddressAsync()
  
        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/users/reset_password`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              email,
              client_ip 
            }),
          }),
        );
        if (!response.ok) {
          const errorResData = await response.json();
          dispatch({
            type: AUTH_FAILURE,
          });
          throw new Error(errorResData.err);
        }
        dispatch({
          type: FORGET_PASSWORD,
        });
      } catch (err) {
        throw err;
      }
    };
  }
  //#endregion

  uploadPicture(imageUri: string, fileName: string, type: any) {
    return async (dispatch : ThunkDispatchType, getState : any) => {
      dispatch({
        type: AUTH_LOADING,
      });
      const user = getState().auth.user;
      let formData = new FormData();
      // Infer the type of the image
      formData.append('profile', {
        uri: imageUri,
        name: fileName,
        type,
      } as any);
      try {
        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/users/photo/${user.userid}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'auth-token': user.token,
            },
            method: 'PATCH',
            body: formData,
          }),
        );
        if (!response.ok) {
          const errorResData = await response.json();
          dispatch({
            type: AUTH_FAILURE,
          });
          throw new Error(errorResData.err);
        }
  
        dispatch({
          type: UPLOAD_PROFILEPIC,
          profilePic: imageUri,
        });
      } catch (err) {
        throw err;
      }
    };
  }
  updateInformation(phone: string, address: string, name: string) {
    return async (dispatch : ThunkDispatchType,getState : any) => {
      const user = getState().auth.user;
      dispatch({
        type: AUTH_LOADING,
      });
      try {
        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/users/${user.userid}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'auth-token': user.token,
            },
            method: 'PATCH',
            body: JSON.stringify({
              phone,
              address,
              name
            }),
          }),
        );
        if (!response.ok) {
          const errorResData = await response.json();
          dispatch({
            type: AUTH_FAILURE,
          });
          Error(errorResData.err);
        }
  
        dispatch({
          type: EDIT_INFO,
          phone,
          address,
          name
        });
      } catch (err) {
        throw err;
      }
    };
  }

  updatePassword(password : string) {
    return async (dispatch : ThunkDispatchType, getState : any) => {
      const user = getState().auth.user;
      dispatch({
        type: AUTH_LOADING,
      });
      try {
        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/users/update-password/${user.userid}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'auth-token': user.token,
            },
            method: 'PATCH',
            body: JSON.stringify({
              newPassword : password
            }),
          }),
        );
        if (!response.ok) {
          const errorResData = await response.json();
          dispatch({
            type: AUTH_FAILURE,
          });
          Error(errorResData.err);
        }
  
        dispatch({
          type: LOGOUT,
        });
      } catch (err) {
        throw err;
      }
    };
  }
  
  public logout(){
    return (dispatch : ThunkDispatchType) => {
      this.clearLogoutTimer(); 
      AsyncStorage.removeItem('user');  
      dispatch({
        type: LOGOUT,
        user: {},
      });
    };
  }
}

export default UserSingleton;


