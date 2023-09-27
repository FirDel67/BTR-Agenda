import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


import Table from 'react-native-responsive-table-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

import BTRSpinner from '../../spinner';

function AfficherCommandeUserEchange() {
    const navigation = useNavigation();
    const route = useRoute();

    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [searchSize, setsearchSize] = useState(10);
    const [refreshing, setRefreshing] = useState(false);

    const handleSearchSize = (size) => {
        const sizeInt = parseInt(size);
        setsearchSize(sizeInt);
    }

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        const getCommandes = async () => {

            const iduser = await AsyncStorage.getItem("exchangeId")

            await axios.get(`https://btrproject.burundientempsreel.com/commande/byId/${iduser}?page=${currentPage}`)
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
    }, [currentPage, refreshing, searchSize, route.params?.comEffectuee]);


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

    const handleRowPress = (rowData) => {
        const id = rowData.id;

        console.log(`Selected row ID: ${id}`);
        navigation.navigate('Details', { id: id });
    };

    /////////////Filtering table/////////////////////////////
    const filteredTableData = tableData.filter(row => {
        const searchText = searchQuery.toLowerCase();
        return (
            row.compte.toLowerCase().includes(searchText) ||
            row.montant.toString().toLowerCase().includes(searchText) ||
            row.description.toLowerCase().includes(searchText) ||
            row.status.toLowerCase().includes(searchText) ||
            row.date.toLowerCase().includes(searchText)
        );
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing}
                    onRefresh={onRefresh} colors={["blue", "black"]} />
            }
        >

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
                        <Picker.Item key={2} label="10" value={10} />
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
                <Text style={styles.title}>Mes Commandes effectuées</Text>
            </View>
            {
                tableData.length > 0 ? (
                    <View>
                        <View style={styles.tableContainer}>
                            <ScrollView horizontal={true}>
                                <Table>
                                    <Table.Row style={{ backgroundColor: "blue" }}>
                                        <Table.Cell style={{ width: 150, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Montant</Text></Table.Cell>
                                        <Table.Cell style={{ width: 180, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Compte</Text></Table.Cell>
                                        <Table.Cell style={{ width: 200, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Date</Text></Table.Cell>
                                        <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Description</Text></Table.Cell>
                                        <Table.Cell style={{ width: 130, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Statut</Text></Table.Cell>
                                        <Table.Cell style={{ width: 100, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }} selectable>Actions</Text></Table.Cell>
                                    </Table.Row>

                                    {filteredTableData.map((row, index) => (
                                        <Table.Row style={{ backgroundColor: "#dca" }}
                                            key={row.id}
                                        >
                                            <Table.Cell style={{ width: 150, alignItems: "flex-start" }}><Text selectable>{row.montant}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 180, alignItems: "flex-start" }}><Text selectable>{row.compte}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 200, alignItems: "flex-start" }}><Text selectable>{row.date}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text selectable>{row.description}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 130, alignItems: "flex-start" }}>
                                                <Text selectable style={{
                                                    fontSize: 16, backgroundColor: row.status === "En attente" ? "#b305f7" : row.status === "Anullée" ? "red" : "green",
                                                    borderRadius: 5, padding: 5, textAlign: "center", color: "white"
                                                }}>{row.status}</Text></Table.Cell>
                                            <Table.Cell style={{
                                                width: 100, alignItems: "flex-start"
                                            }}>
                                                <TouchableOpacity onPress={() => handleRowPress(row)}
                                                    style={{
                                                        backgroundColor: "blue", elevation: 20, padding: 5,
                                                        borderRadius: 5,
                                                    }}>
                                                    <Text style={{
                                                        fontSize: 16, color: "white",
                                                        textAlign: "center"
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
                                }}>Précédent</Text>
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
                                }}>Suivant</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <BTRSpinner />
                )}
        </ScrollView>
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
        margin: 10, alignSelf: "center",
        borderBottomWidth: 2, borderBottomColor: '#007aff',
    },
    title: {
        color: "#0e6cf0",
        fontSize: 20
    },
    tableContainer: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
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

    //Pagination buttons

    paginationBtns: {
        flexDirection: "row", justifyContent: 'center', alignItems: "center",
        flexWrap: "wrap",
        marginTop: 10, backgroundColor: "#ccc", borderRadius: 5, padding: 5
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

});

export default AfficherCommandeUserEchange;