import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet,
    TouchableOpacity, Modal, Alert, ActivityIndicator
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AdminHeaderExchange() {

    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [spProfil, setSpProfil] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const LoadImage = () => {
        setIsLoading(false);
    }

    useEffect(() => {
        async function getItemsStored() {
            try {
                //const t = await AsyncStorage.getItem("spToken");
                const id = await AsyncStorage.getItem("spId");

                await axios.get(`https://btrproject.burundientempsreel.com/surperagent/profil/${id}`)
                    .then((response) => {
                        console.log(response.data);
                        setSpProfil(response.data)
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            } catch (error) {
                console.error("Catch error: ", error)
            }
        }
        getItemsStored();

    }, []);

    const handleSettings = () => {
        setIsModalVisible(true);
    }

    const handleSignOut = () => {
        setIsModalVisible(false);
        Alert.alert("Confirmation de déconnexion", "Voulez-vous vraiment vous déconnecter?",
            [{ "text": "No", onPress: () => { return; } },
            {
                "text": "Oui", onPress: () => {
                    navigation.navigate("AdminLogin");
                    AsyncStorage.removeItem("spToke");
                    AsyncStorage.removeItem("spId");
                    console.log("Items removed from storage");
                }
            }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logo}>
                    <Image
                        source={require('../../../assets/BTR.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.logoText}>
                        <Text style={styles.mot1}>B</Text>
                        <Text style={styles.mot2}>T</Text>
                        <Text style={styles.mot3}>R</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.profile}>
                    <View style={styles.profilePicture}>

                        {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="blue" />}
                        <Image
                            source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosuperagent/${spProfil.photo}` }}
                            style={styles.profilePictureImage}
                            onLoadEnd={LoadImage}
                        />
                    </View>
                    <Text style={styles.profileName}>{spProfil.nom} {spProfil.prenom}</Text>
                </View>
                <View style={styles.settings}>
                    <TouchableOpacity style={styles.btnAccount}
                        onPress={handleSettings}>
                        <FontAwesome name="gear" size={50} color="#00f" />
                    </TouchableOpacity>
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(true)}
                        style={styles.modal}
                    >
                        <TouchableOpacity
                            style={styles.modalContainer}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalView}>
                                <FontAwesome
                                    style={styles.closeButton}
                                    name='times-circle'
                                    color='red'
                                    size={30}
                                    onPress={() => setIsModalVisible(false)}
                                />

                                <Text style={styles.nameText}>
                                    Welcome, {spProfil.nom} {spProfil.prenom}
                                </Text>

                                <TouchableOpacity onPress={() => {
                                    setIsModalVisible(false);
                                    navigation.navigate('AdminAccount')
                                }}>
                                    <Text style={styles.linkText}>Gérer votre Compte <FontAwesome name='user-circle' size={20}
                                        color="blue" /></Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSignOut}>
                                    <Text style={styles.linkText}>Se déconnecter <FontAwesome name='sign-out' size={20}
                                        color="blue" /></Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: '#ccc',
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#f90',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#000',
        bottom: 5,
        marginLeft: 4
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        fontFamily: 'serif',
        textAlign: 'center',
    },
    mot1: {
        fontWeight: 'bold',
        color: "red",
    },
    mot2: {
        fontWeight: 'bold',
        color: "white",
    },
    mot3: {
        fontWeight: 'bold',
        color: "green",
    },

    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#000',
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        fontFamily: 'serif',
        textAlign: 'center',
        marginBottom: 5
    },
    /*
     */

    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profile: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
        paddingHorizontal: 3,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 3,
        backgroundColor: '#3B82F6',
    },
    spinner: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0
    },
    profilePictureImage: {
        width: 60,
        height: 60,
    },
    profileName: {
        fontFamily: 'serif',
        fontWeight: "bold"
    },
    settings: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    settingsText: {
        fontFamily: 'serif',
        color: "blue",
    },
    btnAccount: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 5,
        padding: 10
    },

    //For Modal here
    modal: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8ebe9',
        borderRadius: 10,
        padding: 5,
        width: 300,
        height: 150,
        position: 'absolute',
        top: 130,
        right: 10,
        elevation: 5
    },
    nameText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: "serif",
    },
    linkText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: "serif",
        padding: 5,
        color: "blue",
        textDecorationLine: "underline"
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
});

export default AdminHeaderExchange;