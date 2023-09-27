import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';


function BTRSpinner() {

    return (
        <View style={styles.container}>
            <View style={styles.spinnerContainer}>
                <ActivityIndicator size='large' />
                <Text style={styles.loadingText}>Veuillez patienter...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center",
        alignSelf: "center",
    },
    spinnerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: 'blue',
        fontFamily: 'serif',
        fontSize: 18,
        marginTop: 10,
    },
});

export default BTRSpinner;