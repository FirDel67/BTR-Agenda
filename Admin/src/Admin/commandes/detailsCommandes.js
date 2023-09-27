import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator,
    ScrollView, Image, StyleSheet, Alert, RefreshControl
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import BTRSpinner from '../../spinner';

export default function CommandeDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const [refreshing, setRefreshing] = useState(false);

    const { id } = route.params;

    const [detailsComData, setDetailsComData] = useState([]);
    const [detailsComFiles, setDetailsComFiles] = useState([]);
    const [areData, setAreData] = useState(false);

    const [annulerCom, setAnnulerCom] = useState(false);
    const [btnVClicked, setbtnVClicked] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setBtnVClicked(false);
        }, 2000);
    };

    useEffect(() => {

        const detailsCommandes = async () => {
            await axios.get(`https://btrproject.burundientempsreel.com/commande/details/${id}`)
                .then(response => {

                    const additionalFiles = response.data.CommandesFiles.map((files) => {
                        return {
                            id: files.id,
                            fichier: files.Files,
                            dateCreated: files.createdAt,
                        }
                    })
                    setDetailsComFiles(additionalFiles);
                    setDetailsComData(response.data);
                    setAreData(true);
                }
                )
                .catch(error => console.error(error));
        }

        console.log("Details Commandes fetched successfully");
        detailsCommandes();
    }, [route.params?.id, refreshing]);

    const [titre, setTitre] = useState('');
    const [textarea, setTextarea] = useState('');
    const [autoScrollHeight, setAutoScrollHeight] = useState(50);
    const [valueTextarea, setValueTextarea] = useState(0);
    const [addMotif, setaddMotif] = useState(false);

    //console.log("Comm id: ", id);
    const handleSubmit = (e) => {

        if (titre.trim() === "") {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Titre non complet",
                textBody: "Le titre du motif d'annulation de la démande est requise",
                autoClose: 2000,
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                onHide: () => { }
            });
            return;
        }
        else if (textarea.trim() === "") {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Description non complète",
                textBody: "La description du motif d'annulation de la démande est requise",
                autoClose: 2000,
                titleStyle: { color: "red" }, textBodyStyle: { color: "red" },
                onHide: () => { }
            });
            return;
        }
        else {
            try {
                Alert.alert("Confirmation d'annulation",
                    "Voulez-vous vraiment annuler cette commande et envoyer le raison?",
                    [{ text: 'No', onPress: () => { return; } },
                    {
                        text: 'Oui', onPress: () => {
                            setAnnulerCom(true);

                            axios.post(`https://btrproject.burundientempsreel.com/Commande/annuler/${id}`,
                                { motif: textarea, titre: titre })
                                .then((response) => {
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,
                                        title: "Annulée avec succès",
                                        autoClose: 3000,
                                        titleStyle: { color: "green" },
                                        textBody: "La commande a été annulée avec succès",
                                        textBodyStyle: { color: "green" },
                                        onPress: () => { Toast.hide() },
                                        onShow: () => { setAnnulerCom(false); },
                                        onHide: () => {
                                            setAnnulerCom(false); setTitre('');
                                            setTextarea('');
                                            navigation.goBack();
                                        }
                                    })
                                })
                                .catch((error) => {
                                    console.error("Axios Error: ", error);
                                    setAnnulerCom(false);
                                });
                        }
                    }])
            } catch (error) {
                console.error("Try error: ", error);
                setbtnVClicked(false);
            }
        }
    };

    const handleValiderCommande = () => {
        try {
            Alert.alert("Confirmation de validation",
                "Voulez-vous vraiment valider cette commande?",
                [{ text: "No", onPress: () => { return; } },
                {
                    text: "Valider", onPress: () => {

                        setbtnVClicked(true);

                        axios.put(`https://btrproject.burundientempsreel.com/commande/valider/${id}`,
                            { status: "success" })
                            .then((response) => {
                                console.log("Validated successfully: ", response.data);
                                Toast.show({
                                    title: "Validée avec succès",
                                    textBody: "La demande du client a été validée avec succès",
                                    titleStyle: { color: "green" },
                                    textBodyStyle: { color: "green" },
                                    onHide: () => {
                                        setbtnVClicked(false);
                                        setTitre(''); setTextarea('');
                                        navigation.navigate("HistoriqueCommandes",
                                            { validated: true });
                                    }, onPress: () => { Toast.hide() },
                                    onShow: () => { setbtnVClicked(true) }
                                })
                            })
                            .catch((error) => {
                                console.error("Axios Error: ", error);
                                setbtnVClicked(false);
                            });
                    }
                }
                ]
            );
        } catch (error) {
            console.error("Try error: ", error);
            setbtnVClicked(false);
        }
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['blue', 'green']}
            />
        }>
            <View style={styles.backIcon}>
                <TouchableOpacity style={{
                    backgroundColor: "#d6d6d6", padding: 5, borderRadius: 5,
                    elevation: 5
                }} onPress={() => navigation.goBack()}>
                    <FontAwesome name='arrow-circle-o-left' color='#6ea4ba' size={40} />
                </TouchableOpacity>
            </View>

            {Object.keys(detailsComData).length > 0 ?
                <View style={styles.container}>
                    <Text style={styles.sectionHeader}>
                        <Text style={{ color: '#fcb308' }}>Détails de la commande {id}</Text>
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
                                <FontAwesome name="clock-o" color="#2898fa" size={22} />
                            </View>
                            <Text style={[styles.textGray, { color: "#2898fa", fontSize: 20 }]}>
                                <Text style={{ color: "black" }}>Status:</Text> {detailsComData.status}
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[styles.sectionHeader, { textDecorationLine: 'underline' }]}>
                            La description de la demande
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
                                    <View key={file.id} style={{ backgroundColor: '#3B82F6', borderRadius: 5, 
                                    overflow: 'hidden',margin:3,alignItems:"center", justifyContent:"center" }}>
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

                    {addMotif && (
                        <View style={styles.formContainer}>
                            <TextInput
                                value={titre}
                                onChangeText={setTitre}
                                placeholder="Titre"
                                style={styles.input}
                            />
                            <TextInput
                                value={textarea}
                                onChangeText={(text) => {
                                    setTextarea(text);
                                    setAutoScrollHeight(
                                        Math.max(100, Math.min(300, text.trim().split('\n').length * 20 + 10))
                                    );
                                    setValueTextarea(text.trim().length);
                                }}
                                placeholder="Motif"
                                style={[styles.input, { height: autoScrollHeight }]}
                                multiline={true}
                            />
                            {annulerCom ? <ActivityIndicator size="large"
                                color="white" style={[{
                                    margin: 5
                                }, styles.submitButton]} /> :
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={!valueTextarea}
                                    style={[styles.button, styles.submitButton]}
                                >
                                    <Text style={styles.buttonText}>Envoyer <FontAwesome
                                        name='send-o' size={22} color="white" /> </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    )}

                    {btnVClicked ? <ActivityIndicator color="white" size="large"
                        style={{
                            width: "100%", alignSelf: "center", alignContent: "center",
                            backgroundColor: "#007AFF"
                        }} /> :
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between",
                            alignItems: "center", alignSelf: "center",
                        }}>

                            <TouchableOpacity
                                onPress={() => setaddMotif(!addMotif)}
                                style={[styles.button, styles.cancelButton]}
                            >
                                <Text style={styles.addMotifText}>Annuler</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={handleValiderCommande}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Valider</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, { backgroundColor: "#1c7825" }]}
                                onPress={() => navigation.goBack()}>
                                <Text style={styles.buttonText}>Retourner</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View> :
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
        padding: 5, paddingHorizontal: 20
    },
    sectionHeader: {
        fontSize: 25,

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
        bottom: "1%"
    },
    captureImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 5,
    },

    formContainer: {
        marginVertical: 16,
        width: "100%",
        backgroundColor: '#e3e3e3',
        borderRadius: 5,
        elevation: 5,
        padding: 10
    },
    input: {
        borderBottomWidth: 3,
        borderBottomColor: '#8f8f8f',
        fontSize: 18,
        padding: 5
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 5,
        alignItems: 'center', margin: 5,
    },
    addMotifbutton: {
        backgroundColor: '#007AFF',
        margin: 10,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        alignSelf: "flex-end"
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    submitButton: {
        backgroundColor: '#2871fa', padding: 5, alignItems: 'center',
        alignSelf: "flex-end", justifyContent: "center",
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
    },
    addMotifText: {
        color: '#fff',

        fontSize: 22,
    },
});
