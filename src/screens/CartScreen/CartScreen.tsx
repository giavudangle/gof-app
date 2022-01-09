import React,{useEffect,useState,useCallback} from 'react'
import { View, StyleSheet,Dimensions, Platform } from 'react-native'
import {Header,CartBody,TotalButton} from './components'
import Colors from '../../utils/Colors';

//Redux
import { useDispatch } from 'react-redux';

// Action 
import {fetchCart} from '../../actions/cart'

//Loader

import SkeletonLoadingCart from '../../components/Loaders/SkeletonLoadingCart'
import { useAppSelector } from '../../store';
import CartIterator from '../../cores/Iterator/CartIterator';

const { height } = Dimensions.get('window');




export const CartScreen = (props : any) => {

  /**
  |--------------------------------------------------
  | Global State
  |--------------------------------------------------
  */

  const user = useAppSelector((state) => state.auth.user);
  const carts = useAppSelector((state) => state.cart.cartItems);
  const loading = useAppSelector((state) => state.cart.isLoading);
  

  /**
  |--------------------------------------------------
  | Local State
  |--------------------------------------------------
  */
  const [isRefreshing, setIsRefreshing] = useState(false);



  
  function getTotalWithIterator() : number {
    let total: number = 0;
    const iterator = new CartIterator(carts.items);
    while (iterator.hasNext()) {
      const it = iterator.next();
      total += +it.quantity * +it.item.price;
    }
    return total;
  }



  /**
  |--------------------------------------------------
  | Action Handlers
  |--------------------------------------------------
  */
  const dispatch = useDispatch();
  const loadCarts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchCart())
    } catch (err){
      alert(err)
    }
    setIsRefreshing(false);
  },[dispatch,setIsRefreshing])

  /**
  |--------------------------------------------------
  | Side Effect
  |--------------------------------------------------
  */

  useEffect(() => {
    loadCarts()
  },[user.userid,carts.length])
  

  return (
    <View style={styles.container}>
      <Header user={user} carts={carts} navigation={props.navigation}/>
      {
        loading  
        ? (<SkeletonLoadingCart/>)
        : (     
          <CartBody
          user={user}
          carts={carts}
          loadCarts={loadCarts}
          isRefreshing={isRefreshing}
          navigation={props.navigation}
          />           
        )
      }
      {
        Object.keys(user).length === 0 
        ? (<></>)
        : carts.items.length === 0 
          ? (<></>)
          : (
            <TotalButton
            user={user as any}
            total={getTotalWithIterator()}
            cartItems={carts.items}
            cartId={carts._id}
            navigation={props.navigation}
            />
          )
      }
    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: Platform.OS === 'android' ? 70 : height < 668 ? 70 : 90,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  centerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'android' ? 70 : height < 668 ? 70 : 90,
  },
});
