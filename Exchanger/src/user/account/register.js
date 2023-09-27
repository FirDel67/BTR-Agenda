import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl,
    StyleSheet, ToastAndroid, Alert, Image, ActivityIndicator
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';


function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


export default function Sinscrire() {

    const navigation = useNavigation();

    // ----------------------------------------------------------------
    /* Select the profile picture */
    // ----------------------------------------------------------------
    const [image, setImage] = useState(null);

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

    //console.log("photo: ", photo);
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

    const [selectedOperators, setSelectedOperators] = useState([]);

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

    const RegisterClient = (e) => {

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
                    uri: image, name: 'image.jpg', type: 'image/jpeg',
                });

                console.log(formData);

                axios.post("https://btrproject.burundientempsreel.com/echangeur", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then(response => {
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
                                title: "Compte créé avec succès!",
                                textBody: `${response.data}`,
                                titleStyle: { color: "green" }, textBodyStyle: { color: "green" },
                                onPress: () => { Toast.hide() },
                                onHide: () => { navigation.navigate("Login"); },
                                onShow: () => { setLoginBtnClicked(false) }
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Axios request error for sending: ", error);

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
                    });
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Photo de profil requis',
                    textBody: 'Vous devez specifier votre photo de profil s\'il vous plaît',
                    autoClose: 3000, titleStyle: { color: "red" },
                    textBodyStyle: { color: "red" },
                    onPress: () => Toast.hide()
                })
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl
                refreshing={refreshing} onRefresh={onRefresh}
            />}
        >
            <View style={styles.container}>
                <View style={styles.containerInformation}>
                    <Text style={styles.title}>
                        Bienvenue sur notre plateforme d'échange de monnaie électronique
                    </Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Nous sommes ravis que vous ayez choisi de vous inscrire. Pour commencer, veuillez remplir les informations demandées dans le formulaire ci-dessous. Nous aurons besoin des détails suivants :</Text>
                        <View style={styles.infoList}>
                            <Text style={styles.infoItem}>- Nom: Veuillez saisir votre nom de famille.</Text>
                            <Text style={styles.infoItem}>- Prénom: Veuillez saisir votre prénom de famille.</Text>
                            <Text style={styles.infoItem}>- Adresse e-mail valide: Assurez-vous de fournir une adresse e-mail correcte que nous pourrons utiliser pour vous contacter.</Text>
                            <Text style={styles.infoItem}>- Numéro de téléphone: Veuillez entrer votre numéro de téléphone actif.</Text>
                            <Text style={styles.infoItem}>- Choix de l'opérateur: Sélectionnez l'opérateur que vous utilisez pour votre monnaie électronique, que ce soit Lumicash, Ecocash ou autre.</Text>
                            <Text style={styles.infoItem}>- Code agent: Si vous disposez d'un code agent spécifique, veuillez le mentionner ici.</Text>
                            <Text style={styles.infoItem}>- Nom de la carte SIM: Veuillez indiquer le nom associé à votre carte SIM.</Text>
                            <Text style={styles.infoItem}>- Mot de passe: Choisissez un mot de passe sécurisé pour votre compte.</Text>
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
                    <Text style={styles.label}>Adresse Email</Text>
                    <TextInput
                        ref={elemetRefEmail}
                        style={styles.input}
                        value={emailValue}
                        onChangeText={(text) => setEmailValue(text)}
                        keyboardType="email-address"
                    />

                    {/*Select operateurs*/}
                    <View style={{ width: "100%" }}>
                        <Picker
                            selectedValue={selectedOperators}
                            onValueChange={(value) => setSelectedOperators(value)}
                            mode="dialog"
                            style={{
                                backgroundColor: "#ccc", marginVertical: 5,
                                fontSize: 1
                            }}
                            ref={elemetRefSelect}
                        >
                            <Picker.Item label="Selectionner un opérateur principal" value="" />
                            {operateursItems}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Code Agent</Text>
                    <TextInput
                        ref={elemetRefcodeAgent}
                        style={styles.input}
                        value={codeAgent}
                        onChangeText={(text) => SetcodeAgent(text)}
                        keyboardType='numeric'
                    />

                    {/*Select banques*/}
                    <View style={{ width: "100%" }}>
                        <Picker
                            selectedValue={selectedBanques}
                            onValueChange={(value) => handleBanqueSelection(value)}
                            mode="dialog"
                            style={{
                                backgroundColor: "#ccc", marginVertical: 5,
                                fontSize: 18
                            }}
                            ref={elemetRefSelect2}
                        >
                            <Picker.Item label="Selectionner des opérateurs suplémentaires" value="" />
                            {banquesItems}
                        </Picker>
                    </View>

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
                                size={26}
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
                                size={26}
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
                        }} /> :
                        <TouchableOpacity style={styles.btn} onPress={RegisterClient}>
                            <Text style={styles.btnText}>S'inscrire  <FontAwesome name='paper-plane-o' size={20} color="white" /></Text>
                        </TouchableOpacity>
                    }

                    <View style={styles.linkContainer}>
                        <Text style={{ fontSize: 16 }}>Vous avez déjà un compte? </Text>
                        <TouchableOpacity style={styles.linkBtn}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={{
                                color: 'blue', fontSize: 16,
                                textDecorationLine: "underline"
                            }}>
                                Connectez-vous ici</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.helpText}>
                    <Text style={{ fontSize: 15, paddingHorizontal: 10, paddingTop: 10 }}>
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
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        width: "100%",
        marginHorizontal: 20
    },
    heading: {
        fontSize: 24,
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
        fontSize: 22,
        textAlign: 'center',
    },

    // ----------------------------------------------------------------
    // ----------------------------------------------------------------
    title: {
        fontSize: 24,
        marginBottom: 5,
        color: "#0b54d4"
    },
    containerInformation: {
        alignItems: 'center',
        backgroundColor: "#f2f2f5",
        borderRadius: 5,
        elevation: 5,
        padding: 8,
    },
    infoContainer: {
        alignItems: 'center', justifyContent: 'center',
    },
    infoText: {
        color: 'gray',
    },
    infoList: {
        paddingLeft: 20,
        marginBottom: 10
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

    linkContainer: {
        flexDirection: "row", justifyContent: "flex-end",
        flexWrap: "wrap",
    },

});
