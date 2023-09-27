import React, { useEffect, useRef, useState } from 'react';
import {
    ToastAndroid, StyleSheet, TextInput, View, Text, ScrollView,
    TouchableOpacity, ActivityIndicator, Image, RefreshControl, Alert
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

import { useNavigation } from '@react-navigation/native';

const NewCommandeUserEchange = () => {

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);

    const [montant, setMontant] = useState('');
    const montantRef = useRef(null);

    const [compte, setCompte] = useState('');
    const compteRef = useRef(null);

    const [description, setDescription] = useState('');
    const descriptionRef = useRef(null);

    const [files, setFiles] = useState([]);

    const handleFileUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const newFiles = result.assets.map((asset) => ({ uri: asset.uri }));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const removeImage = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            setMontant('');
            setCompte('');
            setDescription('');
            setLoginBtnClicked(false);
        }, 3000);
    };

    //Regular expressions
    const nbRegex = '^[0-9]+$'; //^-[0-9]+$ for negative numbers, ^-?[0-9]+$ for all
    //const emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

    const handleNewCommande = async (e) => {

        if (montant.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                textBody: 'Le Montant est nécessaire',
                title: "Montant incomplet",
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                autoClose: 2000, onPress: () => { Toast.hide() },
            });
            montantRef.current.focus();
            e.preventDefault();
            return false;
        }
        if (!montant.match(nbRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                textBody: 'Les chiffres de 0 à 9 sont acceptés',
                title: "Montant invalide",
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                autoClose: 2000, onPress: () => { Toast.hide() },
            });
            ToastAndroid.showWithGravity(
                'Valeur invalide pour le montant\nLes chiffres de 0 à 9 sont acceptés',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            montantRef.current.focus();
            e.preventDefault();
            return false;
        }
        else if (compte.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                textBody: 'Le Compte est nécessaire',
                title: "Compte incomplet",
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                autoClose: 2000, onPress: () => { Toast.hide() },
            });
            compteRef.current.focus();
            e.preventDefault();
            return false;
        }
        else if (description.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                textBody: 'La description de la commande est nécessaire',
                title: "Description incomplète",
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                autoClose: 2000, onPress: () => { Toast.hide() },
            });
            descriptionRef.current.focus();
            e.preventDefault();
            return false;
        }
        else {
            try {
                const formData = new FormData();
                files.forEach((photo) => {
                    formData.append('File', {
                        uri: photo.uri, name: 'image.jpg', type: 'image/jpeg',
                    });
                });
                const exchangeId = await AsyncStorage.getItem('exchangeId');
                formData.append('echangeurId', exchangeId)
                formData.append('montants', montant)
                formData.append('Compte', compte)
                formData.append('Description', description)

                //console.log(formData);

                Alert.alert("Confirmation de commande",
                    "Voulez-vous effectuer cette commande?",
                    [{ text: "Annuler", onPress: () => { return; } },
                    {
                        text: "Confirmer", onPress: async () => {

                            setLoginBtnClicked(true);

                            await axios.post('https://btrproject.burundientempsreel.com/commande', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            }).then((res) => {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Commande effecutée avec succès",
                                    textBody: 'Nous allons procéder à répondre à votre commande\nVeuillez Patienter!.',
                                    autoClose: 3000, titleStyle: { color: "green" },
                                    textBodyStyle: { color: "green" },
                                    onPress: () => Toast.hide(),
                                    onShow: () => { setLoginBtnClicked(false); },
                                    onHide: () => {
                                        navigation.navigate("ShowCommande",
                                            { comEffectuee: true });
                                        setFiles([]); setDescription('');
                                        setCompte(''); setMontant('');
                                    }
                                });
                            }).catch((err) => {
                                console.log(err.message);
                                setLoginBtnClicked(false);
                                Toast.show({
                                    type: ALERT_TYPE.DANGER,
                                    title: "Erreur lors du commande",
                                    textBody: `${err.message}`,
                                    autoClose: 3000, titleStyle: { color: "red" },
                                    textBodyStyle: { color: "red" },
                                    onPress: () => Toast.hide(),
                                    onShow: () => { setLoginBtnClicked(false); },
                                });
                            });
                        }
                    }
                    ]
                )
            } catch (err) {
                console.log("Error from catch:", err);
            };

            return true;
        }
    }
    return (
        <ScrollView contentContainerStyle={styles.ScrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Nouveau demande</Text>
                <TextInput
                    value={montant}
                    onChangeText={setMontant}
                    placeholder="Entrez le montant"
                    style={styles.input}
                    ref={montantRef}
                    keyboardType='numeric'
                />
                <TextInput
                    value={compte}
                    onChangeText={setCompte}
                    placeholder="Entrez le compte"
                    style={styles.input}
                    ref={compteRef}
                />
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Entrez la description"
                    style={styles.input}
                    ref={descriptionRef}
                    multiline={true}
                />
                <View style={{
                    flexDirection: "row", alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{ paddingRight: 10, fontSize: 18 }}>Photos de preuve: </Text>
                    <TouchableOpacity onPress={handleFileUpload}>
                        <FontAwesome name='image' size={20} style={{
                            backgroundColor: "#82a9d1", padding: 8, borderRadius: 10
                        }} />
                    </TouchableOpacity>
                </View>

                {/* ---------------------------------------------
          ----------Render Selected Images------------------ */}
                <View style={styles.fileContainer}>
                    {files.map((item, index) => (
                        <View key={index} style={styles.imageIcon}>
                            <Image source={{ uri: item.uri }} style={styles.file} />
                            <Ionicons name='trash-outline' color='white'
                                size={18} style={styles.removeIcon}
                                onPress={() => removeImage(index)} />
                        </View>
                    ))}
                </View>
                {/* ---------------------------------------------
          ------------------------------------------------ */}

                {loginBtnClicked ?
                    <ActivityIndicator size="large" color="white" style={{
                        backgroundColor: "#055bfa",
                        borderRadius: 5, padding: 5
                    }} /> :
                    <TouchableOpacity onPress={handleNewCommande} style={[
                        styles.button, {
                            flexDirection: "row", padding: 10,
                            alignItems: "center", justifyContent: "center"
                        }
                    ]}>
                        <Text style={styles.texButton}>Commander</Text>
                        <FontAwesome name='paper-plane' size={20} color="white" />
                    </TouchableOpacity>
                }
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    ScrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        margin: 20,
        padding: 30,
        width: "100%"
    },
    title: {
        fontSize: 22, textAlign: "center",
        color: '#077ef5',
        marginBottom: 20
    },

    label: {
        fontSize: 16, color: "#818182", paddingHorizontal: 5,
    },
    input: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#5c5d5e',
        marginBottom: 10,
        padding: 5,
        fontSize: 16,
    },
    fileContainer: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap", padding: 5
    },
    imageIcon: {
        flexDirection: 'row',
        margin: 10,
        backgroundColor: "#94e3e2",
        alignItems: 'center',
        justifyContent: 'center',
    },
    file: {
        width: 120,
        height: 120,
        alignSelf: "center"
    },
    removeIcon: {
        position: "absolute", borderRadius: 20, margin: 2,
        top: 0, padding: 2,
        right: 0, backgroundColor: "red",
    },
    button: {
        backgroundColor: '#0d36bd',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20,
        width: '100%'
    },
    texButton: {
        textAlign: 'center',
        fontSize: 20,
        color: "white",
        paddingHorizontal: 20
    }
});

export default NewCommandeUserEchange;