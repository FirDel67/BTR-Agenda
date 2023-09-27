import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function NavBarCommande() {

    const navigation = useNavigation();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const getCommandesStandby = async () => {
            await axios.get('https://btrproject.burundientempsreel.com/commande/countstandbuy').then((response) => {
                console.log(response.data);
                setCount(response.data)
            })
        }
        getCommandesStandby();
    }, []);

    console.log("Pending comm: ", count);

    return (
        <View style={styles.containerNav}>
            <TouchableOpacity style={{
                backgroundColor: 'blue', borderRadius: 10, justifyContent: "center",
                paddingHorizontal: 10, paddingVertical: 5,
            }} onPress={() => navigation.navigate('CommandesClient', { count: count })}>
                <Text style={{ color: 'white', fontSize: 16 }}>Listes</Text>
                <View style={{
                    backgroundColor: '#0572f7', position: 'absolute', top: -8, right: -10, borderRadius: 999,
                    minWidth: 20, paddingHorizontal: 5, minHeight: 25, justifyContent: "center"
                }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>{count && (count > 99 ? "99+" : count)}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{
                backgroundColor: 'blue', borderRadius: 10, justifyContent: "center",
                paddingHorizontal: 10, paddingVertical: 5
            }} onPress={() => navigation.navigate('HistoriqueCommandes')}>
                <Text style={{ color: 'white', fontSize: 16 }}>Historique</Text>
            </TouchableOpacity>
        </View>
    );
}

export default NavBarCommande;

const styles = StyleSheet.create({
    containerNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ddd',
        paddingTop: 10,
        paddingBottom: 10,
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        width: "100%",
    }
});