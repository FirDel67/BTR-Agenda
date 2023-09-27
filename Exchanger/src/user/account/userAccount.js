import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, Alert, Image, ActivityIndicator,
    StyleSheet, ScrollView, TextInput, RefreshControl
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

import BTRSpinner from '../../spinner';

const ClientDetails = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const [users, setUsers] = useState([]);

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

    const [accountInfo, setAccountInfo] = useState({});
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

    //For image when not loaded
    const [isLoading, setIsLoading] = useState(true);
    const handleImageLoad = () => { setIsLoading(false); };

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("exchangerToken");
            const id = await AsyncStorage.getItem("exchangeId");
            //console.log(id);
            axios.get(`https://btrproject.burundientempsreel.com/echangeur/buyId/${id}`)
                .then((response) => {

                    console.log("Infos fetched successfully");
                    setAccountInfo(response.data);
                    setCompteSuppl(response.data.Compteechangeur);
                })
                .catch((error) => {
                    console.error(error);
                })
        }

        getItemsStored();
    }, [route.params?.modified, refreshing])

    const handleEditPassword = () => {
        setRequestEdit(true);
        console.log("Edit Password of user");
    };

    const modifyInfos = async () => {
        const id = await AsyncStorage.getItem("exchangeId");
        navigation.navigate("ModifyInfo", {
            id: id,
        });
    };

    const handleModifyPass = async () => {
        setIsAncPassVisible(false);
        setIsConfPassVisible(false);
        setIsPassVisible(false);
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

            const id = await AsyncStorage.getItem("exchangeId");
            Alert.alert("Confirmation de modification",
                "Voulez-vous vraiment modifié votre mot de passe?",
                [{ text: "Non", onPress: () => { return; } },
                {
                    text: "Modifier", onPress: async () => {
                        setChangePassBtn(true);
                        await axios.put(
                            `https://btrproject.burundientempsreel.com/echangeur/changepass`,
                            { password: passwordAnc, newPassword: password, id: id, }
                        ).then((response) => {

                            if (response.data.success) {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Modifié avec succès!",
                                    textBody: "Votre mot de passe a été modifié avec succès",
                                    titleStyle: { color: "green" },
                                    autoClose: 2000,
                                    textBodyStyle: { color: "green" },
                                    onShow: () => {
                                        setChangePassBtn(false);
                                        setPassword(""); setPasswordAnc("");
                                        setConfPassword(""); setChangePassBtn(false);
                                        setRequestEdit(false); setRefreshing(true);
                                        setTimeout(() => {
                                            setRefreshing(false);
                                        }, 2000)
                                    },
                                    onPress: () => { Toast.hide(); },
                                    onHide: () => {
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
                                    onShow: () => { setChangePassBtn(false); },
                                    onPress: () => { Toast.hide(); },
                                    onHide: () => { setChangePassBtn(false); }
                                });
                            }

                        }).catch((error) => {
                            console.error(error.message);
                            console.error(error.response.data);
                            Toast.show({
                                type: ALERT_TYPE.DANGER,
                                title: "Erreur lors de la modification du mot de passe",
                                textBody: `${error.response.data}`,
                                autoClose: 2000,
                                onPress: () => { Toast.hide(); },
                                onHide: () => {
                                    setChangePassBtn(false);
                                }
                            })
                        });
                    }
                }])
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollCont}
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} colors={["blue", "black"]} />}
        >
            <View style={styles.mainContent}>
                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.goBack}
                        onPress={() => navigation.goBack()}>
                        <Text style={{
                            fontSize: 20, textAlign: "center",
                            color: "white"
                        }}>Retourner</Text>
                    </TouchableOpacity>
                </View>

                {Object.keys(accountInfo).length > 0 ?
                    <View style={styles.container}>

                        <View style={styles.title}>
                            <Text style={{
                                color: "orange", fontSize: 20, textAlign: "center",
                            }}>Informations de votre compte</Text>
                        </View>

                        <View style={{
                            width: 200, height: 200, alignItems: "center", justifyContent: "center",
                            backgroundColor: '#3B82F6', margin: 5, borderRadius: 100, overflow: 'hidden'
                        }}>
                            <Image style={styles.image}
                                source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${accountInfo.profil}` }} />
                        </View>

                        <View style={styles.textCont}>
                            <Text style={styles.text} selectable>Nom complet: </Text>
                            <Text style={styles.dataText} selectable> {accountInfo.nom} {accountInfo.prenom}</Text>
                        </View>
                        <View style={styles.textCont}>
                            <Text style={styles.text} selectable>Numéro de téléphone: </Text>
                            <Text style={styles.dataText} selectable> {accountInfo.tel}</Text>
                        </View>
                        <View style={styles.textCont}>
                            <Text style={styles.text} selectable>Adresse E-mail: </Text>
                            <Text style={styles.dataText} selectable> {accountInfo.email}</Text>
                        </View>
                        <View style={styles.textCont}>
                            <Text style={styles.text} selectable>Compte principal: </Text>
                            <Text style={styles.dataText} selectable> {accountInfo.banck}</Text>
                        </View>
                        <View style={styles.textCont}>
                            <Text style={styles.text} selectable>Code Agent: </Text>
                            <Text style={styles.dataText} selectable> {accountInfo.codeagent}</Text>
                        </View>

                        <View style={styles.passView}>
                            <Text style={[styles.text,]}>
                                Mot de Passe: ********
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setRequestEdit(!requestEdit);
                            }}>
                                <FontAwesome name='edit' size={18} color="blue"
                                    style={styles.editpassText} />
                            </TouchableOpacity>
                        </View>

                        {compteSuppl == null || compteSuppl.compte == "" || compteSuppl.compte == undefined ?
                            <Text>Vous n'avez pas de comptes supplémentaires</Text>
                            :
                            <View style={{
                                backgroundColor: "#cfcfd1", padding: 5,
                                elevation: 5, borderRadius: 5,
                                justifyContent: "center", alignItems: "center",
                            }}>
                                <Text style={styles.text} selectable>Banques supplémentaire: {compteSuppl.compte}</Text>
                            </View>
                        }

                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.linkModify}
                                onPress={modifyInfos}>
                                <Text style={{ fontSize: 18, color: "white" }}>Modifier</Text>
                            </TouchableOpacity>
                        </View>

                        {requestEdit &&
                            <View style={styles.form}>
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
                                    <FontAwesome style={styles.icon} size={26}
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
                                    <FontAwesome style={styles.icon} size={26}
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
                                    <FontAwesome style={styles.icon} size={26}
                                        name={!isConfPassVisible ? 'eye' : 'eye-slash'}
                                        onPress={() => setIsConfPassVisible(!isConfPassVisible)} />
                                </View>
                                <View style={[styles.inputContainer, {
                                    flexDirection: "row", alignItems: "center",
                                    justifyContent: "space-between", marginVertical: 10
                                }]}>
                                    {changePassBtn ?
                                        <ActivityIndicator size="large" color="white"
                                            style={styles.btn} />
                                        :
                                        <>
                                            <TouchableOpacity onPress={() => setRequestEdit(false)} style={[styles.btn,
                                            { backgroundColor: "red" }]} >
                                                <Text style={{
                                                    fontSize: 20, textAlign: 'center',
                                                    color: "white"
                                                }}>Annuler</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleModifyPass} style={[styles.btn,
                                            { backgroundColor: "green" }]} >
                                                <Text style={{
                                                    fontSize: 20, textAlign: 'center',
                                                    color: "white"
                                                }}>Modifier</Text>
                                            </TouchableOpacity>
                                        </>
                                    }
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <BTRSpinner />
                }
            </View>
        </ScrollView>
    );
};

export default ClientDetails;

const styles = StyleSheet.create({
    scrollCont: {
        flexGrow: 1,
        justifyContent: 'center', alignItems: "center", marginVertical: 20
    },
    container: {
        justifyContent: 'center', alignItems: "center", width: "95%",
    },
    title: {
        padding: 10,
    },
    mainContent: {
        justifyContent: 'center', borderRadius: 10,
        marginTop: 10, alignItems: "center", backgroundColor: "#d7d9e0",
        elevation: 10, width: "95%", marginHorizontal: 10, marginBottom: 30
    },
    backButton: {
        alignSelf: "flex-end",
        marginHorizontal: 20
    },
    goBack: {
        backgroundColor: "blue",
        borderRadius: 5,
        padding: 5
    },

    image: {
        flex: 1, width: '100%',
        height: '100%', resizeMode: 'cover',
    },
    textCont: {
        flexDirection: "row", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", paddingHorizontal: 10,
    },
    text: {
        fontSize: 18, color: "#483357",
        fontFamily: "serif",
    },
    dataText: {
        fontSize: 16,
        fontFamily: "serif",
    },
    editpassText: {
        padding: 10, color: "blue",
        textDecorationLine: "underline"
    },
    passView: {
        flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
        margin: 5
    },
    btns: {
        alignSelf: "flex-end",
        padding: 10,
    },
    linkModify: {
        backgroundColor: "blue", borderRadius: 5,
        margin: 3, padding: 10,
    },

    //for editing the password
    form: {
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#dce3de',
        borderRadius: 5, margin: 5, marginBottom: 10,
        padding: 5,
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
        fontSize: 18,
        padding: 5
    },
    icon: {
        position: 'absolute',
        bottom: 0, padding: 5,
        right: 0,
    },
    btn: {
        width: "45%",
        backgroundColor: "#055bfa",
        borderRadius: 5,
        padding: 5
    },
});