import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
//Color
import Colors from '../../utils/Colors';
//Redux
//Global Component
import SnackBar from '../../components/Notification/SnackBar';
// Local Component
import {Header} from './components/Header'
import {DetailBody} from './components/Body'
import { Comments } from './components/Comments';
import {ActionButton, ModalComponent} from './components/ModalAction'
import { useAppSelector } from '../../store';




export const DetailScreen = (props : any) => {

  /**
  |--------------------------------------------------
  | Props
  |--------------------------------------------------
  */
  const { item } = props.route.params;

  /**
  |--------------------------------------------------
  | Local State
  |--------------------------------------------------
  */
  const scrollY = new Animated.Value(0);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /**
  |--------------------------------------------------
  | Global State
  |--------------------------------------------------
  */
  const user = useAppSelector((state) => state.auth.user);
  const FavoriteProducts = useAppSelector((state) =>
  state.fav.favoriteList.some((product : any) => product.item._id === item._id),
  );

  return (
    <View style={styles.container}>
      {
        showSnackbar 
        ? (<SnackBar checkVisible={showSnackbar} message={message} />)
        : (<View/>)
      }

      <Header navigation={props.navigation} scrollY={scrollY} item={item} />

      <Animated.ScrollView
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <DetailBody item={item} color={Colors.primary} />
        <Comments />
      </Animated.ScrollView>

      <ActionButton
        showSnackbar={showSnackbar}
        item={item}
        FavoriteProducts={FavoriteProducts}
        setShowSnackbar={setShowSnackbar}
        setModalVisible={setModalVisible}
        setMessage={setMessage}
        user={user}
        color={Colors.primary}
      /> 
      <ModalComponent
       item={item}
       color={Colors.primary}
       modalVisible={modalVisible}
       setModalVisible={setModalVisible}
       navigation={props.navigation}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 20 },
});

