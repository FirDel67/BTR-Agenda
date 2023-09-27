import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, Image, RefreshControl
} from 'react-native';

import NavBarsClientEchangeAdmin from '../nvarbar/navBar';

import Table from 'react-native-responsive-table-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

import { Picker } from '@react-native-picker/picker';

import BTRSpinner from '../../spinner';

function AllClients() {

    const navigation = useNavigation();
    const route = useRoute();

    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [triggerFetch, setTriggerFetch] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [searchSize, setsearchSize] = useState(10);
    const elemetRefSelect = useRef(null);

    const handleSearchSize = (size) => {
        const sizeInt = parseInt(size);
        setsearchSize(sizeInt);
        console.log("Size data type: ", typeof sizeInt);
        console.log("Size data: ", sizeInt);
    }

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setTriggerFetch(true);
        }, 2000);
    };

    useEffect(() => {
        const getEchangeurs = async () => {
            await axios
                .get(`https://btrproject.burundientempsreel.com/echangeur?page=${currentPage}&size=${searchSize}`)
                .then((response) => {
                    const totalPagesGot = response.data.totalPages;
                    setTotalPages(totalPagesGot);

                    console.log("Triggered fetch");

                    const clientExchange = response.data.echangeurs.map((data) => {
                        return {
                            id: data.id,
                            nom: data.nom,
                            prenom: data.prenom,
                            telephone: data.tel,
                            email: data.email,
                            codeAgent: data.codeagent,
                            banque: data.banck,
                            profil: data.profil,
                        };
                    });
                    setTableData(clientExchange);
                })
                .catch((error) => {
                    console.error("Error getting exchanges APIs:\n", error);
                });
        };

        console.log(refreshing);

        getEchangeurs();
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
                            setTriggerFetch(true);
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

    const clientDetails = (rowData) => {
        const id = rowData.id;

        console.log(`Selected row ID: ${id}`);
        navigation.navigate('DetailsClient', { id: id });
    };

    ////////For searching or filtering///////////////
    const filteredTableData = tableData.filter(row => {

        //console.log(row);
        const searchText = searchQuery.toLowerCase();
        return (
            row.nom.toLowerCase().includes(searchText) ||
            row.prenom.toLowerCase().includes(searchText) ||
            row.email.toLowerCase().includes(searchText) ||
            row.telephone.toLowerCase().includes(searchText) ||
            row.banque.toLowerCase().includes(searchText) ||
            row.codeAgent.toLowerCase().includes(searchText)
        );
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing}
                onRefresh={onRefresh} colors={["blue", "green"]} />
            }
        >

            <NavBarsClientEchangeAdmin />

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
                <Text style={styles.title}>Tous les Clients</Text>
            </View>

            <View style={styles.container}>
                {
                    tableData.length > 0 ? (
                        <View style={{
                            flex: 1,
                        }}>
                            <ScrollView horizontal={true} contentContainerStyle={{
                                display: "flex"
                            }}>
                                <View style={styles.tableContainer}>
                                    <Table>
                                        <Table.Row style={{ backgroundColor: "blue", paddingVertical: 5 }}>
                                            <Table.Cell style={{ width: 100, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Profil</Text></Table.Cell>
                                            <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Nom</Text></Table.Cell>
                                            <Table.Cell style={{ width: 120, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Prénom</Text></Table.Cell>
                                            <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Téléphone</Text></Table.Cell>
                                            <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Adresse Email</Text></Table.Cell>
                                            <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Code Agent</Text></Table.Cell>
                                            <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Banque</Text></Table.Cell>
                                            <Table.Cell style={{ width: 80, display: "flex", alignItems: "flex-start" }}><Text style={{ fontSize: 20, color: "white" }}>Actions</Text></Table.Cell>
                                        </Table.Row>

                                        {filteredTableData.map((row, index) => {
                                            const profileName = row.profil;
                                            // Construire l'URL de l'image pour cette ligne
                                            const url = `http://btrproject.burundientempsreel.com/uploads/photosechange/${profileName}`;
                                            //  console.log(url);
                                            return (
                                                <Table.Row style={{ backgroundColor: "#dca" }} key={row.id}>
                                                    <Table.Cell style={{ width: 100, display: "flex", alignItems: "flex-start", position: 'relative' }}>
                                                        <View style={{ backgroundColor: '#3B82F6', borderRadius: 100, overflow: 'hidden' }}>
                                                            {isLoading && (
                                                                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
                                                            )}
                                                            <Image
                                                                source={{ uri: url }}
                                                                onLoad={handleImageLoad}
                                                                style={styles.image}
                                                            />
                                                        </View>
                                                    </Table.Cell>
                                                    <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text>{row.nom}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 120, display: "flex", alignItems: "flex-start" }}><Text>{row.prenom}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text>{row.telephone}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text>{row.email}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text>{row.codeAgent}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 150, display: "flex", alignItems: "flex-start" }}><Text>{row.banque}</Text></Table.Cell>
                                                    <Table.Cell style={{ width: 80, display: "flex", alignItems: "flex-start" }}>
                                                        <TouchableOpacity style={{
                                                            backgroundColor: "blue", elevation: 20, padding: 5,
                                                            borderRadius: 5,
                                                        }} onPress={() => clientDetails(row)}>
                                                            <Text style={{ textAlign: "center", fontSize: 20, color: "white" }}>Voir+</Text>
                                                        </TouchableOpacity>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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

    container: {
        flex: 2,
        margin: 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: "center",
    },
    tableContainer: {
        backgroundColor: "yellow",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"

    },

    spinner: {
        position: 'absolute', top: 0,
        left: 0, right: 0, bottom: 0,
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
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

    headerTitle: {
        margin: 20,
        alignSelf: "center"
    },
    title: {
        color: "#105ee6",
        fontSize: 25
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

    buttonText: {
        margin: 3,
        elevation: 30,
        height: 25,
        width: 80,
        borderRadius: 5,
        borderBottomWidth: 3,
        borderBottomColor: "orange",
        color: "white",
        textAlign: "center",
        fontSize: 15
    }
});

export default AllClients;