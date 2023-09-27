import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, Alert, Image, ActivityIndicator,
    StyleSheet, ScrollView, RefreshControl
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import BTRSpinner from '../../spinner';

const ClientDetails = () => {

    const navigation = useNavigation();
    const route = useRoute();
    console.log(route.params?.id)
    const id = route.params?.id

    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const [refresh, setRefresh] = useState(false);
    const [echangeur, setEchangeur] = useState({});
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);

    const onRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 2000)
    }

    useEffect(() => {
        const fetchValues = async () => {
            await axios.get(`https://btrproject.burundientempsreel.com/echangeur/detail/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    console.log("Fetching values");
                    setEchangeur(response.data);
                })
                .catch((error) => {
                    console.error("Error: " + error)
                })
        }

        fetchValues()
    }, [refresh, route.params?.accountUpdated]);

    const handleDesactivate = () => {

        Alert.alert("Confirmation de désactivation",
            "Voulez-vous vraiment désactiver ce compte?",
            [{ text: "Non", onPress: () => { return; } },
            {
                text: "Désactiver", onPress: () => {

                    setLoginBtnClicked(true);
                    axios.put(`https://btrproject.burundientempsreel.com/echangeur/changestatus/${id}`, {
                        status: 0
                    })
                        .then((response) => {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS, title: "Désactivé avec succès",
                                textBody: "Le compte de l'échangeur a été désactivé avec succès!",
                                titleStyle: { color: "green" }, textBodyStyle: { color: "green" },
                                onShow: () => { setLoginBtnClicked(false); },
                                onPress: () => { Toast.hide() },
                                onHide: () => {
                                    setLoginBtnClicked(false);
                                    navigation.navigate("AllClients");
                                }
                            });
                        })
                        .catch((error) => {

                            Toast.show({
                                type: ALERT_TYPE.DANGER, title: "Erreur lors de la désactivation",
                                textBody: "Une erreur s'est produite lors de la désactivation de l'échangeur.",
                                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                                onShow: () => { setLoginBtnClicked(false); },
                                onPress: () => { Toast.hide() },
                                onHide: () => { setLoginBtnClicked(false); }
                            });
                            console.log(error.response);
                        });
                }
            }]
        )
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollCont}
            refreshControl={<RefreshControl refreshing={refresh}
                onRefresh={onRefresh} colors={["blue", "green"]} />}
        >
            <View style={styles.container}>
                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.goBack}
                        onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 20, textAlign: "center", color: "white" }}>Retourner</Text>
                    </TouchableOpacity>
                </View>
                {Object.keys(echangeur).length > 0 ?
                    <View style={styles.mainContent}>

                        <View style={styles.infoContainer}>
                            <View style={styles.title}>
                                <Text style={{ color: "#7d4802", fontSize: 24 }}>Informations du Client</Text>
                            </View>

                            <View style={{ flexDirection: 'column', alignItems: 'center', margin: 2, backgroundColor: '#E5E5E5', padding: 10, borderRadius: 8, }}>
                                <View style={{ width: 200, height: 200, backgroundColor: '#3B82F6', margin: 5, borderRadius: 100, overflow: 'hidden' }}>
                                    {isLoading && (
                                        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                                    )}
                                    <Image
                                        source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${echangeur.profil}` }}
                                        style={styles.image}
                                        onLoad={handleImageLoad}
                                    />
                                </View>
                                <View style={{ width: "100%", paddingVertical: 5 }}>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Nom complet : </Text>
                                        <Text style={styles.text}>{echangeur.nom} {echangeur.prenom}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Téléphone : </Text>
                                        <Text style={styles.text}>{echangeur.tel}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Adresse Email : </Text>
                                        <Text style={styles.text}>{echangeur.email}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Compte principal : </Text>
                                        <Text style={styles.text}>{echangeur.banck}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.label}>Code agent : </Text>
                                        <Text style={styles.text}>{echangeur.codeagent}</Text>
                                    </View>
                                    {echangeur.Compteechangeur.compte != "" || echangeur.Compteechangeur != null || echangeur.Compteechangeur.compte != undefined ? (
                                        <View style={styles.suppl}>
                                            <Text style={styles.label}>Compte(s) supplémentaire(s)</Text>
                                            <Text style={styles.text}>{echangeur.Compteechangeur.compte}</Text>
                                        </View>
                                    ) :
                                        <Text style={styles.nosuppl}>Pas de Compte(s) supplémentaire(s) pour ce Client</Text>
                                    }

                                    {loginBtnClicked ? <ActivityIndicator size="large"
                                        color="white" style={{
                                            backgroundColor: "#f0435d", padding: 10,
                                            alignItems: "center", justifyContent: "center",
                                            marginTop: 10, alignSelf: "flex-end", borderRadius: 5
                                        }}
                                    /> :
                                        <TouchableOpacity style={{
                                            backgroundColor: "#f0435d", padding: 10,
                                            alignItems: "center", justifyContent: "center",
                                            marginTop: 10, alignSelf: "flex-end",
                                            borderRadius: 5
                                        }} onPress={handleDesactivate}>
                                            <Text style={{
                                                color: "white", fontSize: 20
                                            }}>Désactiver</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
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
    container: {
        flexGrow: 1,
        marginTop: 5,
    },
    title: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#999",
        borderRadius: 10,
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
        backgroundColor: "blue", borderRadius: 5, marginHorizontal: 5,
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
    linkModify: {
        backgroundColor: "#048a35",
        borderRadius: 5,
        margin: 3,
        padding: 10,
    },

    textCont: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: {
        justifyContent: 'flex-start',
        fontSize: 20,
    },
    text: {
        fontSize: 18,
        alignSelf: "flex-start",
        textAlign: "center",
    },
    suppl: {
        backgroundColor: "#81acf0",
        padding: 5, width: "100%", borderRadius: 5,
        marginTop: 5, alignItems: "center", justifyContent: "center",
    },
    nosuppl: {
        backgroundColor: "#81acf0",
        padding: 5, width: "100%", borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
    },

    actionBtns: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    btnAnn: {
        justifyContent: "space-between"
    }
});