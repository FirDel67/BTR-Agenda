import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet, Text, TextInput, Image, ActivityIndicator,
    TouchableOpacity, View, Animated, ScrollView, RefreshControl, Alert
} from 'react-native';

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from '../acceuils/welcoming';

import { useNavigation } from '@react-navigation/native';

import * as Network from 'expo-network';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';


function AdminSignIn() {
    const navigation = useNavigation();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/i;

    const [emailValue, setEmailValue] = useState('')
    const [animationClassEmail, setAnimationClassEmail] = useState('');

    const [passwordValue, setPasswordValue] = useState('')
    const [animationClassPassword, setAnimationClassPassword] = useState('');

    const elemetRefEmail = useRef(null)
    const elemetRefPass = useRef(null)

    const [refreshing, setRefreshing] = useState(false);
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userIp, setUserIp] = useState();

    const animatedValue = new Animated.Value(0);

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            setEmailValue('');
            setPasswordValue('');
            setLoginBtnClicked(false);
        }, 2000);
    };

    useEffect(() => {
        async function getNetInfo() {
            const netState = await Network.getNetworkStateAsync();
            const netIp = await Network.getIpAddressAsync();
            const isModeAvion = await Network.isAirplaneModeEnabledAsync();

            //console.log("Network reachable: ", netState.isInternetReachable);

            if (netIp != null) {
                //console.log("IP address not null: ", netIp);
                setUserIp(netIp);
            }
            if (netState.isConnected == true && netState.isInternetReachable) {

                /*const getToken = await AsyncStorage.getItem("spToken")
                if (getToken != null) {
                    console.log("Token retrieved: ", getToken);
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Connecté avec succès',
                        textBody: 'Vous êtes connecté avec succès et redirection vers la page d\'acceuil',
                        autoClose: 2000, titleStyle: { color: "green" },
                        textBodyStyle: { color: "green" },
                        onShow: () => { setLoginBtnClicked(false); },
                        onPress: () => Toast.hide(),
                        onHide: () => {
                            setTimeout(() => {
                                navigation.navigate('AdminMainPage');
                                setIsInitialized(true);
                                console.log('Connected successfully');
                                setLoginBtnClicked(false);
                            }, 4000);

                        }
                    })
                    console.log("Network is connected: ", netState.isConnected)
                }

                else {
                    setTimeout(() => {
                        setIsInitialized(true);
                    }, 5000)
                }*/
                setTimeout(() => {
                    setIsInitialized(true);
                }, 5000)
                console.log("Network is connected: ", netState.isConnected)

            } else if (isModeAvion == true) {
                Alert.alert("Mode avion activé",
                    "Le mode avion de votre appareil est activé\nVeuillez le désactiver pour continuer",
                    [{
                        "text": "Ok", style: "destructive"
                    }]
                )
                setIsInitialized(false);
            } else if (netState.isConnected == false) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Réseau non disponible",
                    textBody: "Vous n'êtes pas connecté à l'internet\nVérifier votre conexion internet et réessayer",
                    button: "Ok",
                    onPressButton: () => {
                        console.log("Dialog btn pressed");
                    },
                    autoClose: 5000
                })
                setIsInitialized(false);
            }
        }
        getNetInfo();
    }, [refreshing])

    Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 100,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: -100,
                duration: 2000,
                useNativeDriver: true,
            }),
        ])
    ).start();
    const translateY = animatedValue.interpolate({
        inputRange: [-10, 100],
        outputRange: [-10, 10],
    });


    function LoginClient(e) {
        if (emailValue.trim() == '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Adresse email incomplet',
                textBody: "L'adresse email est obligatoire !!",
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            setAnimationClassEmail(styles.inputError)
            setTimeout(() => {
                setAnimationClassEmail('')
            }, 3000)
            elemetRefEmail.current.focus();

            e.preventDefault()
            return false
        } if (!emailValue.trim().match(emailRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Adresse email invalide',
                textBody: "Veuillez entrer votre propre email valide\nExemple: burundientempsreel@gmail.com",
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            setAnimationClassEmail(styles.inputError)
            setTimeout(() => {
                setAnimationClassEmail('')
            }, 3000)
            elemetRefEmail.current.focus();
            e.preventDefault()
            return false
        } else if (passwordValue.trim() == "") {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Mot de passe incomplet',
                textBody: 'Votre Mot de passe a utilisé est requis',
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            setAnimationClassPassword(styles.inputError)
            setTimeout(() => {
                setAnimationClassPassword('')
            }, 3000)
            elemetRefPass.current.focus()
            e.preventDefault()
            return false
        }
        else if (!passwordValue.trim().match(passwordRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe n\'est pas sécurisé',
                textBody: 'Veuillez combinez un majuscule, un minuscule,un caractère et un chiffre\nExemple:@Admin4',
                autoClose: 4000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            setAnimationClassPassword(styles.inputError)
            setTimeout(() => {
                setAnimationClassPassword('')
            }, 5000)
            elemetRefPass.current.focus()
            e.preventDefault()
            return false
        }
        else if (passwordValue.length < 4) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe est trop petit',
                textBody: 'Il doit avoir au moins 4 charatères',
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            setAnimationClassPassword(styles.inputError)
            setTimeout(() => {
                setAnimationClassPassword('')
            }, 3000)
            elemetRefPass.current.focus()
            e.preventDefault()
            return false
        }
        else {
            setLoginBtnClicked(true);

            const data = {
                email: emailValue,
                password: passwordValue
            }
            console.log(data);

            axios.post("https://btrproject.burundientempsreel.com/surperagent/login",
                data)
                .then((response) => {
                    if (response.data.error) {
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Erreur", textBody: `${response.data.error}`,
                            autoClose: 2500,
                            button: "Ok",
                            onPress: () => { Toast.hide() },
                            onShow: () => {
                                setLoginBtnClicked(false);
                            }
                        });
                    }
                    else {
                        console.log(response.data);
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Connecté avec succès',
                            textBody: 'Vous êtes connecté avec succès et redirection vers la page d\'acceuil',
                            autoClose: 2000, titleStyle: { color: "green" },
                            textBodyStyle: { color: "green" },
                            onShow: () => { setLoginBtnClicked(false); },
                            onPress: () => Toast.hide(),
                            onHide: () => {
                                AsyncStorage.setItem('spToken', response.data.token);
                                AsyncStorage.setItem('spId', response.data.userId.toString());
                                navigation.navigate('AdminMainPage');
                                setEmailValue("");
                                setPasswordValue("");
                                console.log('Connected successfully');
                                setLoginBtnClicked(false);
                            }
                        })
                    }
                })
                .catch((error) => {
                    console.error("axios error: ", error);
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Erreur de connexion',
                        textBody: `${error.message}`,
                        autoClose: 2000,
                        textBodyStyle: { color: "red" },
                        onPress: () => Toast.hide(),
                        onShow: () => {
                            setLoginBtnClicked(false);
                        }
                    })
                })
        }
    }


    return (
        <>
            {!isInitialized ? <WelcomeScreen /> :
                <ScrollView contentContainerStyle={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >

                    <View style={styles.container}>

                        <View style={styles.loginBox}>
                            <Animated.Image
                                style={[styles.image, { transform: [{ translateY }] }]}
                                source={require("../../../assets/exchangepremier.png")}
                            />
                            <Text style={styles.title}>SuperAgent</Text>
                        </View>
                        <View style={styles.inputContainer}>

                            <View style={styles.headerContainer}>
                                <Text style={styles.header}>Nous sommes ravis de vous retrouver encore.</Text>
                            </View>

                            <View style={styles.formContainer}>
                                <View style={styles.inputField}>
                                    <Text style={styles.label}>Adresse E-mail</Text>
                                    <TextInput
                                        value={emailValue}
                                        ref={elemetRefEmail}
                                        onChangeText={setEmailValue}
                                        style={[styles.input, animationClassEmail]}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <Text style={styles.label}>Mot de passe</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        ref={elemetRefPass}
                                        style={[styles.input, styles.passwordInput]}
                                        value={passwordValue}
                                        onChangeText={(text) => setPasswordValue(text)}
                                        secureTextEntry={!passwordVisible}
                                    />
                                    <TouchableOpacity
                                        style={styles.passwordIconContainer}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        <Ionicons
                                            name={passwordVisible ? 'eye' : 'eye-off'}
                                            size={30}
                                            color="#555"
                                            style={styles.passwordIcon}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.link}>
                                    <TouchableOpacity style={styles.linkBtn}
                                        onPress={() => navigation.navigate('ResetPassword')}>
                                        <Text style={{
                                            color: "blue", textDecorationLine: "underline",
                                            fontSize: 18
                                        }}>
                                            Mot de passe oublié?</Text>
                                    </TouchableOpacity>
                                </View>

                                {loginBtnClicked ?
                                    <ActivityIndicator size="large" color="white" style={{
                                        backgroundColor: "#055bfa",
                                        borderRadius: 5,
                                        padding: 5
                                    }} /> :
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={LoginClient}
                                    >
                                        <Text style={styles.buttonText}>Se connecter</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>

                        <View style={styles.linkCreateAccount}>
                            <Text style={{ fontSize: 16 }}>Vous n'avez pas de compte? </Text>
                            <TouchableOpacity style={styles.linkBtn}
                                onPress={() => navigation.navigate('AdminSignup')}>
                                <Text style={{
                                    color: "blue", fontSize: 16,
                                    textDecorationLine: "underline"
                                }}>
                                    Créez-en un ici</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            }
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        margin: 5,
        marginVertical: 15
    },
    loginBox: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "black",
        borderRadius: 5,
        padding: 10,
        marginTop: 10
    },
    image: {
        width: "100%",
        height: 300,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        position: "absolute",
        top: 0,
        alignSelf: "center",
        color: "blue",
    },
    inputContainer: {
        width: "95%",
        marginTop: 10,
    },
    label: {
        fontSize: 20,
        color: "#474747",
    },
    headerContainer: {
        justifyContent: "center",
    },
    header: {
        fontSize: 20,
        color: "#1d6af0",
        textAlign: "center"
    },
    formContainer: {
        margin: 10,
    },
    inputField: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: "#909091",
        fontSize: 16,
        width: "100%",
    },
    inputError: {
        borderBottomColor: "red",
    },

    icon: {
        position: 'absolute',
        right: 0,
        top: 13
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#909091',
    },
    passwordInput: {
        width: '90%',
        borderBottomWidth: 0,
        marginRight: 10,
    },
    passwordIconContainer: {
        position: 'absolute',
        right: 0
    },
    passwordIcon: {
        paddingHorizontal: 2
    },
    button: {
        backgroundColor: '#0335fc',
        padding: 5,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: "#fff",
        fontSize: 25,
        textAlign: 'center',
    },
    link: {
        alignSelf: "flex-end",
        margin: 10
    },

    linkCreateAccount: {
        alignSelf: "flex-end",
        flexDirection: "row",
        padding: 5
    },
    linkBtn: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    }
});

export default AdminSignIn;