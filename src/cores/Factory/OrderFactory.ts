import axios from "axios";
import { CANCEL_ORDER_SUCCESSFUL, ORDER_FAILURE, ORDER_LOADING } from "../../@types/orderActionTypes";
import { PURCHASE_TYPE } from "../../enums";
import { ThunkDispatchType } from "../../store";
import { API_URL } from "../../utils/Config";
import { predictTimeoutPromise } from "../../utils/Tools";

export interface IOrder{
  purchase(items : any,deliveryName : string,total : any,fullAddress : string,deliveryPhone : any): any,
  injectToken(token? : object) : any
}
class PurchaseOrderByCash implements IOrder{
  private token = {}
  injectToken() {
    this.token = {}
  }
  purchase(items: any, deliveryName: string, total: any, fullAddress: string, deliveryPhone: any) {
    return async (dispatch : ThunkDispatchType, getState : any) => {
      dispatch({
        type: ORDER_LOADING,
      });
      const user = getState().auth.user;
      try {
        const response : any = await predictTimeoutPromise(
          axios.post(`${API_URL}/orders`, {
            token:this.token,
            orderInfo: {
              userId: user.userid,
              items,
              name : deliveryName,
              totalAmount:total,
              address: fullAddress,
              phone : deliveryPhone,
              paymentMethod : PURCHASE_TYPE.COD,
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
  }
 

}

class PurchaseOrderByStripe implements IOrder {
  private token : object
  injectToken(token?: object) {
    this.token = token!
  }
  purchase(items: any, deliveryName: string, total: any, fullAddress: string, deliveryPhone: any) {
    return async (dispatch : ThunkDispatchType, getState : any) => {
      dispatch({
        type: ORDER_LOADING,
      });
      const user = getState().auth.user;
      try {
        const response : any = await predictTimeoutPromise(
          axios.post(`${API_URL}/orders`, {
            token: this.token,
            orderInfo: {
              userId: user.userid,
              items,
              name : deliveryName,
              totalAmount:total,
              address: fullAddress,
              phone : deliveryPhone,
              paymentMethod : PURCHASE_TYPE.CC,
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
  }
  

}

class OrderFactory {
  public static getPurchaseMethod(method : PURCHASE_TYPE){
    switch(method){
      case PURCHASE_TYPE.COD :
        return new PurchaseOrderByCash();
      case PURCHASE_TYPE.CC:
        return new PurchaseOrderByStripe();
      default:
        throw new Error("Method not implemented.");
    }
  }

}

export default OrderFactory

