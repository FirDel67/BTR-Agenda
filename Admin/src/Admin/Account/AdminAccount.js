import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, Alert, Image, RefreshControl, AppState,
    StyleSheet, ScrollView, TextInput, ActivityIndicator, Platform
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import BTRSpinner from '../../spinner';


const AdminAccount = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const [requestEdit, setRequestEdit] = useState(false);
    const [password, setPassword] = useState('');
    const passwordRef = useRef(null);
    const [isPassVisible, setIsPassVisible] = useState(false);

    const [passwordAnc, setPasswordAnc] = useState('');
    const passwordAncRef = useRef(null);
    const [isAncPassVisible, setIsAncPassVisible] = useState(false);

    const [confPassword, setConfPassword] = useState('');
    const confPasswordRef = useRef(null);
    const [isConfPassVisible, setIsConfPassVisible] = useState(false);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/i;


    const [refresh, setRefresh] = useState(false);
    const [SuperAgent, setSuperAgent] = useState({});
    const [createdDate, setCreatedDate] = useState();
    const [updatedDate, setUpdatedDate] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [pwdModifying, setPwdModifying] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    }

    const onRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 2000)
    }

    useEffect(() => {
        const fetchValues = async () => {

            const id = await AsyncStorage.getItem("spId");
            await axios.get(`https://btrproject.burundientempsreel.com/surperagent/buyId/${id}`)
                .then(response => {

                    //console.log("Fetched from axios : ", response.data);

                    setSuperAgent(response.data);
                    const createdAt = new Date(response.data.updatedAt);
                    const updatedAt = new Date(response.data.updatedAt);
                    const createdAtString = createdAt.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
                    const updatedAtString = updatedAt.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

                    setCreatedDate(createdAtString.split(' heure d’été d’Europe centrale')[0]);
                    setUpdatedDate(updatedAtString.split(' heure d’été d’Europe centrale')[0]);
                }).catch(err => {
                    console.log("Axios Error from account: ", err);
                })
        }

        console.log("Account infos fetched successfully");
        fetchValues();
    }, [refresh, route.params?.updated]);


    const handleEditPassword = () => {
        setRequestEdit(true);
        console.log("Edit Password of user");
    };

    const modifyInfos = () => {
        //console.log("Modify Info of user id:", SuperAgent.id);
        navigation.navigate("ModifyAdminInfo", { spId: SuperAgent.id, });
    };

    const handleModifyPass = async () => {
        if (passwordAnc.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Ancien mot de passe',
                textBody: "Veuillez indiquer l'ancien mot de passe",
                textBodyStyle: { color: "#f2052c" }, titleStyle: { color: "#f2052c" }
            })
            passwordAncRef.current.focus();
        }
        else if (!passwordAnc.trim().match(passwordRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'L\'ancien Mot de passe n\'est pas sécurisé',
                textBody: 'Veuillez combinez un majuscule, un minuscule,un caractère et un chiffre\nExemple:@Admin4',
                autoClose: 4000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            passwordRef.current.focus();
        }
        else if (password.trim() === '') {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Nouveau mot de passe',
                textBody: "Veullez entrer le nouveau mot de passe que vous voulez utiliser",
                textBodyStyle: { color: "#f2052c" }, titleStyle: { color: "#f2052c" }
            })
            passwordRef.current.focus();
        }
        else if (!password.trim().match(passwordRegex)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Votre Mot de passe n\'est pas sécurisé',
                textBody: 'Veuillez combinez un majuscule, un minuscule,un caractère et un chiffre\nExemple:@Admin4',
                autoClose: 4000, titleStyle: { color: "red" },
                textBodyStyle: { color: "red" },
                onPress: () => Toast.hide()
            })
            passwordRef.current.focus();
        }
        else if (password.length < 4) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Nouveau mot de passe faible',
                textBody: "Il doit avoir au moins 4 caractères",
                textBodyStyle: { color: "#f2052c" }, titleStyle: { color: "#f2052c" }
            })
            passwordRef.current.focus();
        }
        else if (password.trim() !== confPassword.trim()) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Mots de passe différents',
                textBody: "Veuillez vérifier les mots de passe (nouveaux) s`\'ils correspondent ou pas",
                textBodyStyle: { color: "#f2052c" }, titleStyle: { color: "#f2052c" }
            })
            confPasswordRef.current.focus();
        }
        else {
            try {
                const id = await AsyncStorage.getItem("spId");

                Alert.alert("Confirmation de modification",
                    "Voulez-vous vraiment modifié votre mot de passe?",
                    [{ text: "Non", onPress: () => { return; } },
                    {
                        text: "Modifier", onPress: async () => {
                            setPwdModifying(true);

                            const response = await axios.put(
                                `https://btrproject.burundientempsreel.com/surperagent/changepass`,
                                {
                                    password: passwordAnc,
                                    newPassword: password, id: id,
                                }
                            );

                            if (response.data.success) {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Modifié avec succès!",
                                    textBody: "Votre mot de passe a été modifié avec succès",
                                    titleStyle: { color: "green" },
                                    textBodyStyle: { color: "green" },
                                    onShow: () => { setPwdModifying(false); },
                                    onPress: () => { Toast.hide(); },
                                    onHide: () => {
                                        setPassword(""); setPasswordAnc("");
                                        setConfPassword("");
                                        setRequestEdit(false);
                                        setRefresh(true);
                                        setTimeout(() => {
                                            setRefresh(false);
                                        }, 2000)
                                    }
                                });
                                console.log("response.data.success: ", response.data.success);
                            } else {
                                console.error(response.data.message);
                                Toast.show({
                                    type: ALERT_TYPE.DANGER,
                                    title: "Erreur",
                                    textBody: `${response.data.message}`,
                                    titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                                    onShow: () => { setPwdModifying(false); },
                                    onPress: () => { Toast.hide(); },
                                    onHide: () => { setPwdModifying(false); }
                                });
                            }
                        }
                    }]
                )

            } catch (error) {
                console.error(error.message);
                console.error(error.response.data);
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollCont}
            refreshControl={<RefreshControl refreshing={refresh}
                onRefresh={onRefresh} />}
        >
            <View style={styles.container}>
                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.goBack}
                        onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 25, textAlign: "center", color: "white" }}>Retourner</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainContent}>

                    {Object.keys(SuperAgent).length === 0 ?
                        <BTRSpinner />
                        :
                        <View style={styles.infoContainer}>
                            <View style={styles.title}>
                                <Text style={{ color: "#0567fa", fontSize: 24 }}>Informations de votre compte</Text>
                            </View>

                            <View style={{ flexDirection: 'column', alignItems: 'center', margin: 2, backgroundColor: '#E5E5E5', padding: 10, borderRadius: 8, }}>
                                <View style={{ width: 200, height: 200, backgroundColor: '#3B82F6', margin: 5, borderRadius: 100, overflow: 'hidden' }}>
                                    {isLoading && (
                                        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                                    )}
                                    <Image
                                        source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosuperagent/${SuperAgent.photo}` }}
                                        style={styles.image}
                                        onLoad={handleImageLoad}
                                    />
                                </View>
                                <View style={{ width: "100%", paddingVertical: 5 }}>

                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Nom complet : </Text>
                                        <Text style={styles.text}>{SuperAgent.nom} {SuperAgent.prenom}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Téléphone : </Text>
                                        <Text style={styles.text}>{SuperAgent.tel}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Adresse Email : </Text>
                                        <Text style={styles.text}>{SuperAgent.email}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>CNI: </Text>
                                        <Text style={styles.text}>{SuperAgent.CNI}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Code SuperAgent: </Text>
                                        <Text style={styles.text}>{SuperAgent.codeSuperAgent}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>NIF : </Text>
                                        <Text style={styles.text}>{SuperAgent.NIF}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Nom de la Société: </Text>
                                        <Text style={styles.text}>{SuperAgent.nomSociete}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Adresse: </Text>
                                        <Text style={styles.text}>{SuperAgent.address}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Mot de passe: </Text>
                                        <View style={styles.passEdit}>
                                            <Text style={[styles.text,
                                            { paddingRight: 10 }]}>***********</Text>
                                            <FontAwesome name='edit' size={28}
                                                color="blue" style={{
                                                    textDecorationLine: "underline"
                                                }}
                                                onPress={handleEditPassword} />
                                        </View>
                                    </View>

                                    <View style={styles.links}>
                                        <TouchableOpacity onPress={modifyInfos}>
                                            <Text style={styles.linkModify}>
                                                Modifier </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    {requestEdit && <View style={styles.form}>
                        <Text style={styles.formTitle}>Modifier le mot de passe</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ancien Mot de passe"
                                secureTextEntry={!isAncPassVisible}
                                value={passwordAnc}
                                onChangeText={setPasswordAnc}
                                ref={passwordAncRef}
                            />
                            <FontAwesome style={styles.icon} size={30}
                                name={!isAncPassVisible ? 'eye' : 'eye-slash'}
                                onPress={() => setIsAncPassVisible(!isAncPassVisible)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nouveau mot de passe"
                                secureTextEntry={!isPassVisible}
                                value={password}
                                onChangeText={setPassword}
                                ref={passwordRef}
                            />
                            <FontAwesome style={styles.icon} size={30}
                                name={!isPassVisible ? 'eye' : 'eye-slash'}
                                onPress={() => setIsPassVisible(!isPassVisible)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmer le nouveau mot de passe"
                                secureTextEntry={!isConfPassVisible}
                                value={confPassword}
                                onChangeText={setConfPassword}
                                ref={confPasswordRef}
                            />
                            <FontAwesome style={styles.icon} size={30}
                                name={!isConfPassVisible ? 'eye' : 'eye-slash'}
                                onPress={() => setIsConfPassVisible(!isConfPassVisible)} />
                        </View>
                        <View style={[styles.inputContainer, { flexDirection: "row", justifyContent: "space-between" }]}>

                            <TouchableOpacity onPress={() => setRequestEdit(false)} style={[styles.btn,
                            { backgroundColor: "#f01136" }]} >
                                <Text style={{
                                    fontSize: 20, color: "white", textAlign: 'center',
                                }}>Annuler</Text>
                            </TouchableOpacity>
                            {pwdModifying ?
                                <ActivityIndicator size="large" color="white"
                                    style={styles.btn} />
                                :
                                <TouchableOpacity onPress={() => handleModifyPass(SuperAgent)} style={styles.btn} >
                                    <Text style={{
                                        fontSize: 20, color: "white", textAlign: 'center',
                                    }}>Modifier</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default AdminAccount;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 15,
    },
    title: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        padding: 10,
        margin: 5,
    },
    mainContent: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginVertical: 5
    },
    backButton: {
        alignSelf: "flex-end",
        margin: 5,
        marginRight: 10
    },
    goBack: {
        backgroundColor: "#0567fa",
        borderRadius: 5,
        padding: 5
    },
    infoContainer: {
        alignSelf: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#e8fafa",
        borderRadius: 5,
        elevation: 5,
        width: "95%"
    },

    spinner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    editpassText: {
        fontSize: 20,
        padding: 10,
        fontFamily: "serif",
        color: "blue",
        textDecorationLine: "underline"
    },
    passView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#aef2d3",
        padding: 5
    },
    btns: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 20,
    },
    shareBtn: {
        backgroundColor: "#93aab8",
        borderRadius: 5,
        margin: 3,
        padding: 5,
    },
    linkBtn: {
        backgroundColor: "#d1ede7",
        borderRadius: 5,
        borderBottomColor: "orange",
        borderBottomWidth: 3,
        margin: 3,
        padding: 10,
    },
    links: {
        backgroundColor: "#0567fa",
        borderRadius: 5,
        marginTop: 20,
        padding: 5,
        alignSelf: 'flex-end',
    },
    linkModify: {
        color: "white",
        textAlign: "center", fontSize: 20
    },

    textCont: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    label: {
        fontSize: 20,
    },
    text: {
        fontSize: 18, color: "#747475",
    },
    passEdit: {
        flexDirection: "row",
        paddingTop: 5,
        justifyContent: "space-between"
    },
    suppl: {
        backgroundColor: "#81acf0",
        padding: 5, width: "100%", borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    nosuppl: {
        backgroundColor: "#81acf0",
        padding: 5, width: "100%", borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
    },

    //for editing the password
    form: {
        width: '90%',
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#dce3de',
        borderRadius: 5,
        elevation: 5,
        padding: 10,
        marginTop: 20,
    },
    inputContainer: {
        width: "90%"
    },
    formTitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: "#606061", alignSelf: 'flex-start'
    },
    input: {
        borderBottomWidth: 3,
        borderBottomColor: '#727273',
        marginVertical: 10,
        fontSize: 18,
        padding: 5
    },
    icon: {
        position: 'absolute',
        bottom: 15,
        right: 10,
    },
    btn: {
        width: "45%",
        backgroundColor: "#055bfa",
        borderRadius: 5,
        padding: 5
    },
});