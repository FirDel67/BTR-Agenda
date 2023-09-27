import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
    StyleSheet, ToastAndroid, RefreshControl, Image, ActivityIndicator
} from 'react-native';


import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import BTRSpinner from '../../spinner';

export default function ModifyAdminInfo() {

    const navigation = useNavigation();
    const route = useRoute();

    // ----------------------------------------------------------------
    /* Select the profile picture */
    // ----------------------------------------------------------------
    const [image, setImage] = useState(null);
    const [isUser, setIsUser] = useState(true);
    const [isMail, setIsMail] = useState(false);

    const [infos, setInfos] = useState({});
    const [refresh, setRefresh] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    }

    const onRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
            setLoginBtnClicked(false);
        }, 2000)
    }

    setTimeout(() => {
        setIsUser(false);
        setIsMail(false);
    }, 5000);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Permission refusée",
                    textBody: 'Désolé, nous avons besoin des autorisations de pellicule pour que cela fonctionne !',
                    titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                    autoClose: 5000, onPress: () => Toast.hide(),
                });
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

    const [nom, Setnom] = useState("");
    const elemetRefNom = useRef(null);

    const [prenom, Setprenom] = useState("");
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

    const [spId, setSpId] = useState('');

    //console.log(route.params?.spId)
    useEffect(() => {
        const getSuperAgentInfos = async () => {
            const id = await AsyncStorage.getItem("spId")
            const response = await axios.get(`https://btrproject.burundientempsreel.com/surperagent/buyId/${id}`)
            setInfos(response.data)
            Setnom(response.data.nom); Setprenom(response.data.prenom);
            SetTel(response.data.tel); setEmailValue(response.data.email);
            SetAssociation(response.data.nomSociete); setNif(response.data.NIF);
            setCodeSupAg(response.data.codeSuperAgent);
            setIdentity(response.data.CNI); setAdresse(response.data.address);

            setSpId(response.data.id);
            //setTimeout(getSuperAgentInfos, 5000);
        }

        console.log("Modify infos here");
        getSuperAgentInfos();
    }, [refresh]);

    const telRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const ModifyClientInfos = (e) => {

        if (nom.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Nom incomplet',
                textBody: 'Veuillez indiquer votre nom',
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            elemetRefNom.current.focus();
        }
        else if (prenom.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Prénom incomplet',
                textBody: 'Veuillez indiquer votre prénom',
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefTel.current.focus();
        } else if (tel.length < 8) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Numéro de téléphone invalide',
                textBody: 'Vérifier que votre numéro de téléphone a au moins 8 chiffres',
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            ToastAndroid.showWithGravity("L'Adresse email est invalide\nVeuillez entrer votre propre email valide\nExemple: burundientempsreel@gmail.com", ToastAndroid.LONG, ToastAndroid.CENTER)
            elemetRefEmail.current.focus();
        }
        else if (association.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Champ Société complet',
                textBody: 'Le nom de votre Société est obligatoire',
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
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
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()

            })
            adresseRef.current.focus();
        }
        else {
            console.log('Modifying...');
            setLoginBtnClicked(true);

            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("prenom", prenom);
            formData.append("email", emailValue);
            formData.append("tel", tel);
            formData.append("NIF", nif);
            formData.append("address", adresse);
            formData.append("CNI", identity);
            formData.append("codeSuperAgent", codeSupAg);
            formData.append("nomSociete", association);

            if (image !== null) {
                formData.append("photo", {
                    uri: image,
                    name: 'image.jpg',
                    type: 'image/jpeg',
                });
            }
            axios.put(`https://btrproject.burundientempsreel.com/surperagent/modifyaccount/${spId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                console.log(response.data);
                if (response.data.error) {
                    console.error(response.data.error);
                } else {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Modifiées avec succès!",
                        textBody: "Les informations de votre compte ont été modifiées avec succès!",
                        titleStyle: { color: "green" }, textBodyStyle: { color: "green" },
                        onPress: () => { Toast.hide() },
                        onHide: () => {
                            navigation.navigate('AdminAccount', {
                                updated: true
                            })
                        },
                        onShow: () => { setLoginBtnClicked(false) }
                    });
                }
                setImage(null);
            }).catch((error) => {
                console.log(error.message);
                console.error(error.response.data);
                setLoginBtnClicked(false);
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refresh}
                onRefresh={onRefresh} />}
        >
            <View style={styles.backButton}>
                <TouchableOpacity style={styles.goBack}
                    onPress={() => navigation.goBack()}>
                    <Text style={{ fontSize: 25, textAlign: "center", color: "white" }}>Retourner</Text>
                </TouchableOpacity>
            </View>

            {Object.keys(infos).length === 0 ?
                <BTRSpinner />
                :
                <View style={styles.container}>
                    <View style={styles.mainContainer}>
                        <Text style={styles.heading}>Modification des données</Text>
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

                            <View style={{
                                flex: 1, alignItems: 'center',
                                justifyContent: 'center', margin: 10
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
                                <Image source={image ? ({ uri: image }) : ({ uri: `https://btrproject.burundientempsreel.com/uploads/photosuperagent/${infos.photo}` })} style={{
                                    width: 200, height: 200, marginTop: 10, borderRadius: 10
                                }} />
                            </View>

                            {loginBtnClicked ?
                                <ActivityIndicator size="large" color="blue" style={{
                                    backgroundColor: "#0567fa", width: "100%"
                                }} /> :
                                <TouchableOpacity style={styles.btn} onPress={ModifyClientInfos}>
                                    <Text style={styles.btnText}>Modifier</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            }
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
        padding: 10,
        width: "100%",
    },
    backButton: {
        alignSelf: "flex-end",
        marginTop: 25,
        marginRight: 10
    },
    goBack: {
        backgroundColor: "#0567fa",
        borderRadius: 5,
        padding: 5
    },
    mainContainer: {
        width: "100%"
    },
    heading: {
        fontSize: 22,
        color: "#0b54d4",
        textAlign: 'center',
        padding: 10
    },
    form: {
        flex: 1,
        backgroundColor: "#edf7f7",
        borderRadius: 5,
        elevation: 20,
        padding: 8
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
        borderBottomColor: '#039c1a',
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
        paddingHorizontal: 10
    },
    btn: {
        backgroundColor: '#0567fa',
        padding: 5,
        borderRadius: 5,
        marginTop: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
    title: {
        fontSize: 27,
        textAlign: 'center',
        marginBottom: 20
    },
    containerInformation: {
        alignItems: 'center',
        backgroundColor: "#edf7f7",
        borderRadius: 5,
        elevation: 5,
        padding: 8,
    },
    infoText: {
        color: 'gray',
        marginBottom: 10
    },
    infoList: {
        paddingLeft: 20,
        marginBottom: 20
    },
    infoItem: {
        marginBottom: 5
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
});
