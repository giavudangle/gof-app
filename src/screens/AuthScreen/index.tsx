import React from 'react'
import { View } from 'react-native'
import {AuthBody} from './components'

export const AuthScreen = ({navigation} : any) => {
  return (
    <View>
      <View>
        <AuthBody navigation={navigation}/>
      </View>
    </View>
  )
}


