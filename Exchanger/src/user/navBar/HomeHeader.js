import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet,
    TouchableOpacity, Modal, Alert, ActivityIndicator
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NavBarsUsersEchangee() {

    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [profil, setProfile] = useState({});
    const [userId, setUserId] = useState("");

    //For image when not loaded
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("exchangerToken");
            const id = await AsyncStorage.getItem("exchangeId");

            await axios.get(`https://btrproject.burundientempsreel.com/echangeur/profil/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    setProfile(response.data);
                })
                .catch((error) => {
                    console.error("Home Header", error);
                })
        }
        getItemsStored();
    }, [])

    const handleSettings = () => {
        //console.log('connected user id:', userObj.id)
        setIsModalVisible(true);
    }

    const handleSignOut = () => {
        setIsModalVisible(false);
        Alert.alert("Confirmation de déconnexion", "Voulez-vous vraiment vous déconnecter?",
            [{ "text": "No", onPress: () => { return; } },
            {
                "text": "Oui", onPress: () => {
                    AsyncStorage.removeItem("exchangeToken");
                    AsyncStorage.removeItem("exchangeId");
                    console.log("Items removed from storage");
                    navigation.navigate("Login");
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
                            source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${profil.profil}` }}
                            style={styles.profilePictureImage}
                            onLoadEnd={() => setIsLoading(false)}
                        />
                    </View>
                    <Text style={styles.profileName}>{profil.nom && (profil.nom + ' ' + profil.prenom)}</Text>
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
                        <View style={styles.modalView}>
                            <FontAwesome
                                style={styles.closeButton}
                                name='times-circle'
                                color='red'
                                size={30}
                                onPress={() => setIsModalVisible(false)}
                            />

                            <Text style={styles.nameText}>
                                {profil.nom && (profil.nom + ' ' + profil.prenom)}
                            </Text>

                            <TouchableOpacity onPress={() => {
                                setIsModalVisible(false);
                                navigation.navigate('UserAccount', { id: userId })
                            }}>
                                <Text style={styles.linkText}><FontAwesome name="address-card" size={18} color="#00f" />  Gérer votre Compte</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSignOut}>
                                <Text style={styles.linkText}><FontAwesome name="sign-out" size={18} color="#00f" />  Se déconnecter</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", backgroundColor: '#ccc',
        width: '100%', paddingVertical: 5,
        justifyContent: 'space-between', alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: '#f90',
        paddingHorizontal: 5
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
        alignItems: 'flex-end',
        alignSelf: "flex-end",
        right: 0
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
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 3,
    },
    spinner: {
        position: 'absolute',
    },
    profilePictureImage: {
        width: 200,
        height: 200,
    },
    profileName: {
        fontFamily: 'serif',
        fontWeight: "bold"
    },
    settings: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    settingsText: {
        fontFamily: 'serif',
        color: "blue",
        fontSize: 20
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
        fontFamily: "serif", flexWrap: "wrap",
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

export default NavBarsUsersEchangee;