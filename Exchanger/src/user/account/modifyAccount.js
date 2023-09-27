import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
    StyleSheet, ToastAndroid, Button, Image, Alert, RefreshControl
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';


import BTRSpinner from '../../spinner';

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


export default function ModifyAccountInfo() {

    const navigation = useNavigation();

    // ----------------------------------------------------------------
    /* Select the profile picture */
    // ----------------------------------------------------------------
    var defaultImg = "../../../assets/BTR.png";
    const [image, setImage] = useState(null);
    const [profile, setProfile] = useState("");

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.showWithGravity('Sorry, we need camera roll permissions to make this work!',
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

    const elemetRefSelect = useRef(null);

    const [codeAgent, SetcodeAgent] = useState('');
    const elemetRefcodeAgent = useRef(null);

    const elemetRefSelect2 = useRef(null);

    const [accountInfo, setAccountInfo] = useState({});

    const [operateur, Setoperateur] = useState('');
    const [compteSuppl, setCompteSuppl] = useState({});

    const [refreshing, setRefreshing] = useState(false);
    const [changePassBtn, setChangePassBtn] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setChangePassBtn(false);
        }, 2000)
    }

    // ----------------------------------------------------------------
    // Select items for Operateurs
    // ----------------------------------------------------------------


    const [selectedOperators, setSelectedOperators] = useState("");

    const operateurs = [
        { label: "Selectionner un opérateur", val: "" },
        { label: 'Lumicash', value: 'Lumicash' },
        { label: 'Ecocash', value: 'Ecocash' },
        { label: 'Bancobu inoti', value: 'Bancobu inoti' },
        { label: 'CCM akaravyo', value: 'CCM akaravyo' },
        { label: 'Mobinotel', value: 'Mobinotel' }
    ];

    const operateursItems = operateurs.map((operateur) => (
        <Picker.Item label={operateur.label} value={operateur.value} key={operateur.label} />
    ));

    // ----------------------------------------------------------------
    /* Select items for banques */
    // ----------------------------------------------------------------

    const banques = [
        { label: 'Lumicash', value: 'Lumicash' },
        { label: 'Ecocash', value: 'Ecocash' },
        { label: 'Bancobu inoti', value: 'Bancobu inoti' },
        { label: 'CCM akaravyo', value: 'CCM akaravyo' },
        { label: 'Mobinotel', value: 'Mobinotel' }
    ];

    const banquesItems = banques.map((banque) => (
        <Picker.Item label={banque.label} value={banque.value} key={banque.value} disabled={banque.isDisabled} />
    ));

    const [selectedBanques, setSelectedBanques] = useState([]);
    const [banks, setBanks] = useState([]);

    const handleBanqueSelection = (value) => {
        if (value !== '') {
            setSelectedBanques([...selectedBanques, value]);
            setBanks([...selectedBanques, value]);
        }
    };

    const selectedBanquesDisplay = selectedBanques.map((fruit) => (
        <View style={styles.selectedBan} key={generateRandomString(7)}>
            <Text style={{ fontSize: 16 }}>{fruit}</Text>
            <Ionicons name='close-circle' color='red' style={styles.removeButton}
                onPress={() => handleRemoveSelection2(fruit)} size={35} />
        </View>
    ));

    const handleRemoveSelection2 = (value) => {
        const filteredSelectionBanque = selectedBanques.filter((fruit) => fruit !== value);
        setSelectedBanques(filteredSelectionBanque);
        setBanks(filteredSelectionBanque);
    };


    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("exchangerToken");
            const id = await AsyncStorage.getItem("exchangeId");
            //console.log(id);
            axios.get(`https://btrproject.burundientempsreel.com/echangeur/buyId/${id}`)
                .then((response) => {

                    console.log("Infos fetched successfully: ", response.data.banck);
                    Setnom(response.data.nom); Setprenom(response.data.prenom);
                    setEmailValue(response.data.email);
                    SetTel(response.data.tel);
                    SetcodeAgent(response.data.codeagent);
                    setProfile(response.data.profil);
                    setCompteSuppl([response.data.Compteechangeur.compte]);
                    Setoperateur(response.data.banck)
                    setAccountInfo(response.data);
                    //setCompteSuppl(response.data.Compteechangeur);
                })
                .catch((error) => {
                    console.error(error);
                })
        }

        getItemsStored();
    }, [refreshing])

    const telRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const ModifierInfo = async (e) => {

        console.log("banck", selectedOperators);
        console.log("compte", banks);

        if (nom.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Nom incomplet',
                textBody: 'Veuillez indiquer votre nom',
                autoClose: 3000, titleStyle: { color: "red" },
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
                autoClose: 3000, titleStyle: { color: "red" },
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
                autoClose: 3000, titleStyle: { color: "red" },
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
        } else if (tel.length < 8) {
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
        else if (selectedOperators.length <= 0) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Opérateur principal incomplet',
                textBody: 'L\'opérateur principal à utiliser est requis',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefSelect.current.focus();
        }
        else if (banks.length <= 0) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Opérateurs supplémentaires incomplets',
                textBody: 'Vous pouvez choisir au moins un en cas de besoin que vous pouvez utiliser',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            ToastAndroid.showWithGravity("La banque est requise", ToastAndroid.LONG, ToastAndroid.CENTER)
            elemetRefSelect2.current.focus();
        }
        else if (codeAgent.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Code Agent incomplet',
                textBody: 'Votre Code Agent est requis',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            elemetRefcodeAgent.current.focus();
        }
        else if (codeAgent.length < 4 && !codeAgent.match(telRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Code Agent est invalide',
                textBody: 'Il doit contenir 5 chiffres seulement',
                autoClose: 3000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            ToastAndroid.showWithGravity("Le Code d'agent doit avoir au moins 4 chiffres/nombres", ToastAndroid.LONG, ToastAndroid.CENTER)
            elemetRefcodeAgent.current.focus();
        }
        else {
            const id = await AsyncStorage.getItem("exchangeId");
            const formData = new FormData();
            formData.append('nom', nom);
            formData.append('prenom', prenom);
            formData.append('tel', tel);
            formData.append('codeagent', codeAgent);
            formData.append("banck", selectedOperators);
            formData.append("compte", banks);

            if (image != null) {
                formData.append('profil', {
                    uri: image, name: 'image.jpg', type: 'image/jpeg',
                });
            }

            Alert.alert("Confirmation de modification",
                "Voulez-vous vraiment modifier les informations de votre compte",
                [
                    { "text": "No, annuler", onPress: () => { return; } },
                    {
                        "text": "Oui, Modifier", onPress: async () => {
                            setChangePassBtn(true);
                            await axios.put(`https://btrproject.burundientempsreel.com/echangeur/modifyaccount/${id}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((response) => {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS, autoClose: 2000,
                                    title: "Modifiés avec succès",
                                    textBody: "Les identifiants ont été modifiés avec succès !",
                                    titleStyle: { color: "green" },
                                    textBodyStyle: { color: "green" },
                                    onShow: () => { setChangePassBtn(false); },
                                    onPress: () => { Toast.hide(); },
                                    onHide: () => {
                                        navigation.navigate(
                                            "UserAccount", { modified: true }
                                        );
                                    },
                                });
                            }).catch((error) => {
                                console.log(error.message);
                                console.error(error.response);
                                setChangePassBtn(false);
                            });

                        }
                    }
                ]
            )

        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} colors={["blue", "black"]} />}
        >

            <View style={styles.container}>

                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.goBack}
                        onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 20, textAlign: "center", color: "white" }}>Retourner</Text>
                    </TouchableOpacity>
                </View>

                {Object.keys(accountInfo).length === 0 ?
                    <BTRSpinner />
                    :
                    <>
                        <Text style={styles.heading}>Modification des Informations</Text>
                        <View style={styles.form}>
                            <View style={styles.innerFormContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Nom</Text>
                                    <TextInput
                                        ref={elemetRefNom}
                                        style={[styles.input]}
                                        value={nom}
                                        onChangeText={(text) => Setnom(text)}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Prénom</Text>
                                    <TextInput
                                        ref={elemetRefPrenom}
                                        style={[styles.input]}
                                        value={prenom}
                                        onChangeText={(text) => Setprenom(text)}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Téléphone</Text>
                                    <TextInput
                                        ref={elemetRefTel}
                                        style={styles.input}
                                        value={tel}
                                        onChangeText={(text) => SetTel(text)}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.innerFormContainer}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        ref={elemetRefEmail}
                                        style={styles.input}
                                        value={emailValue}
                                        onChangeText={(text) => setEmailValue(text)}
                                        keyboardType="email-address"
                                    />
                                </View>

                                {/*Select operateurs*/}
                                <View style={{ width: "100%" }}>
                                    <Picker
                                        selectedValue={selectedOperators}
                                        onValueChange={(value) => setSelectedOperators(value)}
                                        mode="dialog"
                                        style={{
                                            backgroundColor: "#ccc",
                                            margin: 10,
                                        }}
                                        ref={elemetRefSelect}
                                    >
                                        {operateursItems}
                                    </Picker>
                                </View>
                                <Text style={{ color: "black" }}>{operateur} </Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Code Agent</Text>
                                    <TextInput
                                        ref={elemetRefcodeAgent}
                                        style={styles.input}
                                        value={codeAgent}
                                        onChangeText={(text) => SetcodeAgent(text)}
                                        keyboardType='numeric'
                                    />
                                </View>

                                {/*Select banques*/}
                                <View>
                                    <Picker
                                        selectedValue={selectedBanques}
                                        onValueChange={(value) => handleBanqueSelection(value)}
                                        mode="dialog"
                                        style={{
                                            backgroundColor: "#ccc", height: 40, margin: 10,
                                            fontSize: 22, fontWeight: "bold"
                                        }}
                                        ref={elemetRefSelect2}
                                    >
                                        <Picker.Item label="Selectionner une banque" value="" />
                                        {banquesItems}
                                    </Picker>
                                    <View style={styles.selectedBanContainer}>
                                        <View>{selectedBanquesDisplay}</View>
                                    </View>
                                </View>
                                <View style={{
                                    width: "100%", alignSelf: "center",
                                    justifyContent: "center"
                                }}>
                                    <Text style={{ color: "black" }}>{compteSuppl} </Text>
                                </View>

                                <View style={{
                                    flex: 1, alignItems: 'center',
                                    justifyContent: 'center', margin: 10
                                }}>
                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <Text style={{
                                            paddingHorizontal: 10, fontSize: 20
                                        }}>Photo de profil </Text>
                                        <TouchableOpacity onPress={pickImage}>
                                            <FontAwesome name='image' size={20}
                                                color="blue" style={{
                                                    padding: 5,
                                                    borderRadius: 3,
                                                    backgroundColor: "#b1c8f0",
                                                }} />
                                        </TouchableOpacity>
                                    </View>
                                    {image != null ? (
                                        <Image source={{ uri: image }} style={{
                                            width: 200,
                                            height: 200,
                                            marginTop: 10,
                                            borderRadius: 10
                                        }} />
                                    ) : (
                                        <Image source={{
                                            uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${profile}`
                                        }} style={{
                                            width: 200,
                                            height: 200,
                                            marginTop: 10,
                                            borderRadius: 10
                                        }} />
                                    )}
                                </View>

                                <View style={{ marginBottom: 10 }}>
                                    {changePassBtn ?
                                        <ActivityIndicator size="large" color="white" style={{
                                            backgroundColor: "#055bfa",
                                            borderRadius: 5, padding: 5
                                        }} /> :
                                        <TouchableOpacity style={styles.btn} onPress={ModifierInfo}>
                                            <Text style={styles.btnText}>Modifier</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    </>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        alignSelf: "flex-end",
        marginHorizontal: 10, marginTop: 10
    },
    goBack: {
        backgroundColor: "blue",
        borderRadius: 5,
        padding: 5
    },
    container: {
        width: "95%",
        top: "1%"
    },
    heading: {
        fontSize: 24,
        marginBottom: 5, textAlign: "center",
        color: "#0b54d4"
    },
    form: {
        backgroundColor: "#edf7f7",
        borderRadius: 5,
        elevation: 5,
        padding: 8,
        margin: 10
    },
    label: {
        fontSize: 18,
        color: "#7e7f80",
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#7e7f80',
        borderRadius: 0,
        backgroundColor: 'transparent',
        width: '100%',
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
        backgroundColor: '#3029f2', padding: 5, borderRadius: 5,
        marginTop: 5, alignItems: 'center', justifyContent: "center"
    },
    btnText: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
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
