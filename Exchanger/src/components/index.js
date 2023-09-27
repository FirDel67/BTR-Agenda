import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableOpacity, Modal, Alert, ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import MotAcceuilUserExchange from '../user/acceuil';
import CommandesNavigation from "../user/commande/Details/for_details";
//import ClientDetails from "../user/account/userAccount";

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

    const [profil, setProfile] = useState({});
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("exchangerToken");
            const id = await AsyncStorage.getItem("exchangeId");
            setUserId(id);

            await axios.get(`https://btrproject.burundientempsreel.com/echangeur/profil/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    setProfile(response.data);
                })
                .catch((error) => {
                    console.error("Custom comp: ", error);
                })
        }
        getItemsStored();
    }, [])


    return (
        <DrawerContentScrollView {...props}>
            <View style={{
                alignSelf: "center", flexDirection: "column",
                marginVertical: 10, alignItems: "center",
                justifyContent: "center",
            }}>
                <Text style={{
                    fontSize: 20, textAlign: "center",
                    paddingVertical: 10, color: "#0535f7"
                }}>{profil.nom && (profil.nom + ' ' + profil.prenom)}</Text>

                {isLoading && <ActivityIndicator style={styles.spinner} size="large" color="blue" />}
                <Image
                    source={{ uri: `https://btrproject.burundientempsreel.com/uploads/photosechange/${profil.profil}` }}
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
        </DrawerContentScrollView>
    );
}

function UserExchangeApp() {

    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [profil, setProfile] = useState({});
    const [userId, setUserId] = useState("");

    useEffect(() => {
        async function getItemsStored() {
            //const t = await AsyncStorage.getItem("exchangerToken");
            const id = await AsyncStorage.getItem("exchangeId");
            setUserId(id);

            await axios.get(`https://btrproject.burundientempsreel.com/echangeur/profil/${id}`)
                .then((response) => {
                    //console.log(response.data);
                    setProfile(response.data);
                })
                .catch((error) => {
                    console.error("Main drawer: ", error);
                })
        }
        getItemsStored();
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
        <Drawer.Navigator initialRouteName="Account"
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerTitleAlign: 'left',
                drawerLabelStyle: { fontSize: 20 },
                drawerItemStyle: { borderBottomWidth: 1, borderBottomColor: '#ccc' },
                headerRight: () => (
                    <View style={styles.headerRightIcons}>
                        <TouchableOpacity style={styles.btnAccount}
                            onPress={() => navigation.navigate('MotAcceuil')}>
                            <FontAwesome name="home" size={30} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAccount}
                            onPress={() => navigation.navigate('Commande')}>
                            <MaterialIcons name="shopping-cart" size={30}
                                style={styles.icon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnAccount}
                            onPress={handleSettings}>
                            <FontAwesome name="gear" size={30} color="#00f" style={styles.icon} />
                        </TouchableOpacity>
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={isModalVisible}
                            onRequestClose={() => setIsModalVisible(true)}
                            style={styles.modal}
                        >

                            <View style={styles.modalView}>
                                <TouchableOpacity
                                    style={styles.closeButton}>
                                    <FontAwesome
                                        name='times-circle' color='red' size={30}
                                        onPress={() => setIsModalVisible(false)}
                                    /></TouchableOpacity>
                                <Text style={styles.nameText}>
                                    {profil.nom && (profil.nom + ' ' + profil.prenom)}
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setIsModalVisible(false);
                                    navigation.navigate('UserAccount')
                                }}>
                                    <Text style={styles.linkText}><FontAwesome name="address-card" size={18} color="#00f" />  Gérer votre Compte</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSignOut}>
                                    <Text style={styles.linkText}><FontAwesome name="sign-out" size={18} color="#00f" />  Se déconnecter</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                ),
            }}
        >
            <Drawer.Screen name="MotAcceuil" component={MotAcceuilUserExchange}
                options={{
                    title: "Page d'Acceuil",
                    drawerIcon: () => (
                        <FontAwesome name="home" size={30} color='blue' />
                    ),
                }}
            />

            <Drawer.Screen name="Commande" component={CommandesNavigation}
                options={{
                    title: "Vos commandes",
                    drawerLabel: "Commande",
                    drawerIcon: () => (
                        <MaterialIcons name="shopping-cart" size={30} color="blue" />
                    )
                }}
            />

            {/* <Drawer.Screen name="ClientDetails" component={ClientDetails}
                options={{
                    title: "Votre Compte",
                    drawerLabel: "Compte",
                    drawerIcon: () => (
                        <MaterialIcons name="person" size={30} color="blue" />
                    )
                }}
            /> */}

        </Drawer.Navigator>
    )
}

export default UserExchangeApp;

const styles = StyleSheet.create({
    headerRightIcons: {
        flexDirection: "row",
    },
    icon: {
        color: "#33d",
        margin: 5
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
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#e8ebe9',
        borderRadius: 10, padding: 5, width: 300, height: 150,
        position: 'absolute', top: 60, right: 10, elevation: 5
    },
    nameText: {
        fontSize: 18,
        textAlign: 'center', flexWrap: "wrap",
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