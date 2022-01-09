import React, { useState, useEffect, useRef } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { Header, PaymentBody } from './components'
import Colors from '../../utils/Colors'
import { SummaryOrder } from '../PreOrderScreen/components'
import CustomText from '../../components/UI/CustomText';

import Loader from '../../components/Loaders/Loader';

import { useDispatch } from 'react-redux'
// import { createOrder } from '../../actions/order/orderActions'
import { resetCart } from '../../actions/cart'
import { PromotionHolder } from './promotions/PromotionHolder'
import { useAppSelector } from '../../store'
import { PURCHASE_TYPE } from '../../enums'
import OrderFactory from '../../cores/Factory/OrderFactory'
import { ApplyPromotionStrategy, BaseStrategy, PromotionStrategy } from '../../cores/Strategy/PromotionStrategy'
import { IPromotion } from '../../@types'


export const PaymentScreen = ({ route, navigation } : any) => {
  /**
  |--------------------------------------------------
  | Route parameters & Stuff
  |--------------------------------------------------
  */
  let token = route.params.token
  const {
    summaryOrders,
    deliveryInformation,
    total,
    cartId,
    fullAddress,
  } = route.params;

  const { deliveryName, deliveryPhone } = deliveryInformation;

  /**
  |--------------------------------------------------
  | Local State
  |--------------------------------------------------
  */
  const [promotion, setPromotion] = useState<IPromotion & any>({})
  const [loading, setLoading] = useState(true);
  const [consider, setConsider] = useState(false);
  const unmounted = useRef(false);

  /**
  |--------------------------------------------------
  | Global State
  |--------------------------------------------------
  */
  const carts = useAppSelector(state => state.cart.cartItems)
  const cartLoading = useAppSelector(state => state.cart.isLoading)
  const orderLoading = useAppSelector(state => state.order.isLoading)
  const dispatch = useDispatch();


  /**
  |--------------------------------------------------
  | Sides Effect
  |--------------------------------------------------
  */
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(false);
    }, 1000);
    if (!unmounted.current) {
      return () => clearInterval(interval);
    }
    return;
  });

  useEffect(() => {
    setConsider(token ? true : false);
  }, [token]);


  /**
  |--------------------------------------------------
  | Action Handler
  |--------------------------------------------------
  */
  const _handleAddOrder = async () => {
    try {
      
      // Apply Strategry to choose Promotion
      const baseStrategy = new BaseStrategy();
      let bill : ApplyPromotionStrategy = new ApplyPromotionStrategy(baseStrategy) ;

      if(Object.keys(promotion).length != 0){
        const promotionStrategy = new PromotionStrategy();
        bill.strategy = promotionStrategy;
      } 
      const finalTotal  : number = bill.getFinalTotal(total,promotion.value * 1000);
      // Factory Pattern
      if(!consider){
        const payByCash = OrderFactory.getPurchaseMethod(PURCHASE_TYPE.COD)
        dispatch(payByCash.purchase(summaryOrders,deliveryName,finalTotal,fullAddress,deliveryPhone))
      } else{
        const payByCreditCard = OrderFactory.getPurchaseMethod(PURCHASE_TYPE.CC)
        payByCreditCard.injectToken(token)
        dispatch(payByCreditCard.purchase(summaryOrders,deliveryName,finalTotal,fullAddress,deliveryPhone))
      }

  
      dispatch(resetCart(cartId))
      navigation.navigate('FinishOrder');
    } catch (err) {
      alert(err);
    }
  };

  /**
  |--------------------------------------------------
  | Render JSX
  |--------------------------------------------------
  */



  const calculateTotal = () => {
    return Object.keys(promotion).length > 0 ? total - promotion.value * 1000 : total
  }
  return (
    <ScrollView>
      <Header navigation={navigation} />
      {loading || cartLoading || orderLoading ? (
        <Loader />
      ) : (
        <>
          <ScrollView>
            <PaymentBody
              navigation={navigation}
              payByCard={consider}
              setPayByCard={setConsider}
              token={token}
            />
            <PromotionHolder promotion={promotion } setPromotion={setPromotion} navigation={navigation}/>
            <SummaryOrder cartItems={carts.items} total={calculateTotal()} />
          </ScrollView>
          <View style={styles.total}>
            <TouchableOpacity onPress={_handleAddOrder}>
              <View style={styles.orderButton}>
                <CustomText style={{ color: '#fff', fontSize: 16 }}>
                  Tiến hành đặt hàng
                </CustomText>
              </View>
            </TouchableOpacity>

          </View>
        </>
      )}
    </ScrollView>

  )
}

/**
|--------------------------------------------------
| Custom Styles
|--------------------------------------------------
*/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  total: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    left: 0,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  orderButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    top: 10
  },
});

