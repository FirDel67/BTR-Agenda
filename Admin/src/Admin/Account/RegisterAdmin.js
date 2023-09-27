import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl,
    StyleSheet, ToastAndroid, Button, Image, Alert, ActivityIndicator
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

export default function AdminSignUp() {

    const navigation = useNavigation();

    // ----------------------------------------------------------------
    /* Select the profile picture */
    // ----------------------------------------------------------------
    const [image, setImage] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            setLoginBtnClicked(false);
        }, 2000);
    };

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Toast.show('Désolé, nous avons besoin des autorisations de pellicule pour que cela fonctionne !',
                    ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const [nom, Setnom] = useState('');
    const elemetRefNom = useRef(null);

    const [prenom, Setprenom] = useState('');
    const elemetRefPrenom = useRef(null);

    const [tel, SetTel] = useState('');
    const elemetRefTel = useRef(null);

    const [emailValue, setEmailValue] = useState('');
    const elemetRefEmail = useRef(null);

    const [association, SetAssociation] = useState('');
    const associationRef = useRef(null);

    const [codeSupAg, setCodeSupAg] = useState('');
    const codeSupAgentRef = useRef(null);

    const [nif, setNif] = useState('');
    const nifRef = useRef(null);

    const [identity, setIdentity] = useState('');
    const idRef = useRef(null);

    const [adresse, setAdresse] = useState('');
    const adresseRef = useRef(null);

    const [passwordValue, setPasswordValue] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const elemetRefPass = useRef(null);

    const [confPass, SetconfPass] = useState('');
    const [ConfpasswordVisible, setConfPasswordVisible] = useState(false);
    const elemetRefConfPass = useRef(null);

    const telRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/i;

    const RegisterClient = (e) => {

        if (nom.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Nom incomplet',
                textBody: 'Veuillez indiquer votre nom',
                autoClose: 3000,titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefNom.current.focus();
        }
        else if (prenom.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Prénom incomplet',
                textBody: 'Votre Prénom est requis',
                autoClose: 3000,titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefPrenom.current.focus();
        }
        else if (tel.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Numéro de téléphone incomplet',
                textBody: 'Votre Numéro de téléphone est requis',
                autoClose: 3000,titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefTel.current.focus();
        }
        else if (!tel.match(telRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Numéro de téléphone invalide',
                textBody: 'Veuillez utiliser des nombres valides de 0-9',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefTel.current.focus();
        }
        else if (tel.length < 8) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Numéro de téléphone invalide',
                textBody: 'Vérifier que votre numéro de téléphone a au moins 8 chiffres',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefTel.current.focus();
        }
        else if (emailValue.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Email incomplet",
                textBody: "L'adresse email est requise",
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefEmail.current.focus();
        }
        else if (!emailValue.match(emailRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Email invalide',
                textBody: 'Veuillez entrer votre propre email valide\nExemple: burundientempsreel@gmail.com',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefEmail.current.focus();
        }
        else if (association.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Champ Société complet',
                textBody: 'Le nom de votre Société est obligatoire',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            associationRef.current.focus();
        }
        else if (codeSupAg.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Code SuperAgent incomplet',
                textBody: 'Votre code de SuperAgent est requis',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            codeSupAgentRef.current.focus();
        }
        else if (!codeSupAg.trim().match(telRegex) || codeSupAg.trim().length != 5) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Code de SuperAgent est invalide',
                textBody: 'Il doit contenir 5 chiffres seulement',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            codeSupAgentRef.current.focus();
        }
        else if (nif.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'NIF incomplet',
                textBody: 'Votre Numéro d\'Identification Fiscale est obligatoire',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            nifRef.current.focus();
        }
        else if (identity.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Identité incomplet',
                textBody: 'Numéro de votre Identité Nationale',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            idRef.current.focus();
        }
        else if (adresse.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Adresse est requise',
                textBody: 'Votre adresse actuelle est obligatoire',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            adresseRef.current.focus();
        }
        else if (passwordValue.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Mot de passe incomplet',
                textBody: 'Votre Mot de passe a utilisé est requis',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefPass.current.focus();
        }
        else if (passwordValue.length < 4) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe est trop petit',
                textBody: 'Il doit avoir au moins 4 caratères',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefPass.current.focus();
        }
        else if (!passwordValue.match(passwordRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe n\'est pas sécurisé',
                textBody: 'Veuillez combinez un majuscule, un minuscule,un caractère et un chiffre\nExemple:@Admin4',
                autoClose: 4000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefPass.current.focus();
        }
        else if (confPass.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Confirmation de mot de passe',
                textBody: 'Veuillez retaper le mot de passe',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefConfPass.current.focus();
        }
        else if (confPass.trim() != passwordValue.trim()) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Mots de Passe differents',
                textBody: 'Veuillez réessayer',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
        }
        else if (image == null) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Photo de profil requis',
                textBody: 'Vous devez specifier votre photo de profil s\'il vous plaît',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
        }
        else {
            setLoginBtnClicked(true);

            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("prenom", prenom);
            formData.append("email", emailValue);
            formData.append("password", passwordValue);
            formData.append("tel", tel);
            formData.append("NIF", nif);
            formData.append("address", adresse);
            formData.append("CNI", identity);
            formData.append("codeSuperAgent", codeSupAg);
            formData.append("nomSociete", association);
            formData.append("photo", {
                uri: image,
                name: 'image.jpg',
                type: 'image/jpeg',
            });

            console.log(formData);

            try {
                axios
                    .post("https://btrproject.burundientempsreel.com/surperagent/register", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        if (response.data.error) {
                            console.log("Erreur: ", response.data.error);
                        } else {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: "Inscription réussie",
                                textBody: "Bienvenue en tant que superagent. Explorez nos services et contactez-nous en cas de besoin. Bonne chance !\nRedirection vers la page de connexion",
                                autoClose: 5000,
                                titleStyle: { color: "green" }, textBodyStyle: { color: "green" },
                                onPress: () => { Toast.hide() },
                                onShow: () => { setLoginBtnClicked(false); },
                                onHide: () => {
                                    Setnom(""); Setprenom(""); setEmailValue("");
                                    setCodeSupAg(''); setNif(""); setIdentity("");
                                    setImage(null); setPasswordValue("");
                                    SetconfPass(""); SetTel(""); SetAssociation("");
                                    setAdresse("");
                                    navigation.navigate('AdminLogin');
                                    setLoginBtnClicked(false);
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Erreur d'inscription",
                            textBody: error.response.data.error,
                            titleStyle: { color: "red" },
                            textBodyStyle: { color: "red" },
                            autoClose: 3000,
                            onPress: () => { Toast.hide() }
                        });
                    });
            } catch (error) {
                console.error("Error from catch statement: " + error)
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} />}
        >
            <View style={styles.container}>
                <View style={styles.containerInformation}>
                    <Text style={styles.title}>
                        Bienvenue sur notre plateforme d'échange  de monnaie électronique
                    </Text>
                </View>
                <Text style={styles.heading}>Inscription du SuperAgent</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        ref={elemetRefNom}
                        style={[styles.input]}
                        value={nom}
                        onChangeText={(text) => Setnom(text)}
                    />
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                        ref={elemetRefPrenom}
                        style={[styles.input]}
                        value={prenom}
                        onChangeText={(text) => Setprenom(text)}
                    />

                    <Text style={styles.label}>Téléphone</Text>
                    <TextInput
                        ref={elemetRefTel}
                        style={styles.input}
                        value={tel}
                        onChangeText={(text) => SetTel(text)}
                        keyboardType="phone-pad"
                    />
                    <Text style={styles.label}>Email valide</Text>
                    <TextInput
                        ref={elemetRefEmail}
                        style={styles.input}
                        value={emailValue}
                        onChangeText={(text) => setEmailValue(text)}
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Nom de la Société</Text>
                    <TextInput
                        ref={associationRef}
                        style={styles.input}
                        value={association}
                        onChangeText={(text) => SetAssociation(text)}
                    />

                    <Text style={styles.label}>Code SuperAgent</Text>
                    <TextInput
                        ref={codeSupAgentRef}
                        style={styles.input}
                        value={codeSupAg}
                        onChangeText={(text) => setCodeSupAg(text)}
                        keyboardType='numeric'
                    />

                    <Text style={styles.label}>NIF</Text>
                    <TextInput
                        ref={nifRef}
                        style={[styles.input]}
                        value={nif}
                        onChangeText={(text) => setNif(text)}
                    />

                    <Text style={styles.label}>Identité</Text>
                    <TextInput
                        ref={idRef}
                        style={[styles.input]}
                        value={identity}
                        onChangeText={(text) => setIdentity(text)}
                    />

                    <Text style={styles.label}>Adresse Actuelle</Text>
                    <TextInput
                        ref={adresseRef}
                        style={[styles.input]}
                        value={adresse}
                        onChangeText={(text) => setAdresse(text)}
                    />

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
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            ref={elemetRefConfPass}
                            style={[
                                styles.input,
                                styles.passwordInput]}
                            value={confPass}
                            onChangeText={(text) => SetconfPass(text)}
                            secureTextEntry={!ConfpasswordVisible}
                        />
                        <TouchableOpacity
                            style={styles.passwordIconContainer}
                            onPress={() => setConfPasswordVisible(!ConfpasswordVisible)}
                        >
                            <Ionicons
                                name={ConfpasswordVisible ? 'eye' : 'eye-off'}
                                size={30}
                                color="#555"
                                style={styles.passwordIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1, alignItems: 'flex-start',
                        justifyContent: 'center', width: '100%',
                    }}>
                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <Text style={{
                                paddingHorizontal: 10, fontSize: 25
                            }}>Photo de profil </Text>
                            <TouchableOpacity onPress={pickImage}>
                                <FontAwesome name='image' size={25}
                                    color="blue" style={{
                                        padding: 5,
                                        borderRadius: 3,
                                        backgroundColor: "#b1c8f0",
                                    }} />
                            </TouchableOpacity>
                        </View>
                        {image && <Image source={{ uri: image }} style={{
                            width: 200, height: 200, marginTop: 5,
                            borderRadius: 5, alignSelf: "center",
                            backgroundColor: "#1e1f1f", padding: 5
                        }} />}
                    </View>

                    {loginBtnClicked ? <ActivityIndicator size="large"
                        color="white" style={{
                            width: "100%", borderRadius: 5,
                            backgroundColor: "#3029f2"
                        }}
                    /> :
                        <TouchableOpacity style={[styles.btn, {
                            flexDirection: "row"
                        }]} onPress={RegisterClient}>
                            <Text style={styles.btnText}>S'inscrire</Text>
                            <FontAwesome name='paper-plane-o' size={20} color="white" />
                        </TouchableOpacity>
                    }
                    <View style={styles.linkContainer}>
                        <Text style={{ fontSize: 16 }}>Vous avez déjà un compte? </Text>
                        <TouchableOpacity style={styles.linkBtn}
                            onPress={() => navigation.navigate('AdminLogin')}>
                            <Text style={{
                                color: 'blue', fontSize: 16,
                                textDecorationLine: "underline"
                            }}>
                                Connectez-vous ici</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.helpText}>
                    <Text style={{
                        fontSize: 15, paddingHorizontal: 10,
                        paddingTop: 10, color: "#79868a", textAlign: "center"
                    }}>
                        Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter.
                        Merci de votre confiance et bienvenue dans notre communauté d'échange de monnaie électronique.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        margin: 3
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        width: "100%",
    },
    heading: {
        fontSize: 22,
        color: "#0b54d4",
        textAlign: 'center',
        padding: 10
    },
    form: {
        flex: 1,
        backgroundColor: "#f2f3f5",
        borderRadius: 5,
        elevation: 5,
        padding: 15
    },
    label: {
        fontSize: 16,
        color: "#909091",
        marginTop: 8,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#909091',
        borderRadius: 0,
        backgroundColor: 'transparent',
        width: '100%',
        fontSize: 16
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
    btn: {
        backgroundColor: '#3029f2',
        padding: 5,
        borderRadius: 5,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: "center"
    },
    btnText: {
        color: '#fff',
        fontSize: 25,
        textAlign: 'center',
        paddingHorizontal: 20
    },

    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
    title: {
        fontSize: 20,
        color: "#0b54d4",
        textAlign: 'center',
    },
    containerInformation: {
        alignItems: 'center',
        backgroundColor: "#f2f2f5",
        borderRadius: 5,
        elevation: 5,
    },

    // ----------------------------------------------------------------
    // Styles For selections values
    selectedBanContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#6e95d4",
    },
    selectedBan: {
        backgroundColor: '#ddd',
        borderRadius: 5,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 20,
    },
    removeButton: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: "red",
    },

    linkContainer: {
        alignSelf: "flex-end",
        marginTop: 10
    },
});
