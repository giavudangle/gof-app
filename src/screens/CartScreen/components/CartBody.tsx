import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
//Redux
import { useDispatch } from "react-redux";
//Action
import { removeFromCart, updateQuantity } from "../../../actions/cart";
//Text
import CustomText from "../../../components/UI/CustomText";
//Colors
import Colors from "../../../utils/Colors";
import { CartItem } from "./CartItem";
import Messages from "../../../messages/user";
import CartProxy from "../../../cores/Proxy/CartProxy";
//PropTypes check

export const CartBody = ({
  navigation,
  user,
  carts,
  loadCarts,
  isRefreshing,
} : any) => {
  const dispatch = useDispatch();
  const onRemove = (itemId : string) => {
    Alert.alert("Bỏ giỏ hàng", "Bạn có chắc bỏ sản phẩm khỏi giỏ hàng?", [
      {
        text: "Hủy",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          dispatch(removeFromCart(carts._id, itemId));
        },
      },
    ]);
  };  
  const proxy = new CartProxy(user)
  const shouldLoad : any = proxy.load();
  console.log(carts)

  return (
    <View style={styles.container}>
      {shouldLoad? (
        <View style={styles.center}>
          <CustomText>{Messages["user.login.require"]}</CustomText>
          <View style={styles.nextButton}>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <CustomText style={{ color: "#fff" }}>Tiếp tục</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      ) : carts.items.length === 0 ? (
        <View style={styles.center}>
          <CustomText style={{ fontSize: 16 }}>
            Chưa có sản phẩm nào trong giỏ hàng
          </CustomText>
        </View>
      ) : (
        <View style={{ marginBottom: 80 }}>
          <FlatList
            data={carts.items}
            onRefresh={loadCarts}
            refreshing={isRefreshing}
            keyExtractor={(item) => item.item._id}
            renderItem={({ item }) => {
              return (
                <CartItem
                  item={item}
                  onRemove={() => onRemove(item.item._id)}
                  onInc={() => {
                    dispatch(updateQuantity(carts._id, item.item._id,'increase'));
                  }}
                  onDes={() => {
                    dispatch(updateQuantity(carts._id, item.item._id,'decrease'));
                  }}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.white
  },
  nextButton: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.lighter_green,
    borderRadius: 5,
    borderColor: Colors.lighter_green,
    marginTop: 10,
  },
  center: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
