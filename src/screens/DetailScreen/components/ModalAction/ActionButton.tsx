import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
//import CustomText
import CustomText from '../../../../components/UI/CustomText';
//icon
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
//Animatable
import * as Animatable from 'react-native-animatable';
//Redux
import { useDispatch } from 'react-redux';
//Action

import { addToCart } from '../../../../actions/cart';
import { addFavorite,removeFavorite } from '../../../../actions/favorite';




import Messages from '../../../../messages/user';

//PropTypes check
import PropTypes from 'prop-types';
import { useAppSelector } from '../../../../store';

export const ActionButton = ({
  user,
  item,
  color,
  showSnackbar,
  setShowSnackbar,
  FavoriteProducts,
  setModalVisible,
  setMessage,
} : any) => {

  /**
  |--------------------------------------------------
  | Global State 
  |--------------------------------------------------
  */
  const cartLoading = useAppSelector((state) => state.cart.isLoading);


  /**
  |--------------------------------------------------
  | Local State 
  |--------------------------------------------------
  */
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);


  /**
  |--------------------------------------------------
  | Action Handlers
  |--------------------------------------------------
  */
  const dispatch = useDispatch();

  const validateAddToCart = () => {
    return +item.stocks > 0;
  }
  const _handleRemoveItem = async () => {
    await dispatch(removeFavorite(item._id))
  }

  const addToCartAct = async () => {
    if(validateAddToCart()){
      if (Object.keys(user).length === 0) {
        setMessage(Messages['user.login.require']);
        setShowSnackbar(!showSnackbar);
      } else {
        try {
          dispatch(addToCart(item));
          setModalVisible(true);
        } catch (err) {
          throw err;
        }
      }
    } else {
      Alert.alert('H???T H??NG','PookBook s??? li??n h??? cho b???n khi c?? h??ng')
    }
  };
 
  const toggleFavorite = () => {
    if (Object.keys(user).length === 0) {
      setMessage(Messages['user.login.require']);
      setShowSnackbar(!showSnackbar);
    } else if (FavoriteProducts) {
      Alert.alert(
        'B??? y??u th??ch',
        'B???n c?? mu???n b??? s???n ph???m ra kh???i m???c y??u th??ch?',
        [
          {
            text: 'H???y',
            style: 'cancel',
          },
          {
            text: '?????ng ??',
            onPress: () => _handleRemoveItem(),
          },
        ],
      );
    } else {
      dispatch(addFavorite(item));
    }
  };

  return (
    <Animatable.View
      delay={1500}
      animation='fadeInUp'
    >
      <View style={styles.action}>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={[styles.favorite, { borderColor: color }]}
        >
          {FavoriteProducts ? (
            <LottieView
              source={require('../../../../components/IconAnimation/heart.json')}
              autoPlay={FavoriteProducts}
              loop={false}
            />
          ) : (
            <Ionicons name='ios-heart-empty' size={27} color={color} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addCart, { backgroundColor: color }]}
          onPress={addToCartAct}
        >
          {cartLoading ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <CustomText style={styles.actionText}>Th??m v??o gi??? h??ng</CustomText>
          )}
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

ActionButton.propTypes = {
  item: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  setShowSnackbar: PropTypes.func.isRequired,
  FavoriteProducts: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  addCart: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
  },
  favorite: {
    width: '18%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    paddingTop: 5,
    borderRadius: 5,
    height: 50,
  },
  actionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
});
