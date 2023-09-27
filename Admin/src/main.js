import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Modal, Text, Alert, Image,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import Acceuil from './Admin/acceuils/acceuil';
import Clients from './Admin/Clients/main_clients';
import CommandesAdmin from './Admin/commandes/commandesAdmin';
import AdminAccount from './Admin/Account/AdminAccount';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

    const [spProfil, setSpProfil] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("spToken");
            const id = await AsyncStorage.getItem("spId");

            await axios.get(`https://btrproject.burundientempsreel.com/surperagent/profil/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    setSpProfil(response.data)
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        getItemsStored()
    }, [])

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{
        }}>
            <View style={{
                alignSelf: "center", flexDirection: "column",
                marginVertical: 10, alignItems: "center",
                justifyContent: "center",
            }}>
                <Text style={{
                    fontSize: 20, textAlign: "center",
                    paddingVertical: 10, color: "#0535f7"
                }}>{spProfil.nom} {spProfil.prenom}</Text>
                {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="blue" />}
                <Image
                    source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosuperagent/${spProfil.photo}` }}
                    style={{
                        height: 150, width: 200, borderRadius: 25,
                        backgroundColor: "#3B82F6",
                    }}
                    onLoadEnd={() => setIsLoading(false)}
                />
            </View>
            <View style={{
                borderBottomWidth: 3, marginHorizontal: 10,
                marginBottom: 10, borderBottomColor: "orange",
            }}></View>
            <DrawerItemList {...props} />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoBTR}>
                    <Image source={require('../assets/BTR.png')} style={{
                        width: 40, height: 40,
                    }} />
                    <Text style={{
                        color: "blue", textDecorationLine: "underline",
                        fontSize: 25
                    }}>A propos de BTR</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

export default function AdminAfterLoginPage() {

    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [spProfil, setSpProfil] = useState({});

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("spToken");
            const id = await AsyncStorage.getItem("spId");

            await axios.get(`https://btrproject.burundientempsreel.com/surperagent/profil/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    setSpProfil(response.data)
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        getItemsStored()
    }, [])

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
        <Drawer.Navigator initialRouteName='Home'
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerRight: () => (
                    <View style={{ flexDirection: "row", padding: 10 }}>
                        <TouchableOpacity style={{ marginHorizontal: 5 }}
                            onPress={() => navigation.navigate("Home")}
                        >
                            <FontAwesome name='home' size={30} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 5 }}
                            onPress={() => navigation.navigate("Clients")}
                        >
                            <FontAwesome name='address-book' size={30} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 5 }}
                            onPress={() => navigation.navigate("Commandes")}
                        >
                            <FontAwesome name='shopping-cart' size={30} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 5 }}
                            onPress={handleSettings}
                        >
                            <FontAwesome name='gear' size={30} color="blue" />
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
                                        {spProfil.nom} {spProfil.prenom}
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
                )
            }}>
            <Drawer.Screen name='Home' component={Acceuil}
                options={{
                    title: "Page d'acceuil",
                    drawerLabel: "Acceuil",
                    drawerIcon: () => (
                        <FontAwesome name='home' size={30} color="blue" />
                    )
                }}
            />
            <Drawer.Screen name='Clients' component={Clients}
                options={{
                    title: "Vos clients",
                    drawerLabel: "Clients",
                    drawerIcon: () => (
                        <FontAwesome name='address-book-o' size={30} color="blue" />
                    )
                }}
            />
            <Drawer.Screen name='Commandes' component={CommandesAdmin}
                options={{
                    title: "Commandes",
                    drawerLabel: "Commandes des Clients",
                    drawerIcon: () => (
                        <FontAwesome name='shopping-cart' size={30} color="blue" />
                    )
                }}
            />
            {/* <Drawer.Screen name='Compte' component={AdminAccount}
                options={{
                    title: "Votre compte",
                    drawerLabel: "Compte",
                    drawerIcon: () => (
                        <FontAwesome name='user' size={35} color="blue" />
                    )
                }}
            /> */}
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({

    footer: {
        position: "relative",
        bottom: 0,
        right: 0, left: 0, marginTop: "50%",
        alignSelf: "center",
    },
    logoBTR: {
        flexDirection: 'row',
        justifyContent: "center", alignItems: "center"
    },

    //For Modal here
    modal: {
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center"
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
        top: 60,
        right: 10,
        elevation: 5
    },
    nameText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: "serif",
    },
    linkText: {
        fontSize: 20,
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