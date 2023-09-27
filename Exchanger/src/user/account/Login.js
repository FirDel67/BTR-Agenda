import React, { useEffect, useRef, useState } from 'react';
import {
    ToastAndroid, StyleSheet, Text, TextInput, Image, Alert,
    TouchableOpacity, View, Animated, ScrollView, AppState,
    RefreshControl, ActivityIndicator
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import * as Network from 'expo-network';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import WelcomeScreen from '../../components/welcoming';

function BuyerSignIn() {

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

    const spinValue = useRef(new Animated.Value(0)).current;
    const animatedValue = new Animated.Value(0);

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            setEmailValue('');
            setPasswordValue('');
            setLoginBtnClicked(false);
        }, 3000);
    };

    useEffect(() => {
        async function getNetInfo() {
            const netState = await Network.getNetworkStateAsync();
            const netIp = await Network.getIpAddressAsync();
            const isModeAvion = await Network.isAirplaneModeEnabledAsync();

            if (netIp != null) {
                //console.log("IP address not null: ", netIp);
                setUserIp(netIp);
            }
            if (netState.isConnected == true && netState.isInternetReachable) {
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
                Alert.alert("Réseau non disponible",
                    "Vous n'êtes pas connecté à l'internet\nVérifier votre conexion internet\n",
                    [{
                        "text": "Ok", style: "destructive"
                    }]
                )
                setIsInitialized(false);
            }
        }
        getNetInfo();
    }, [refreshing])

    //console.log("Ip address is : ", userIp);

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


    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }),
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
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
        } else if (!passwordValue.trim().match(passwordRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe n\'est pas sécurisé',
                textBody: 'Veuillez combinez un majuscule, un minuscule,un caractère et un chiffre\nExemple:@Admin4',
                autoClose: 4000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefPass.current.focus()
            return false
        } else if (passwordValue.length < 4) {
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
        } else {
            const data = {
                email: emailValue,
                password: passwordValue
            }
            console.log(data);
            setLoginBtnClicked(true);

            axios.post("https://btrproject.burundientempsreel.com/echangeur/login", data)
                .then(response => {
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
                    } else {
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
                                AsyncStorage.setItem('exchangeToken', response.data.token);
                                AsyncStorage.setItem('exchangeId', response.data.userId.toString());
                                navigation.navigate('UserExchange')
                                setEmailValue(""); setPasswordValue("");
                                console.log('Connected successfully');
                                setLoginBtnClicked(false);
                            }
                        })
                    }
                })
                .catch(error => {
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
                            <Text style={styles.title}>Echangeur</Text>
                            <Animated.Image
                                style={[styles.image, { transform: [{ translateY }] }]}
                                source={require("../../../assets/exchangepremier.png")}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.header}>Nous sommes ravis de vous retrouver encore.</Text>
                            </View>

                            <View style={styles.formContainer}>
                                <View style={styles.inputField}>
                                    <TextInput
                                        ref={elemetRefEmail}
                                        value={emailValue}
                                        onChangeText={setEmailValue}
                                        style={[styles.input, animationClassEmail]}
                                        placeholder="Adresse Email"
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View style={styles.inputField}>
                                    <TextInput
                                        value={passwordValue}
                                        ref={elemetRefPass}
                                        onChangeText={(text) => setPasswordValue(text)}
                                        style={[styles.input, animationClassPassword]}
                                        placeholder="Mot de passe"
                                        secureTextEntry={!passwordVisible}
                                    />
                                    <TouchableOpacity
                                        style={styles.passwordVisibility}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        <FontAwesome style={styles.passwordVisibilityText} size={30}
                                            name={passwordVisible ? "eye-slash" : "eye"} />

                                    </TouchableOpacity>
                                </View>

                                <View style={styles.linkText}>
                                    <TouchableOpacity style={styles.linkBtn}
                                        onPress={() => {
                                            Alert.alert("Reset password initialized")
                                        }}>
                                        <Text style={{
                                            color: "blue", fontSize: 16,
                                            textDecorationLine: "underline"
                                        }}>
                                            Mot de passe oublié?</Text>
                                    </TouchableOpacity>
                                </View>
                                {loginBtnClicked ?
                                    <ActivityIndicator size="large" color="white" style={{
                                        backgroundColor: "#055bfa",
                                        borderRadius: 5, padding: 5
                                    }} /> :
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={LoginClient}
                                    >
                                        <Text style={styles.buttonText}>Se connecter</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={styles.linkCreateAccount}>
                                <Text style={{ fontSize: 16 }}>Vous n'avez pas de compte? </Text>
                                <TouchableOpacity style={styles.linkBtn}
                                    onPress={() => navigation.navigate('Regiter')}>
                                    <Text style={{
                                        color: "blue", fontSize: 16,
                                        textDecorationLine: "underline"
                                    }}>
                                        Créez-en un ici</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </ScrollView >
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
        marginVertical: 20
    },
    loginBox: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "black",
        borderRadius: 5,
        padding: 10
    },
    image: {
        width: "100%",
        height: 300,
    },
    title: {
        fontSize: 22, textAlign: 'center', position: "absolute",
        top: 0, alignSelf: "center", color: "white",
    },
    inputContainer: {
        width: "95%",
        marginTop: 50,
    },
    headerContainer: {
        justifyContent: "center",
    },
    header: {
        fontSize: 20,
        margin: 10,
        color: "#313042",
        textAlign: "center"
    },
    headerText: {
        fontSize: 25,
        margin: 10,
        color: "#114025",
        textAlign: "center"
    },
    formContainer: {
        width: "100%",
    },
    inputField: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: "#909091",
        fontSize: 18,
        width: "100%",
        paddingHorizontal: 5
    },
    inputError: {
        borderColor: "red",
        borderWidth: 2,
        borderBottomColor: "red",
    },
    passwordVisibility: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    passwordVisibilityText: {
        color: "#0f0f0f",
        textAlign: "right",
    },
    button: {
        backgroundColor: "#3029f2", padding: 5,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
    },

    linkBtn: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    linkText: {
        alignSelf: "flex-end",
        flexDirection: "row",
        margin: 5
    },
    linkCreateAccount: {
        alignSelf: "flex-end",
        flexDirection: "row",
        padding: 5
    }
});

export default BuyerSignIn;