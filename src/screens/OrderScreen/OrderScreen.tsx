import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
//Redux
import {  useDispatch } from "react-redux";
//Action
import { fetchOrder } from "../../actions/order";
import { Header, OrderBody } from "./components";

import SkeletonLoadingOrder from "../../components/Loaders/SkeletonLoadingOrder";
import { useAppSelector } from "../../store";

const { height } = Dimensions.get("window");

export const OrderScreen = ({navigation} : any) => {
  /**
  |--------------------------------------------------
  | Global State
  |--------------------------------------------------
  */
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.isLoading);

  /**
  |--------------------------------------------------
  | Action Handlers
  |--------------------------------------------------
  */
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  const loadOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchOrder());
    } catch (err : any) {
      alert(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  /**
  |--------------------------------------------------
  | Side Effects & Local State
  |--------------------------------------------------
  */

  useEffect(() => {
    loadOrders();
  }, [user.userid]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {isLoading ? (
        <View style={styles.centerLoader}>
          <SkeletonLoadingOrder />
        </View>
      ) : (
        <OrderBody
          user={user as any}
          orders={orders}
          isRefreshing={isRefreshing}
          loadOrders={loadOrders}
          navigation={navigation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerLoader: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: Platform.OS === "android" ? 70 : height < 668 ? 70 : 90,
  },
});



