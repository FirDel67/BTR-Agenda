import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NavBarsUsersEchangee from "./navBar/HomeHeader";

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function MotAcceuilUserExchange() {

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <NavBarsUsersEchangee />

            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Text style={styles.title} selectable={true}>
                        <Text style={styles.mot2}>Bienvenue de </Text>
                        <Text style={styles.mot3}>nouveau sur notre </Text>
                        <Text style={styles.mot1}>plateforme d'échange de </Text>
                        <Text style={styles.mot2}>monnaie électronique !</Text>
                    </Text>
                    <Text style={styles.text} selectable={true}>
                        Nous sommes ravis de vous revoir parmi nous. Vous avez déjà créé un compte et nous vous remercions de votre confiance continue.
                        {"\n\n"}
                        Connectez-vous simplement à votre compte en utilisant vos identifiants précédemment enregistrés, c'est-à-dire votre adresse e-mail et votre mot de passe.
                        {"\n\n"}
                        Une fois connecté, vous pourrez profiter de tous nos services d'échange de monnaie électronique en toute simplicité. Nous sommes là pour vous accompagner à chaque étape de vos transactions.
                        {"\n\n"}
                        Grâce à notre plateforme, vous pouvez effectuer des échanges rapides et fiables entre différentes monnaies électroniques telles que Lumicash, Ecocash, et bien d'autres. Vous avez déjà pris la bonne décision en choisissant notre service, et nous sommes là pour vous accompagner à chaque étape.
                        {"\n\n"}
                        Encore une autre fois, nous vous remercions de votre confiance continue envers Burundi en temp réel. Nous sommes ravis de vous accompagner dans vos échanges de monnaie électronique et de vous offrir un service de qualité supérieure.
                        {"\n\n"}
                        Notre équipe d'assistance est disponible pour vous aider 24 heures sur 24, 7 jours sur 7.
                        {"\n\n"}
                        N'hésitez pas à nous contacter si vous avez des questions, des suggestions ou des préoccupations.
                        {"\n\n"}
                        Merci de faire partie de notre communauté d'échange de monnaie électronique. Nous sommes impatients de vous offrir une expérience exceptionnelle à chaque connexion. Bonnes transactions !
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        flexDirection: "column"
    },
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        margin: 10,
        padding: 5
    },
    title: {
        fontSize: 22,
        fontFamily: 'serif',
        textAlign: 'center',
    },
    mot1: {
        color: "#6c6e32",
    },
    mot2: {
        color: "#d17c04"
    },
    mot3: {
        color: "#3dd961"
    },
    text: {
        marginTop: 20,
        lineHeight: 20,
        textAlign: 'justify',
    },
});

export default MotAcceuilUserExchange;