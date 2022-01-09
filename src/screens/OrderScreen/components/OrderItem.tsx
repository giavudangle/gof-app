import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
//Colors
import Colors from "../../../utils/Colors";
//Item
import ItemList from "../../PreOrderScreen/components/PreOrderItem";
//Number format
import NumberFormat from "../../../components/UI/NumberFormat";
//Moment
import moment from "moment";
import "moment/min/locales";
//PropTypes check
import PropTypes from "prop-types";
import Steps from "../../../components/UI/Steps";
import { useDispatch } from "react-redux";
import { cancelOrder } from "../../../actions/order";
import TextTemplateMethod from "../../../cores/TemplateMethod/TextTemplateMethod";

moment.locale("vi");

export const OrderItem = ({ order }: any) => {
  const [showDetails, setShowDetails] = useState(false);

  const status = () => {
    switch (order.status) {
      case "waiting":
        return 0;
      case "confirmed":
        return 1;
      case "delivery":
        return 2;
      case "success":
        return 3;
      default:
        return 4;
    }
  };

  const dispatch = useDispatch();


  const _handleDispatchCancelOrder = async () => {
    await dispatch(cancelOrder(order._id))
    Alert.alert('Huỷ đơn hàng thành công', 'PookBook rất tiếc vì điều này :(')
  }

  const _handleCancelOrder = async () => {
    Alert.alert(
      "Huỷ đơn hàng",
      "Bạn có chắc chắn muốn huỷ đơn hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: _handleDispatchCancelOrder,

        },
      ]
    );
  }


  return (
    <View style={styles.container}>
      <View>
        <View style={styles.textContainer}>
          <TextTemplateMethod
            allowFontScaling={false}
            selectable={false}
            injectedContainerStyles={{}}
            injectedTextStyles={{
              fontSize: 16
            }}
          >Mã đơn: </TextTemplateMethod>
          <TextTemplateMethod
            allowFontScaling={false}
            selectable={false}
            injectedContainerStyles={{}}
            injectedTextStyles={{
              color: Colors.light_green,
              fontSize: 16
            }}
          >
            ORDER-{order._id.substr(order._id.length - 10)}
          </TextTemplateMethod>
        </View>

        <View style={styles.textContainer}>
          <TextTemplateMethod
            allowFontScaling={false}
            selectable={false}
            injectedContainerStyles={{}}
            injectedTextStyles={{
              fontSize: 16
            }}
          >Thời gian đặt hàng:</TextTemplateMethod>
          <TextTemplateMethod
            allowFontScaling={false}
            selectable={false}
            injectedContainerStyles={{}}
            injectedTextStyles={{
              fontSize: 16,
              color: Colors.light_green,
            }}
          >{moment(order.createdAt).format(" hh:mm, Do MMMM YYYY")}</TextTemplateMethod>

        </View>

        <TouchableOpacity onPress={() => setShowDetails((prev) => !prev)}>
          <TextTemplateMethod
            injectedContainerStyles={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              borderColor: Colors.white,
              borderWidth: 1,
              width: '100%',
              height: 40

            }}
            injectedTextStyles={{
              color: Colors.white
            }}
            selectable={false}
            allowFontScaling={false}
          >
            {showDetails ? "Ẩn đơn hàng" : "Chi tiết đơn hàng"}
          </TextTemplateMethod>
        </TouchableOpacity>

        {showDetails ? (
          <View>
            <View style={styles.textContainer}>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15
                }}
              >
                Tên người nhận:
              </TextTemplateMethod>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15,
                  color: Colors.light_green
                }}
              >
                {order.name}
              </TextTemplateMethod>
            </View>

            <View style={[styles.textContainer, {
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }]}>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15
                }}
              >
                Địa chỉ:
              </TextTemplateMethod>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{

                }}
                injectedTextStyles={{
                  fontSize: 15,
                  color: Colors.light_green
                }}
              >
                {order.address}
              </TextTemplateMethod>
            </View>
            <View style={styles.textContainer}>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15
                }}
              >
                SĐT:
              </TextTemplateMethod>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{

                }}
                injectedTextStyles={{
                  fontSize: 15,
                  color: Colors.light_green
                }}
              >
                {order.phone}
              </TextTemplateMethod>
            </View>
            <View style={styles.textContainer}>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15
                }}
              >
                Phương thức thanh toán:{" "}
              </TextTemplateMethod>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{

                }}
                injectedTextStyles={{
                  fontSize: 15,
                  color: Colors.light_green
                }}
              >
                {order.paymentMethod}
              </TextTemplateMethod>

            </View>
            <View style={styles.textContainer}>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15
                }}
              >
                Tình trạng thanh toán :{" "}
              </TextTemplateMethod>
              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{

                }}
                injectedTextStyles={{
                  fontSize: 15,
                  color: order.paymentMethod === 'CC' || status() === 4 ? Colors.verify_green : Colors.red
                }}
              >
                {order.paymentMethod === 'CC' || status() === 4 ? 'Đã thanh toán ' : 'Chưa thanh toán '}
              </TextTemplateMethod>

            </View>
            <View style={styles.steps}>
              <Steps position={status()} />
            </View>
            <View style={styles.textContainer}>

              <TextTemplateMethod
                allowFontScaling={false}
                selectable={false}
                injectedContainerStyles={{}}
                injectedTextStyles={{
                  fontSize: 15,

                }}
              >
                Sản phẩm đã đặt :
              </TextTemplateMethod>
            </View>
            <FlatList
              data={order.items}
              keyExtractor={(item) => item.item._id}
              renderItem={({ item }) => {
                return <ItemList key={item.item._id} item={item} />;
              }}
            />
            <View
              style={{
                ...styles.textContainer,
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <View style={styles.textContainer}>

                <TextTemplateMethod
                  allowFontScaling={false}
                  selectable={false}
                  injectedContainerStyles={{}}
                  injectedTextStyles={{
                    fontSize: 15,
                  }}
                >
                  Tổng tiền :
                </TextTemplateMethod>
              </View>
              <NumberFormat
                price={order.totalAmount.toString()}
                style={{ fontSize: 15 }}
              />
            </View>
            <TouchableOpacity
              onPress={_handleCancelOrder}
              style={{ display: order.status !== 'done' ? 'flex' : "none" }}>
              <View style={{ alignItems: 'center' }}>
                <TextTemplateMethod
                  injectedContainerStyles={{
                    backgroundColor: Colors.red,
                    borderRadius: 300,
                    borderColor: Colors.white,
                    borderWidth: 1,
                    width: '100%',

                  }}
                  injectedTextStyles={{
                    color: Colors.white
                  }}
                  selectable={false}
                  allowFontScaling={false}
                >
                  Huỷ đơn hàng
                </TextTemplateMethod>

              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grey,
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailButtom: {
    backgroundColor: Colors.lighter_green,
    alignItems: "center",
    paddingVertical: 0,
    borderRadius: 5,
    marginVertical: 15,
  },
  textContainer: {
    flexDirection: "row",
    marginVertical: 2,
  },
  detail: {
    color: Colors.lighter_green,
  },
  steps: {
    width: "100%",
    height: 100,
  },
});

export default OrderItem;
