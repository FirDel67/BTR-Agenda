import React, { useRef, useEffect, useState } from 'react';
import {
    View, Image, Text, StyleSheet, Animated, ScrollView, RefreshControl
} from 'react-native';
import * as Progress from 'react-native-progress-bars';

export default function WelcomeScreen() {
    const progressValue = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);
    const [newMsg, setNewMsg] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Animate the progress value from 0 to 1
        Animated.timing(progressValue, {
            toValue: 1,
            duration: 4000, // Animation duration in milliseconds
            useNativeDriver: false, // Make sure to set this to false for React Native Progress Bar
        }).start();

        // Update the progress state when animation completes
        progressValue.addListener(({ value }) => {
            setProgress(value);
        });

        // Clean up the listener when component unmounts
        return () => {
            progressValue.removeAllListeners();
        };
    }, []);

    setTimeout(() => {
        setNewMsg(true);
    }, 2500)

    const onRefresh = () => {
        setRefreshing(true);

        // Simulate a refresh action
        setTimeout(() => {
            setRefreshing(false);
            setNewMsg(true);
        }, 1500);
    };

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1, alignSelf: "center", alignItems: "center",
            justifyContent: "center",
        }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            <View style={styles.container}>
                <View style={styles.loading}>
                    <>
                        <Image
                            source={require('../../../assets/exchange.png')}
                            style={styles.image}
                        />
                        <Text style={{
                            textAlign: "center", position: "absolute", top: 0, fontSize: 20,
                        }}>SuperAgent</Text>
                    </>
                    <Text style={styles.text}>Bienvenue sur notre application d'Echange</Text>
                    <Text style={styles.subText}>Profitez de votre expérience !</Text>
                    {newMsg ?
                        <Text style={{ color: "blue" }}>Collecte d'informations sur le réseau</Text> :
                        <Text style={{ color: "blue" }}>Démarrage de l'application</Text>
                    }
                    <Progress.Bar progress={progress} width={300} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        alignSelf: 'center',
        backgroundColor: "#ebebed",
        borderRadius: 5,
        width: "100%"
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        color: 'gray',
    },
});