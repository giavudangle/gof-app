import { API_URL } from '../../utils/Config'
import { predictTimeoutPromise } from '../../utils/Tools'
import { ORDER_FAILURE, ORDER_LOADING, FETCH_ORDER,CANCEL_ORDER_SUCCESSFUL } from '../../@types/orderActionTypes'
import axios from 'axios';
import { ThunkDispatchType } from '../../store';
/**
|--------------------------------------------------
| Fetch Order
|--------------------------------------------------
*/
export const fetchOrder = () => {
  return async (dispatch: ThunkDispatchType, getState : any) => {
    dispatch({
      type: ORDER_LOADING,
    });
    const user = getState().auth.user;
    if (user.userid == undefined) {
      return;
    }
    try {
      const response : any = await predictTimeoutPromise(
        axios.get(`${API_URL}/orders`,{
          headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          }
        })
      )

      if (response.status!==200) {
        dispatch({
          type: ORDER_FAILURE,
        });
        throw new Error("Something went wrong! Can't get your order");
      }
   
      const resData = response.data.data
      const filterUserOrder = resData.filter(
        (userOrder : any) => userOrder.userId._id === user.userid
      );
      dispatch({
        type: FETCH_ORDER,
        orderData: filterUserOrder,
      });
    } catch (err) {
      throw err;
    }
  };
};

/**
|--------------------------------------------------
| Create New Order (Add Order)
|--------------------------------------------------
*/
export const createOrder = (
  chargeToken : any,
  summaryOrders: any,
  name: any,
  totalAmount: any,
  paymentMethod: any,
  fullAddress: any,
  phone: any
) => {
  return async (dispatch: ThunkDispatchType, getState : any) => {
    dispatch({
      type: ORDER_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response : any = await predictTimeoutPromise(
        axios.post(`${API_URL}/orders`, {
          token: chargeToken,
          orderInfo: {
            userId: user.userid,
            items: summaryOrders,
            name,
            totalAmount,
            address: fullAddress,
            phone,
            paymentMethod,
          }
        }, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          }
        })
      )
      if (response.status !== 200) {
        dispatch({
          type: ORDER_FAILURE,
        });
        throw new Error("Something went wrong when create new order!");
      }
      dispatch({
        type: CANCEL_ORDER_SUCCESSFUL,
      });
    } catch (err) {
      throw err;
    }
  };
};


export const cancelOrder = (
 orderId : any
) => {
  return async (dispatch : ThunkDispatchType, getState : any) => {
    dispatch({
      type: ORDER_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response : any = await predictTimeoutPromise(
        axios.delete(`${API_URL}/orders/${orderId}`, {  
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          }
        })
      )
      if (response.status !== 200) {
        dispatch({
          type: ORDER_FAILURE,
        });
        throw new Error("Something went wrong when cancel order!");
      }
      dispatch({
        type: CANCEL_ORDER_SUCCESSFUL,
        payload: orderId,
      });
    } catch (err) {
      throw err;
    }
  };
};

