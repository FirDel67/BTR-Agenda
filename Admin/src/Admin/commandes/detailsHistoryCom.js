import {
    View, Text, Image, StyleSheet, TouchableOpacity,
    ScrollView, ActivityIndicator, RefreshControl, Alert
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import axios from 'axios';
import BTRSpinner from '../../spinner';

export default function HistoryDetails() {

    const navigation = useNavigation();
    const route = useRoute();
    const [refreshing, setRefreshing] = useState(false);

    const { id } = route.params;

    const [detailsComData, setDetailsComData] = useState([]);
    const [detailsComFiles, setDetailsComFiles] = useState([]);
    const [historyReason, setHistoryReason] = useState([]);
    const [clientExchange, setClientExchange] = useState([]);
    const [areData, setAreData] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setAreData(true);
        setTimeout(() => {
            setRefreshing(false);
            setAreData(false);
        }, 2000);
    };

    const [isLoading, setIsLoading] = useState(true);
    const handleImageLoad = () => {
        setIsLoading(false);
    };


    useEffect(() => {
        const getDetailsHistoryCom = async () => {
            await axios.get(`https://btrproject.burundientempsreel.com/commande/history/${id}`)
                .then(response => {

                    const additionalFiles = response.data.CommandesFiles.map((files) => {
                        //console.log("data.CommandesFiles: ", files)
                        return {
                            id: files.id,
                            fichier: files.Files,
                            dateCreated: files.createdAt,
                        }
                    })

                    const reasonComands = response.data.Comandeannuler;
                    const clientComand = response.data.echangeur;

                    setDetailsComFiles(additionalFiles);
                    setHistoryReason(reasonComands);
                    setClientExchange(clientComand);
                    setDetailsComData(response.data);
                }
                )
                .catch(error => console.error(error));
        }
        getDetailsHistoryCom();
    }, [areData, refreshing]);

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['blue', 'green']}
            />
        }>
            <View style={styles.backIcon}>
                <FontAwesome name='arrow-circle-o-left' color='#6ea4ba' size={40}
                    onPress={() => navigation.goBack()} />
            </View>

            {Object.keys(detailsComData).length > 0 ?
                <View style={styles.container}>
                    <View style={{ padding: 10 }}>
                        <Text style={styles.sectionHeader}>
                            <Text style={{ color: '#fcb308' }}>Historique de la commande {id}</Text>
                        </Text>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.textGray}>
                                <Text>Montant</Text>: {detailsComData.montants}
                            </Text>
                            <Text style={styles.textGray}>
                                <Text>Compte</Text>: {detailsComData.Compte}
                            </Text>
                            <Text style={styles.textGray}>
                                <Text>Date</Text>: {new Date(detailsComData.createdAt).toLocaleString().replace(" heure normale d’Afrique centrale", "")}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.successIcon}>
                                    <FontAwesome name={detailsComData.status == "success" ? "chevron-circle-down" : "times-circle"}
                                        color={detailsComData.status == "success" ? "#02a131" : "red"} size={25} />
                                </View>
                                <Text style={[styles.textGray, { color: detailsComData.status == "Anullée" ? '#b50223' : "#03961e", fontSize: 20 }]}>
                                    <Text style={{ color: "black" }}>Status:</Text> {detailsComData.status}
                                </Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.sectionHeader, { textDecorationLine: 'underline' }]}>
                                Le client qui a commandé
                            </Text>
                            <Text style={styles.textGray}>
                                Nom du client: {clientExchange.nom}
                            </Text>
                            <Text style={styles.textGray}>
                                Prénom du client: {clientExchange.prenom}
                            </Text>
                            <Text style={styles.textGray}>
                                Numéro de Téléphone du client: {clientExchange.tel}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.sectionHeader, { textDecorationLine: 'underline' }]}>
                                La demande du client
                            </Text>
                            <Text style={styles.textGray}>
                                {detailsComData.Description}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            {detailsComFiles.length > 0 ?
                                <Text style={[styles.sectionHeader, { textDecorationLine: 'underline' }]}>
                                    Images de preuve
                                </Text> :
                                <Text style={[styles.sectionHeader, {
                                    color: "white", backgroundColor: "red",
                                    padding: 5, borderRadius: 5
                                }]}>Pas d'image de preuve <FontAwesome size={24}
                                    name='exclamation-circle' color="white" /> </Text>
                            }

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {detailsComFiles.map((file, index) => {
                                    const filesAttached = file.fichier;
                                    // Construire l'URL de l'image pour cette ligne
                                    const url = `http://btrproject.burundientempsreel.com/uploads/photoscommande/${filesAttached}`;
                                    //console.log(url);
                                    return (
                                        <View key={file.id} style={{
                                            backgroundColor: '#3B82F6', margin: 2,
                                            borderRadius: 5, overflow: 'hidden'
                                        }}>
                                            {isLoading && (
                                                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                                            )}
                                            <Image
                                                source={{ uri: url }} onLoad={handleImageLoad}
                                                style={styles.captureImage} key={file.id}
                                            />
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <View>
                            {historyReason != null &&
                                <View style={{}}>
                                    <Text style={[styles.sectionHeader, { textDecorationLine: 'underline' }]}>Motif donné</Text>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={styles.textGray}>
                                            <Text>Titre du motif</Text>: {historyReason.titre}
                                        </Text>
                                        <Text style={styles.textGray}>
                                            <Text>Motif</Text>: {historyReason.motif}
                                        </Text>
                                        <Text style={styles.textGray}>
                                            <Text>Date d'ajout du motif</Text>: {new Date(historyReason.createdAt).toLocaleString().replace(" heure normale d’Afrique centrale", "")}
                                        </Text>
                                    </View>

                                </View>
                            }
                            <View style={{ alignItems: 'flex-end', alignSelf: "flex-end" }}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HistoriqueCommandes')}>
                                    <Text style={styles.backButtonText}>Retourner</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                :
                <BTRSpinner />
            }
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f4f2', alignItems: 'flex-start',
        alignSelf: 'center', padding: 10, margin: 10,
        width: '98%', borderRadius: 5, elevation: 5,
    },
    backIcon: {
        alignItems: "flex-start",
        padding: 10
    },
    sectionHeader: {
        fontSize: 23,
        marginBottom: 10,
    },
    textGray: {
        color: '#444',
        marginBottom: 5,
        fontSize: 18
    },
    successIcon: {
        borderRadius: 2,
        padding: 1,
        marginRight: 5,
    },

    spinner: {
        position: 'absolute', top: 0,
        left: 0, right: 0, bottom: 0,
    },
    captureImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    backButton: {
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    backButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 25
    },
});