import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl, Image
} from 'react-native';

import NavBarCommande from './navBarCommandes';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import Table from 'react-native-responsive-table-view';
import { useNavigation } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import BTRSpinner from '../../spinner';

function CommandesClient() {
    const navigation = useNavigation();

    const [count, setCount] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [searchSize, setsearchSize] = useState(10);
    const handleSearchSize = (size) => {
        const sizeInt = parseInt(size);
        setsearchSize(sizeInt);
        console.log("Size data type: ", typeof sizeInt);
        console.log("Size data: ", sizeInt);
    }

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);

    };

    useEffect(() => {
        const getCommandesStandby = async () => {
            await axios.get('https://btrproject.burundientempsreel.com/commande/countstandbuy').then((response) => {
                //console.log(response.data);
                setCount(response.data)
            })
        }
        getCommandesStandby();
    }, []);

    useEffect(() => {
        const getCommandes = async () => {
            await axios.get(`https://btrproject.burundientempsreel.com/commande?page=${currentPage}&size=${searchSize}`)
                .then(response => {
                    const totalPagesGot = response.data.totalPages;
                    setTotalPages(totalPagesGot);

                    const clientExchange = response.data.Commandes.map((commande) => {

                        //console.log(commande)
                        const tempsUTC = commande.createdAt;
                        const dateUTC = new Date(tempsUTC);
                        const tempsLocal = dateUTC.toLocaleString();

                        const fullDate = tempsLocal.replace(" heure normale d’Afrique centrale", "");
                        //console.log(fullDate);
                        //console.log(tempsLocal);
                        return {
                            id: commande.id, montant: commande.montants,
                            compte: commande.Compte, date: fullDate,
                            status: commande.status,
                            description: commande.Description.substring(0, 20),
                            echangeur: commande.echangeurId
                        };
                    });
                    setTableData(clientExchange);
                })
                .catch(error => console.error(error));
        }

        console.log("Commandes fetched");
        getCommandes();
    }, [currentPage, refreshing, searchSize]);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => {
                        console.log("Page: ", i);
                        setCurrentPage(i)
                        setRefreshing(true);
                        setTimeout(() => {
                            setRefreshing(false);
                        }, 2000);
                    }}
                    style={[
                        styles.pageButton,
                        currentPage === i && styles.activePageButton,
                    ]}
                >
                    <Text style={styles.pageButtonText}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return pageNumbers;
    };

    ///////////Filtering table/////////////////////////////
    const filteredTableData = tableData.filter(row => {

        var searchText = searchQuery.toLowerCase();
        return (
            row.compte.toLowerCase().includes(searchText) ||
            row.montant.toString().toLowerCase().includes(searchText) ||
            row.description.toLowerCase().includes(searchText) ||
            row.date.toLowerCase().includes(searchText)
        );
    });


    const handleRowPress = (rowData) => {
        const id = rowData.id;

        console.log(`Selected row ID: ${id}`);
        navigation.navigate('DetailsCommandes', { id: id });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing} onRefresh={onRefresh}
                    colors={['blue', 'green']}
                />}>

            <NavBarCommande />

            <View style={{ flexDirection: "row", marginHorizontal: 3 }}>
                <View style={{
                    width: 110, marginTop: 5, alignSelf: "flex-start",
                }}>
                    <Picker
                        selectedValue={searchSize}
                        onValueChange={handleSearchSize}
                        mode="dropdown"
                        style={{
                            backgroundColor: "#ccc", fontSize: 20
                        }}
                    >
                        <Picker.Item key={1} label="5" value={5} />
                        <Picker.Item label="10" value={10} />
                        <Picker.Item key={3} label="20" value={20} />
                    </Picker>
                </View>

                <View style={styles.searchContainer}>
                    <Text style={{
                        fontSize: 14, paddingHorizontal: 35,
                        color: "#3b3b3b"
                    }}>Rechercher selon votre choix</Text>
                    <View style={styles.search}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder='Rechercher...'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity >
                            <FontAwesome name='search' size={20} color="white" style={{
                                backgroundColor: "#4684cf", padding: 10,
                                borderRadius: 5,
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.headerTitle}>
                <Text style={styles.title}>Commandes des Clients</Text>
            </View>

            {count <= 0 ?
                <View>
                    <View style={styles.noClients}>
                        <Text style={{
                            fontSize: 20, color: 'white'
                        }}>Pas de commandes en attente de validation ou à annuler</Text>
                    </View>
                    <View style={{
                        backgroundColor: "#74ad88", justifyContent: "center",
                        alignItems: "center", marginVertical: 10, padding: 10,
                        marginHorizontal: 10, elevation: 5
                    }}>
                        <Image source={require("../../../assets/BTR.png")}
                            style={{
                                width: 150, height: 150, borderRadius: 10,
                            }} />
                        <Text style={{ fontSize: 20 }}>Merci pour l'utilisation de cette application</Text>
                    </View>
                    <TouchableOpacity style={{
                        alignSelf: "flex-end", backgroundColor: "blue",
                        borderRadius: 5, padding: 5, marginVertical: 10, marginHorizontal: 10
                    }} onPress={() => { navigation.navigate("Home") }}>
                        <Text style={{ color: "white", fontSize: 16 }}><FontAwesome name='home'
                            size={16} />  Retourner à l'acceuil</Text>
                    </TouchableOpacity>
                </View> :

                <View>

                    {
                        tableData.length > 0 ? (
                            <View>
                                <View style={styles.tableContainer}>
                                    <ScrollView horizontal={true}>
                                        <Table>
                                            <Table.Row style={{ backgroundColor: "blue", paddingVertical: 5 }}>
                                                <Table.Cell style={{ width: 150, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Montant</Text></Table.Cell>
                                                <Table.Cell style={{ width: 170, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Compte</Text></Table.Cell>
                                                <Table.Cell style={{ width: 200, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Date</Text></Table.Cell>
                                                <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Description</Text></Table.Cell>
                                                <Table.Cell style={{ width: 120, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Statut</Text></Table.Cell>
                                                <Table.Cell style={{ width: 90, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Actions</Text></Table.Cell>
                                            </Table.Row>

                                            {filteredTableData.map((row, index) => (
                                                <Table.Row style={{ backgroundColor: "#dca" }}
                                                    key={row.id}
                                                >
                                                    <Table.Cell style={{ width: 150, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.montant}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 170, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.compte}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 200, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.date}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.description}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 120, alignItems: "flex-start" }}>
                                                        <Text selectable style={{
                                                            fontSize: 16, backgroundColor: "#a02afa",
                                                            borderRadius: 5, padding: 5, textAlign: "center"
                                                        }}>{row.status}</Text></Table.Cell>
                                                    <Table.Cell style={{
                                                        width: 90, alignItems: "flex-start"
                                                    }} onPress={() => handleRowPress(row)}>
                                                        <TouchableOpacity onPress={() => handleRowPress(row)}
                                                            style={{
                                                                backgroundColor: "blue", elevation: 20, padding: 5,
                                                                borderRadius: 5,
                                                            }}>
                                                            <Text style={{
                                                                fontSize: 16, textAlign: "center", color: "white",
                                                            }} >Détails</Text>
                                                        </TouchableOpacity>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table>
                                    </ScrollView>
                                </View>
                                <View style={styles.paginationBtns}>
                                    <TouchableOpacity style={styles.btnsPag}
                                        onPress={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage == 1}
                                    >
                                        <Text style={{
                                            textAlign: "center", textDecorationLine: "underline",
                                            fontSize: 18, color: "blue"
                                        }}>Previous</Text>
                                    </TouchableOpacity>

                                    <View style={{
                                        flexDirection: "row", paddingHorizontal: 5
                                    }}>
                                        {generatePageNumbers()}
                                    </View>

                                    <TouchableOpacity style={styles.btnsPag}
                                        onPress={() => setCurrentPage(currentPage + 1)}
                                        disabled={tableData.length < searchSize}
                                    >
                                        <Text style={{
                                            textAlign: "center", textDecorationLine: "underline",
                                            fontSize: 18, color: "blue"
                                        }}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <BTRSpinner />
                        )}
                </View>
            }
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: "column",
    },
    searchContainer: {
        width: "70%",
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignSelf: "flex-end"
    },
    search: {
        flexDirection: 'row',
        marginRight: 10,
    },
    searchInput: {
        width: "80%",
        fontSize: 16,
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#007aff',
        padding: 5,
        marginHorizontal: 5,
    },

    headerTitle: {
        margin: 10,
        alignSelf: "center"
    },
    title: {
        fontSize: 25,
        textDecorationLine: "underline",
        marginTop: 20,
    },
    noClients: {
        backgroundColor: "#f54c57",
        padding: 10, elevation: 5, marginHorizontal: 10
    },
    tableContainer: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    paginationBtns: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 10, backgroundColor: "#ccc", borderRadius: 5,
        padding: 5
    },

    pageButton: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3,
    },
    activePageButton: {
        backgroundColor: 'blue',
    },
    pageButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

    loading: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
    },
    loadingText: {
        fontSize: 30,
        fontFamily: 'serif',
        fontStyle: 'italic'
    },
    statusText: { color: 'green' },

    //For loading modal
    modalContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 10,
        padding: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6f7070',
    },
});

export default CommandesClient;