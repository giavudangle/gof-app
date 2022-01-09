import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView

} from 'react-native';
import CustomText from '../../components/UI/CustomText';
//Colors
import Colors from '../../utils/Colors';
import ForgetRenderField from './components/ForgetRenderField';


//redux
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store';
import UserSingleton from '../../cores/Singleton/UserSingleton';

//Validation
const validate = (values : any) => {
    const errors : any = {};
    if (!values.email) {
        errors.email = 'Email không được bỏ trống';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Email không hợp lệ';
    }
    return errors;
}

const SignUpForm = (props : any) => {
    const { handleSubmit } = props;
    const loading = useAppSelector((state) => state.auth.isLoading);
    const dispatch = useDispatch();
    const unmounted = useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
        }
    }, []);
    const submit = async (values : any) => {
        try {
            const instance = UserSingleton.getInstance();
            await dispatch(instance.forgetPassword(values.email))
            if (!unmounted.current) {
                props.navigation.navigate('FinishResetPasswordScreen', {
                    value: values,
                })
            }
        } catch (err) {
            alert(err);
        }
    }
    return (
        <SafeAreaView>
            <View style={styles.container} />
            <View>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        left: 10,
                        top: 40,
                    }}
                    onPress={() => props.navigation.goBack()}
                >
                    <Ionicons name='ios-arrow-back' size={40} color={Colors.light_green} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <CustomText style={styles.title}>Forget Password</CustomText>
                    <Field
                        name='email'
                        keyboardType='email-address'
                        icon='email'
                        label='Email'
                        component={ForgetRenderField}
                    />
                </View>

                <TouchableOpacity onPress={(handleSubmit(submit))}>
                    <View style={styles.btn}>
                        {loading ? (
                            <ActivityIndicator size='small' color='#fff' />
                        ) : (
                            <CustomText style={{
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                            }}>NEXT</CustomText>
                        )
                        }
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export const ForgetPasswordScreen = reduxForm({
    form: 'contact', //a unique identifier for this form
    validate, // <-------- validation func given to redux-form
})(SignUpForm)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        marginTop: '20%',
    },
    title: {
        color: Colors.light_green,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 24,
        marginTop:30
    },
    btn: {
        width: "90%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        flexDirection: "row",
        backgroundColor: Colors.primary,
        marginTop: 20,
        alignSelf: 'center',
    }
})