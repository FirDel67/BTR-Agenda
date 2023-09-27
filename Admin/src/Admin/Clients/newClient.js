import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
    StyleSheet, ToastAndroid, Button, Image, RefreshControl, Alert
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';


import NavBarsClientEchangeAdmin from '../nvarbar/navBar';

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export default function AddClient() {

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
        }, 3000);
    };

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

    const navigation = useNavigation();

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

    const [passwordValue, setPasswordValue] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const elemetRefPass = useRef(null);

    const [confPass, SetconfPass] = useState('');
    const [ConfpasswordVisible, setConfPasswordVisible] = useState(false);
    const elemetRefConfPass = useRef(null);

    // ----------------------------------------------------------------
    // Select items for Operateurs
    // ----------------------------------------------------------------

    const operateurs = [
        { label: 'Lumicash', value: 'Lumicash' },
        { label: 'Ecocash', value: 'Ecocash' },
        { label: 'Bancobu inoti', value: 'Bancobu inoti' },
        { label: 'CCM akaravyo', value: 'CCM akaravyo' },
        { label: 'Mobinotel', value: 'Mobinotel' }
    ];

    const operateursItems = operateurs.map((operateur) => (
        <Picker.Item label={operateur.label} value={operateur.value} key={operateur.value} />
    ));

    const [selectedOperators, setSelectedOperators] = useState();

    const handleOperatorSelection = (value) => {
        if (value !== '') {
            setSelectedOperators([...selectedOperators, value]);
        }
    };
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
            <Text style={{ fontSize: 20 }}>{fruit}</Text>
            <Ionicons name='close-circle' color='red' style={styles.removeButton}
                onPress={() => handleRemoveSelection2(fruit)} size={35} />
        </View>
    ));

    const handleRemoveSelection2 = (value) => {
        const filteredSelectionBanque = selectedBanques.filter((fruit) => fruit !== value);
        setSelectedBanques(filteredSelectionBanque);
        setBanks(filteredSelectionBanque);
    };


    const telRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/i;

    const handleSubmit = (e) => {


        if (confPass.trim() != passwordValue.trim()) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Mots de Passe differents',
                textBody: 'Veuillez réessayer',
                autoClose: 3000,
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
        }
        else {
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
                    textBody: 'Votre Prénom est requis',
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
            else if (tel.length < 8) {
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
                elemetRefEmail.current.focus();
            }
            else if (selectedOperators.length <= 0) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "L'opérateur principal",
                    textBody: "L'opérateur principale à utiliser est requis",
                    autoClose: 3000,
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()

                })
                elemetRefSelect.current.focus();
            }
            else if (codeAgent.trim() === '') {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Code Agent incomplet',
                    textBody: 'Votre code agent est requis',
                    autoClose: 3000,
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()

                })
                elemetRefcodeAgent.current.focus();
            }
            else if (!codeAgent.match(telRegex) || codeAgent.trim().length != 5) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Code Agent est invalide',
                    textBody: 'Il doit contenir 5 chiffres seulement',
                    autoClose: 3000,
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()

                })
                elemetRefcodeAgent.current.focus();
            }
            else if (passwordValue.trim() === '') {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Mot de passe incomplet',
                    textBody: 'Votre Mot de passe a utilisé est requis',
                    autoClose: 3000,
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
                    autoClose: 3000,
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
                    autoClose: 4000,
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()

                })
                elemetRefPass.current.focus();
            }
            else if (confPass.trim() === '') {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Confirmation',
                    textBody: 'Veuillez confirmer le mot de passe',
                    autoClose: 3000,
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()

                })
                elemetRefConfPass.current.focus();
            }
            else {
                if (image != null) {
                    setLoginBtnClicked(true);

                    const formData = new FormData();
                    formData.append("nom", nom);
                    formData.append("prenom", prenom);
                    formData.append("email", emailValue);
                    formData.append("tel", tel);
                    formData.append("codeagent", codeAgent);
                    formData.append("banck", selectedOperators);
                    formData.append("compte", banks);
                    formData.append("password", passwordValue);
                    formData.append("profil", {
                        uri: image,
                        name: 'image.jpg',
                        type: 'image/jpeg',
                    });

                    console.log(formData);
                    axios.post(`https://btrproject.burundientempsreel.com/echangeur/supperadd`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    })
                        .then(response => {
                            console.log(response.data)
                            if (response.data.error) {
                                Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: "Erreur lors de la création du Compte",
                                textBody: `${response.data.error}`,
                                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                                onPress: () => { Toast.hide() },
                                onShow: () => { setLoginBtnClicked(false) }
                            });
                                console.log('Error: ', response.data.error)
                            } else {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: 'Compte créé avec succès',
                                    textBody: 'Redirection vers les Clients en attente de Validation',
                                    autoClose: 3000,
                                    titleStyle: { color: "green" },
                                    textBodyStyle: { color: "green" },
                                    onPress: () => {Toast.hide()},
                                    onShow: ()=>{setLoginBtnClicked(false);},
                                    onHide: () => {
                                        setLoginBtnClicked(false);
                                        navigation.navigate("ClientEnAttente", 
                                            {created: true } );
                                    }
                                })
                            }
                        })
                        .catch(error => {
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Erreur d'inscription",
                            textBody: `${error.response.data.error}`,
                            titleStyle: { color: "red" },
                            textBodyStyle: { color: "red" },
                            autoClose: 3000,
                            onPress: () => { Toast.hide() },
                            onShow: () => { setLoginBtnClicked(false); }
                        });
                            console.error("Axios request error for sending: ", error);
                            setLoginBtnClicked(false);
                        });
                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Photo de profil requis',
                        textBody: 'Vous devez specifier votre photo de profil s`\'il vous plaît',
                        autoClose: 3000,
                        textBodyStyle: { color: "red" },
                        onPress: () => Toast.hide()

                    })
                }
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} />}
        >
            <NavBarsClientEchangeAdmin />
            <View style={styles.container}>
                <View style={styles.containerInformation}>
                    <Text style={styles.title}>
                        <Text style={{ color: "#5f5" }}>Ajouter</Text>
                        <Text style={{ color: "orange" }}> un nouveau</Text>
                        <Text style={{ color: "#88d" }}> Client</Text>
                    </Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Nous sommes ravis que vous ayez choisi de vous inscrire. Pour commencer, veuillez remplir les informations demandées dans le formulaire ci-dessous. Nous aurons besoin des détails suivants :</Text>
                        <View style={styles.infoList}>
                            <Text style={styles.infoItem}>- Nom: Veuillez saisir son nom de famille.</Text>
                            <Text style={styles.infoItem}>- Prénom: Veuillez saisir son prénom de famille.</Text>
                            <Text style={styles.infoItem}>- Adresse e-mail valide: Assurez-vous de fournir une adresse e-mail correcte que nous pourrons utiliser pour vous contacter.</Text>
                            <Text style={styles.infoItem}>- Numéro de téléphone: Veuillez entrer son numéro de téléphone actif.</Text>
                            <Text style={styles.infoItem}>- Choix de l'opérateur: Sélectionnez l'opérateur qu'il veut utiliser comme son monnaie électronique, que ce soit Lumicash, Ecocash ou autre.</Text>
                            <Text style={styles.infoItem}>- Code agent: S'il dispose d'un code agent spécifique, veuillez le mentionner ici.</Text>
                            <Text style={styles.infoItem}>- Nom de la carte SIM: Veuillez indiquer le nom associé à son carte SIM.</Text>
                            <Text style={styles.infoItem}>- Mot de passe: Choisissez un mot de passe sécurisé pour son compte.</Text>
                        </View>
                        <Text style={styles.infoText}>Assurez-vous de remplir tous les champs requis avec des informations précises et à jour. Une fois que vous avez soumis le formulaire, nous traiterons votre demande en envoyant un message sur votre email dans les plus brefs délais.</Text>
                    </View>
                </View>
                <Text style={styles.heading}>Inscription du Client</Text>
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
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        ref={elemetRefEmail}
                        style={styles.input}
                        value={emailValue}
                        onChangeText={(text) => setEmailValue(text)}
                        keyboardType="email-address"
                    />

                    {/*Select operateurs*/}
                    <Picker
                        selectedValue={selectedOperators}
                        onValueChange={(value) => setSelectedOperators(value)}
                        mode="dialog"
                        style={{
                            backgroundColor: "#ccc", marginVertical: 5,
                        }}
                        ref={elemetRefSelect}
                    >
                        <Picker.Item label="Selectionner un opérateur" value="" />
                        {operateursItems}
                    </Picker>

                    <Text style={styles.label}>Code Agent</Text>
                    <TextInput
                        ref={elemetRefcodeAgent}
                        style={styles.input}
                        value={codeAgent}
                        onChangeText={(text) => SetcodeAgent(text)}
                        keyboardType='numeric'
                    />

                    {/*Select banques*/}
                    <Picker
                        selectedValue={selectedBanques}
                        onValueChange={(value) => handleBanqueSelection(value)}
                        mode="dialog"
                        style={{
                             backgroundColor: "#ccc", marginVertical: 5,
                        }}
                        ref={elemetRefSelect2}
                    >
                        <Picker.Item label="Selectionner une banque" value="" />
                        {banquesItems}
                    </Picker>
                    <View style={styles.selectedBanContainer}>
                        <View>{selectedBanquesDisplay}</View>
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
                        {image && <Image source={{ uri: image }} style={{
                            width: 200, height: 200, marginTop: 10, borderRadius: 10
                        }} />}
                    </View>

                    {loginBtnClicked ?
                        <ActivityIndicator size="large" color="white" style={{
                            backgroundColor: "#055bfa",
                            borderRadius: 5, padding: 5
                        }} />  :
                        <TouchableOpacity style={[styles.btn, {
                            flexDirection: "row"
                        }]} onPress={handleSubmit}>
                            <Text style={styles.btnText}>S'inscrire</Text>
                            <FontAwesome name='paper-plane-o' size={20} color="white" />
                        </TouchableOpacity>
                    }
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
        alignContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        padding: 20,
    },
    heading: {
        fontSize: 22,
        color: "#0b54d4",
        textAlign: 'center',
        padding: 10
    },
    form: {
        flex: 1,
        backgroundColor: "#f7f8fa",
        borderRadius: 5,
        padding: 10,
        borderColor: "#2738f2",
        borderWidth: 1,
    },
    label: {
        fontSize: 16,
        color: "#909091",
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#909091',
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
        paddingHorizontal: 10
    },
    btn: {
         backgroundColor: '#3029f2', padding: 5, borderRadius: 5,
        marginTop: 10, alignItems: 'center', justifyContent: "center"
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
        fontSize: 27,
        marginBottom: 20,
        color: "#0b54d4"
    },
    containerInformation: {
        alignItems: 'center',
        backgroundColor: "#f2f2f5",
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
