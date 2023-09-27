import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';

import NavBarCommande from './navBarCommandes';

import Table from 'react-native-responsive-table-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

import { Picker } from '@react-native-picker/picker';
import BTRSpinner from '../../spinner';

function HistoriqueCommandes() {

    const navigation = useNavigation();
    const route = useRoute();

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

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    useEffect(() => {
        const getHistoryCommandes = async () => {
            await axios.get(`https://btrproject.burundientempsreel.com/commande/history?page=${currentPage}&size=${searchSize}`)
                .then(response => {
                    const totalPagesGot = response.data.totalPages;
                    setTotalPages(totalPagesGot);

                    const clientExchange = response.data.Commandes.map((commande) => {

                        //console.log(commande)
                        const tempsUTC = commande.createdAt;
                        const dateUTC = new Date(tempsUTC);
                        const tempsLocal = dateUTC.toLocaleString().replace(" heure normale d’Afrique centrale", "");

                        //console.log(tempsLocal);
                        return {
                            id: commande.id,
                            montant: commande.montants,
                            compte: commande.Compte,
                            date: tempsLocal,
                            status: commande.status,
                            description: commande.Description.substring(0, 20) + "...",
                        };
                    });
                    setTableData(clientExchange);
                })
                .catch(error => console.error(error));
        }

        console.log("History comm fetched successfully");
        getHistoryCommandes()
    }, [currentPage, refreshing, searchSize, route.params?.comValidated, route.params?.validated]);

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
        navigation.navigate('DetailsHistoriques', { id: id });
    };

    //////////////////For filtering table////////////////////////
    const filteredTableData = tableData.filter(row => {

        var searchText = searchQuery.toLowerCase();
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
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} colors={['blue', 'green']} />}
        >
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
                <Text style={styles.title}>Historique des Commandes</Text>
            </View>
            {
                tableData.length > 0 ? (
                    <View>
                        <ScrollView horizontal={true}>
                            <View style={styles.tableContainer}>
                                <Table>
                                    <Table.Row style={{ backgroundColor: "blue", paddingVertical: 5 }}>
                                        <Table.Cell style={{ width: 150, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Montant</Text></Table.Cell>
                                        <Table.Cell style={{ width: 170, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Compte</Text></Table.Cell>
                                        <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white", }} selectable>Date</Text></Table.Cell>
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
                                            <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.date}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 250, alignItems: "flex-start" }}><Text style={{ fontSize: 16 }} selectable>{row.description}</Text></Table.Cell>
                                            <Table.Cell style={{ width: 120, alignItems: "flex-start" }}>
                                                <Text selectable style={{
                                                    fontSize: 18, borderRadius: 5, padding: 6,
                                                    textAlign: "center",
                                                    backgroundColor: row.status !== "success" ? "#d40217" : "#024f1b",
                                                    color: row.status === "Anullée" ? "black" : "white"
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
                                                        fontSize: 20, color: "white",
                                                        textAlign: "center"
                                                    }} >Détails</Text>
                                                </TouchableOpacity>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table>
                            </View>
                        </ScrollView>
                        <View style={styles.paginationBtns}>
                            <TouchableOpacity style={styles.btnsPag}
                                onPress={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage == 1}
                            >
                                <Text style={{
                                    textAlign: "center", textDecorationLine: "underline",
                                    fontSize: 25, color: "blue"
                                }}>Previous</Text>
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: "row", paddingHorizontal: 5
                            }}>
                                {generatePageNumbers()}
                            </View>

                            <TouchableOpacity style={styles.btnsPag}
                                onPress={() => setCurrentPage(currentPage + 1)}
                                disabled={tableData.length < 10}
                            >
                                <Text style={{
                                    textAlign: "center", textDecorationLine: "underline",
                                    fontSize: 25, color: "blue"
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
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 20
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

    loading: {
        flex: 2,
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
});

export default HistoriqueCommandes;