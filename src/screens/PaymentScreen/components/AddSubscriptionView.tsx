import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PaymentFormView from "./PaymentFormView";
/**
 * The class renders a view with PaymentFormView
 */
export const AddSubscriptionView = (props : any) => {
  return (
    <ScrollView style={styles.container}>
      <View >
        <PaymentFormView {...props} />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoText: {
    fontSize: 18,
    textAlign: "center",
  },
});
