import React, { useState, useRef, useEffect } from 'react'
import { View, Alert, ScrollView, StyleSheet } from 'react-native'
import Address from './components/Address'
import { Header, UserForm, TotalButton, SummaryOrder } from './components'

import { useIsFocused } from '@react-navigation/native'
import Colors from '../../utils/Colors'
import Loader from "../../components/Loaders/Loader";

import { useAppSelector } from '../../store'



export const PreOrderScreen = ({ route, navigation } : any) => {
  // Get props via route params navigation
  const { cartItems, total, cartId, user } = route.params;
  // Destructuring
  const { address, name, phone } = user;

  //Handlers & Intialize
  const initializeForm = {
    name,
    phone,
    address
  }

  /**
  |--------------------------------------------------
  | Local State 
  |--------------------------------------------------
  */
  const [deliveryInformation, setDeliveryInformation] = useState({
    deliveryName: name,
    deliveryAddress: address,
    deliveryPhone: phone,
    deliveryProvince: '',
    deliveryTown: ''
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const unmounted = useRef(false);
  const isFocused = useIsFocused();

  /**
  |--------------------------------------------------
  | Global State 
  |--------------------------------------------------
  */
  const carts = useAppSelector(state => state.cart.cartItems)

  /**
  |--------------------------------------------------
  | Hooks Subscribing
  |--------------------------------------------------
  */
  useEffect(() => {
    return () => {
      unmounted.current = true
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      const interval = setInterval(() => {
        setLoading(false)
      }, 1000)
      return () => clearInterval(interval);
    }
    return;
  }, [isFocused]);

  useEffect(() => {
    if (carts.items.length === 0) {
      navigation.goBack()
    }
  }, [carts.items])



  // Setter Utils
  const _setTownAndProvince = (province :any, town:any) => {
    setDeliveryInformation({
      ...deliveryInformation,
      deliveryProvince: province,
      deliveryTown: town
    })

  };


  const _setReceiver = (fieldType:any,value:any) => {
    switch(fieldType){
      case 'name':
        return setDeliveryInformation({...deliveryInformation,deliveryName:value})
      case 'phone':
        return setDeliveryInformation({...deliveryInformation,deliveryPhone:value})
      default:
        return setDeliveryInformation({...deliveryInformation,deliveryAddress:value})
    }
  };








  const proceedToPayment = async () => {
    //Composition Delivery
    const fullAddress = `${deliveryInformation.deliveryAddress}, ${deliveryInformation.deliveryTown}, ${deliveryInformation.deliveryProvince}`;
    const summaryOrders = cartItems.map((item:any) =>
      ({ item: item.item._id, quantity: item.quantity }))
     
    try {
      if (error == undefined
        && deliveryInformation.deliveryProvince.length !== 0
        && deliveryInformation.deliveryTown.length !== 0) {
        navigation.navigate("Payment", {
          screen: "PaymentScreen",
          params: {
            fullAddress,
            deliveryInformation,
            summaryOrders,
            total,
            cartId,
            carts,
          },
        });
      } else {
        Alert.alert("Kh??ng ????? th??ng tin","Vui l??ng nh???p ?????y ????? th??ng tin.");
      }
    } catch (err) {
      throw err;
    }
  }



  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView>
            <UserForm
              initialValues={initializeForm}
              delivery={deliveryInformation}
              setDelivery={_setReceiver}
              checkValidation={(e : any) => setError(e)}
            />
            <Address setTownAndProvince={_setTownAndProvince} />
            <SummaryOrder cartItems={cartItems} total={total} />
          </ScrollView>
          <TotalButton toPayment={proceedToPayment} />

        </>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
});
