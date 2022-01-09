import React from 'react';
import {  TextStyle,StyleSheet,Text, View, ViewStyle } from 'react-native';


interface ITextComposableProps {
  injectedContainerStyles : ViewStyle,
  injectedTextStyles : TextStyle,
  children : any,
  allowFontScaling : boolean,
  selectable: boolean
}

class TextTemplateMethod extends React.PureComponent<ITextComposableProps,any,any> {
  constructor(props : ITextComposableProps){
    super(props);
  }

  render(){
    const {
      injectedTextStyles,
      injectedContainerStyles,
      allowFontScaling,selectable
    } = this.props;
    return (
      <View style={[styles.container,injectedContainerStyles]}>
      <Text
        allowFontScaling={allowFontScaling}
        selectable={selectable}
        style={[styles.text,injectedTextStyles]}
      >
        {this.props.children}
      </Text>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    paddingVertical:4,
    paddingHorizontal:4,
    justifyContent:'center',
    alignItems:'center',
    height:25,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },

})

export default TextTemplateMethod