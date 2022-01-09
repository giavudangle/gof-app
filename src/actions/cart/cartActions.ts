import { API_URL } from "../../utils/Config";
import { predictTimeoutPromise } from "../../utils/Tools";

import {CART_FAILURE,CART_LOADING,DES_CART_QUANTITY,FETCH_CART,INC_CART_QUANTITY,REMOVE_FROM_CART,RESET_CART} from '../../@types/cartActionTypes'
import { ThunkDispatchType } from "../../store";

//Fetch Cart
export const fetchCart = () => {
  return async (dispatch :ThunkDispatchType, getState : any) => {
    const user = getState().auth.user;
    
    const emptyCart = {
      items: [],
    };
    if (user.userid != undefined) {
      dispatch({
        type: CART_LOADING,
      });
      try {
        const response : any = await predictTimeoutPromise(
          fetch(`${API_URL}/carts`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "auth-token": user.token,
            },
            method: "GET",
          })
        );
        if (!response.ok) {
          dispatch({
            type: CART_FAILURE,
          });
          throw new Error("Something went wrong!, can't get your carts");
        }
        const resData = await response.json();
        const filterUserCart = resData.data.filter(
          (userCart :any) => userCart.userId === user.userid
        );
        let carts = emptyCart;
        if (filterUserCart.length > 0) {
          carts = filterUserCart[0];
        }
        dispatch({
          type: FETCH_CART,
          carts,
        });
      } catch (err) {
        throw err;
      }
    }
    return;
  };
};
//Add Add to Cart
export const addToCart = (item : any) => {
  return async (dispatch : ThunkDispatchType, getState : any) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response : any = await predictTimeoutPromise(
        fetch(`${API_URL}/carts`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          },
          method: "POST",
          body: JSON.stringify({
            userId: user.userid,
            items: [
              {
                item: item._id,
                quantity: 1,
              },
            ],
          }),
        })
      );
      if (!response.ok) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      }
      dispatch({
        type: "ADD_CART",
        cartItem: item,
      });
    } catch (err) {
      throw err;
    }
  };
};

//Remove from Cart
export const removeFromCart = (cartId: any, itemId: any) => {
  return async (dispatch : ThunkDispatchType, getState: any) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response: any = await predictTimeoutPromise(
        fetch(`${API_URL}/carts/cart-item/${cartId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          },
          method: "DELETE",
          body: JSON.stringify({
            item: itemId,
          }),
        })
      );
      if (!response.ok) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      }
      dispatch({
        type: REMOVE_FROM_CART,
        itemId,
      });
    } catch (err) {
      throw err;
    }
  };
};
//Decrease cart quantity
export const updateQuantity = (cartId: any, itemId: any,command : string) => {
  return async (dispatch:ThunkDispatchType, getState: any) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response: any = await predictTimeoutPromise(
        fetch(`${API_URL}/carts/${cartId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          },
          method: "PUT",
          body: JSON.stringify({
            item: itemId,
            quantity: command
          }),
        })
      );
      if (!response.ok) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      }
      if(command ==="decrease"){
        dispatch({
          type: DES_CART_QUANTITY,
          cartItemId: itemId,
        });
      } else {
        dispatch({
          type: INC_CART_QUANTITY,
          cartItemId: itemId,
        });
      }

    } catch (err) {
      throw err;
    }
  };
};

//Reset Cart
export const resetCart = (cartId: any) => {
  return async (dispatch : ThunkDispatchType, getState: any) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const response: any = await predictTimeoutPromise(
        fetch(`${API_URL}/carts/${cartId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          },
          method: "DELETE",
        })
      );
      if (!response.ok) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: RESET_CART,
      });
    } catch (err) {
      throw err;
    }
  };
};
