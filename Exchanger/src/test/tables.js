import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default function MyTable() {


    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const fullDate = day + '-' + month + '-' + year

    const head = ['Montant     ', 'Compte      ', 'Date         ', 'Description                  ', "Statut", "Actions"]
    const body = [
        ['2000000', "LUMICASH", fullDate, "Original", "Success", "Détails"],
        ['2000000', "LUMICASH", fullDate, "Original", "Success", "Détails"],
        ['2000000', "LUMICASH", fullDate, "Original", "Success", "Détails"]
    ]

    return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContainer}>
            <Text >Tableau de Détails des commandes</Text>
            <View style={styles.container}>
                <Table borderStyle={styles.table}>
                    <Row data={head} style={styles.header}
                        textStyle={styles.headerText} />
                    <Rows data={body} textStyle={styles.cell} />
                </Table>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: "column",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        paddingTop: 30
    },
    table: {
        borderWidth: 2, borderColor: "#8ad"
    },
    header: {
        height: 40, backgroundColor: "#f1f8ff"
    },
    headerText: {
        textAlign: "center", fontWeight: 'bold'
    },
    cell: {
        height: 40, borderWidth: 2, borderColor: "#449", padding: 10
    }
});