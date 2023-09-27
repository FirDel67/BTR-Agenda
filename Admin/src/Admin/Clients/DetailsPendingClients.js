import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, Image, ScrollView,
    Alert, RefreshControl, StyleSheet, ActivityIndicator
} from 'react-native';

import BTRSpinner from '../../spinner';

import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import { FontAwesome } from '@expo/vector-icons';

function StandByVoirPlus() {
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    const [echangeur, setEchangeur] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const [refreshing, setRefreshing] = useState(false);
    const [valORsuppr, setValORSuppr] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setValORSuppr(false);
        }, 2000);

    }
    useEffect(() => {
        const getPendingEchangeurDetails = async () => {
            await axios
                .get(`https://btrproject.burundientempsreel.com/echangeur/detail/${id}`)
                .then((response) => {
                    console.log("Fetching Exchanger Details from axios");
                    setEchangeur(response.data);
                })
                .catch((error) => {
                    console.log(error.message);
                    console.log(error.response.data);
                });
        }
        getPendingEchangeurDetails();
    }, [id, refreshing]);

    const handleActivate = () => {
        Alert.alert("Confirmation d'activation",
            "Voulez-vous activer le compte de ce Client?", [
            { "text": "Annuler", onPress: () => { return; } },
            {
                "text": "Valider", onPress: async () => {
                    setValORSuppr(true);
                    await axios
                        .put(`https://btrproject.burundientempsreel.com/echangeur/changestatus/${id}`, {
                            status: 1,
                        })
                        .then((response) => {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: 'Validé avec succès',
                                textBody: 'Le compte de l\'échangeur a été activé/ validé avec succès!',
                                autoClose: 2000, titleStyle: { color: "green" },
                                textBodyStyle: { color: "green" },
                                onShow: () => { setValORSuppr(false); },
                                onPress: () => { Toast.hide() },
                                onHide: () => {
                                    setValORSuppr(false);
                                    navigation.navigate('ClientEnAttente',
                                        { validated: true });
                                }
                            })
                        })
                        .catch((error) => {
                            console.log(error.response);
                            setValORSuppr(false);
                        });
                }
            },
        ])
    };

    const handleAnnuler = () => {
        Alert.alert("Confirmation de suppression", "Voulez-vous supprimer le compte de ce client",
            [{ text: "Annuler", onPress: () => { return; }, style: "destructive" },
            {
                text: "Supprimer", onPress: async () => {
                    setValORSuppr(true);

                    await axios.delete(`https://btrproject.burundientempsreel.com/echangeur/delete/${id}`)
                        .then((response) => {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: 'Supprimé avec succès',
                                textBody: 'Le compte de l\'échangeur a été supprimé avec succès!',
                                autoClose: 2000,
                                titleStyle: { color: "green" },
                                textBodyStyle: { color: "green" },
                                onShow: () => { setValORSuppr(false); },
                                onPress: () => { Toast.hide() },
                                onHide: () => {
                                    setValORSuppr(false);
                                    navigation.navigate('ClientEnAttente', { deleted: true });
                                }
                            })
                        })
                        .catch((error) => {
                            console.log(error); setValORSuppr(false);
                        });
                }, style: "cancel"
            },])
    };

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1, alignItems: "center", justifyContent: "center",
            alignContent: "center", width: "100%"
        }} refreshControl={<RefreshControl refreshing={refreshing}
            onRefresh={onRefresh} colors={["blue", "green", "teal"]} />}
        >
            <View style={{
                flex: 1, alignItems: "center", justifyContent: "center",
                alignContent: "center", width: "100%"
            }}>

                {Object.keys(echangeur).length > 0 ?
                    <View style={{
                        margin: 5,
                        alignItems: 'center', backgroundColor: '#E5E5E5',
                        padding: 10, borderRadius: 8, width: "95%",
                        elevation: 50
                    }}>
                        <View style={{ width: 90, height: 90, backgroundColor: '#3B82F6', margin: 5, borderRadius: 45, overflow: 'hidden' }}>
                            {isLoading && (
                                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                            )}
                            <Image
                                source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${echangeur.profil}` }}
                                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}
                                onLoad={handleImageLoad}
                            />
                        </View>
                        <View style={{
                            width: "100%",
                            paddingVertical: 10, alignItems: "center"
                        }}>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Nom complet</Text>
                                <Text style={styles.text}>: {echangeur.nom} {echangeur.prenom}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Téléphone</Text>
                                <Text style={styles.text}>: {echangeur.tel}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Adresse Email</Text>
                                <Text style={styles.text}>: {echangeur.email}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Compte principal</Text>
                                <Text style={styles.text}>: {echangeur.banck}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Code agent</Text>
                                <Text style={styles.text}>: {echangeur.codeagent}</Text>
                            </View>
                            {echangeur.Compteechangeur.compte != "" ? (
                                <View style={styles.suppl}>
                                    <Text style={styles.label}>Compte(s) supplémentaire(s)</Text>
                                    <Text style={styles.text}>: {echangeur.Compteechangeur.compte}</Text>
                                </View>
                            ) :
                                <Text style={styles.nosuppl}>Pas de Compte(s) supplémentaire(s) pour ce Client</Text>
                            }
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                        }}>
                            {valORsuppr ?
                                <ActivityIndicator size="large"
                                    color="white" style={{
                                        backgroundColor: "#f0435d", padding: 5,
                                        alignItems: "center", justifyContent: "center",
                                        marginHorizontal: 5, borderRadius: 5,
                                    }}
                                /> :
                                <>
                                    <TouchableOpacity onPress={handleAnnuler} style={{
                                        backgroundColor: "#FF0000", borderRadius: 5, padding: 5,
                                        marginHorizontal: 5
                                    }} >
                                        <Text style={{ color: "white", fontSize: 20 }}>Supprimer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleActivate} style={{
                                        backgroundColor: "#3B82F6", borderRadius: 5, padding: 5,
                                        marginHorizontal: 5
                                    }}>
                                        <Text style={{ color: "white", fontSize: 20 }}>Valider</Text>
                                    </TouchableOpacity>
                                </>
                            }

                            <TouchableOpacity style={styles.goBack}
                                onPress={() => navigation.goBack()}>
                                <Text style={{ fontSize: 20, textAlign: "center", color: "white" }}>Retourner</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :

                    <BTRSpinner />
                }
            </View>
        </ScrollView>
    );
}

export default StandByVoirPlus;

const styles = StyleSheet.create({
    backButton: {
        alignSelf: "flex-end",
        marginRight: 10
    },
    goBack: {
        backgroundColor: "blue", borderRadius: 5, marginHorizontal: 5,
        padding: 5
    },
    spinner: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
    },

    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    label: {
        fontSize: 20
    },
    text: {
        fontSize: 18
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
});