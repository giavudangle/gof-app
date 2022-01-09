import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,

} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
//Redux
import { useDispatch } from "react-redux";
// Action



//Color
import Colors from "../../../../utils/Colors";
//number format
import NumberFormat from "react-number-format";
//Text
//PropTypes check
import PropTypes from "prop-types";
import TextTemplateMethod from "../../../../cores/TemplateComposition/TextTemplateComposition";
import { CartCommand } from "../../../../cores/Command/CartCommand";
import { FavoriteCommand } from "../../../../cores/Command/FavoriteCommand";


/**
|--------------------------------------------------
| Render Utils
|--------------------------------------------------
*/
export const renderRightAction = (text: string, color: string, action: any, x: any, progress: any) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });
  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <TouchableOpacity
        style={[styles.rightAction, { backgroundColor: color }]}
        onPress={action}
      >
        <Text style={styles.actionText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
|--------------------------------------------------
| Main Component
|--------------------------------------------------
*/

export const FavoriteItem = ({ navigation, item }: any) => {

  /**
  |--------------------------------------------------
  | Local State
  |--------------------------------------------------
  */
  const [isLoading, setIsLoading] = useState(true);
  const unmounted = useRef(false);


  /**
 |--------------------------------------------------
 | Action Handlers
 |--------------------------------------------------
 */
  const dispatch = useDispatch();


  const _handleAddToCart = async () => {
    const cartCommand = new CartCommand(item, dispatch);
    await cartCommand.excute();
  }

  const _handleRemoveFavorite = async () => {
    const favoriteCommand = new FavoriteCommand(item, dispatch);
    await favoriteCommand.excute();
  };

  const RightActions = (progress: any) => {
    return (
      <View style={{ width: 250, flexDirection: "row" }}>
        {renderRightAction(
          "Thêm vào giỏ",
          Colors.emerald,
          _handleAddToCart,
          200,
          progress
        )}
        {renderRightAction(
          "Bỏ thích",
          Colors.red,
          _handleRemoveFavorite,
          300,
          progress
        )}
      </View>
    );
  };

  /**
  |--------------------------------------------------
  | Side Effects
  |--------------------------------------------------
  */
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);



  /**
  |--------------------------------------------------
  | Render JSX
  |--------------------------------------------------
  */



  return (
    <View>
      <Swipeable
        friction={2}
        rightThreshold={20}
        renderRightActions={RightActions}
      >
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { item: item })}
            style={{
              marginLeft: 5,
              width: "40%",
              height: "100%",
              marginRight: 10,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: 70,
                width: "100%",
                resizeMode: "contain",
                borderRadius: 10,
              }}
              source={{ uri: item.thumb }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isLoading && (
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size='small' color={Colors.grey} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.info}>
            <TextTemplateMethod
              allowFontScaling={false}
              selectable={false}
              injectedContainerStyles={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
              injectedTextStyles={styles.title}
            >{item.title}</TextTemplateMethod>
            <View style={styles.rateContainer}>
              <NumberFormat
                value={item.price}
                displayType={"text"}
                thousandSeparator={true}
                suffix={" VND"}
                renderText={(formattedValue) => (
                  <View style={styles.priceContainer}>
                    <TextTemplateMethod
                      allowFontScaling={false}
                      selectable={false}
                      injectedContainerStyles={{

                      }}
                      injectedTextStyles={styles.price}
                    >{formattedValue}</TextTemplateMethod>

                  </View>
                )}
              />
            </View>
            <TextTemplateMethod
              allowFontScaling={false}
              selectable={false}
              injectedContainerStyles={{
                backgroundColor: Colors.primary,
                borderRadius: 300,
                width: '50%',
                paddingVertical: 4,
                paddingHorizontal: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              injectedTextStyles={{

              }}
            >{item.category.name}</TextTemplateMethod>
          </View>
        </View>
      </Swipeable>
    </View>
  );
};

FavoriteItem.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 100,
    flexDirection: "row",
    backgroundColor: Colors.light_grey,
    marginTop: 0,
    borderRadius: 0,
    alignItems: "center",
    marginBottom: 2
  },
  info: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 10,
    width: "75%",
    marginLeft: 16

  },
  title: {
    fontSize: 16,
    width: 200
  },
  subText: {
    fontSize: 13,
    paddingVertical: 2,
    color: Colors.grey,
  },
  rateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginVertical: 4

  },
  rate: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 5,
  },
  score: {
    fontSize: 12,
    marginLeft: 5,
    color: Colors.grey,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    color: Colors.red,
  },
  action: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 100,
  },
  actionText: {
    color: "white",
    fontSize: 11,
    backgroundColor: "transparent",
    padding: 5,
  },
});
