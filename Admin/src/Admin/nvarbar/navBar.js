import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function NavBarsClientEchangeAdmin() {

    const navigation = useNavigation();
    const [pendingNumber, setPendingNumber] = useState("0");

    useEffect(() => {
        axios.get(`https://btrproject.burundientempsreel.com/echangeur/countstandbuy`)
            .then((response) => {
                console.log(response.data);
                setPendingNumber(response.data);
            })
            .catch((error) => {
                console.error("Fetch countstandbuy error: ", error);
            });
    }, []);

    console.log(Dimensions.get("window"))

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('AllClients', { allClients: true })}
                style={styles.navButton}>
                <Text style={styles.navButtonText}>Listes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('AjouterClient')}
                style={styles.navButton} >
                <Text style={styles.navButtonText}>Nouveau client</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ClientEnAttente', {
                    clientEnAttente: true,
                    pendingNumber: pendingNumber
                })}
                style={styles.navButton} >
                <Text style={styles.navButtonText}>Clients en attente</Text>
                <View style={[styles.badge, { backgroundColor: pendingNumber > 0 ? "#075bf7" : 'green', }]}>
                    <Text style={styles.badgeText}>{pendingNumber}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around', backgroundColor: '#ddd',
        paddingTop: 10, paddingBottom: 10, position: 'relative',
        top: 0, left: 0, right: 0, zIndex: 10, width: "100%", flexWrap: 'wrap',
    },
    navButton: {
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'blue', borderRadius: 10, justifyContent: "center",
    },
    navButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    badge: {
        borderRadius: 50, maxWidth: 50,
        minWidth: 25, padding: 3, justifyContent: 'center',
        alignItems: 'center', position: 'absolute', top: -9, right: -3,
    },
    badgeText: {
        color: '#fff',
    },
});

export default NavBarsClientEchangeAdmin;