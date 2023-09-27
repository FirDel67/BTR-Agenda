import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import AdminHeaderExchange from './header';

const Acceuil = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollCont}>
            <AdminHeaderExchange />

            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        <Text style={{ color: "#4e4887" }}>Bienvenue de nouveau</Text>
                        <Text style={{ color: "#f0aa3a" }}> sur votre cote comme admin</Text>
                        <Text style={{ color: "#5d61e8" }}> d'échange de monnaie électronique</Text>
                    </Text>
                    <Text style={styles.text}> Nous sommes ravis de vous revoir parmi nous. Vous avez déjà créé un compte et nous vous remercions de votre confiance continue.{'\n'}
                        Connectez-vous simplement à votre compte en utilisant vos identifiants précédemment enregistrés, c'est-à-dire votre adresse e-mail et votre mot de passe.{'\n'}{'\n'}
                        Une fois connecté, vous pourrez profiter de tous nos services d'échange de monnaie électronique en toute simplicité.
                        Nous sommes là pour vous accompagner à chaque étape de vos transactions.{'\n'}

                        Grâce à notre plateforme, vous pouvez effectuer des échanges rapides et fiables entre différentes monnaies électroniques telles que Lumicash, Ecocash, et bien d'autres. Vous avez déjà pris la bonne
                        décision en choisissant notre service, et nous sommes là pour vous accompagner à chaque étape.{'\n'}{'\n'}

                        Encore une autre fois, nous vous remercions de votre confiance continue envers Burundi en temp réel. Nous sommes ravis de vous accompagner dans vos
                        échanges de monnaie électronique et de vous offrir un service de qualité supérieure.{'\n'}

                        Notre équipe d'assistance est disponible pour vous aider 24 heures sur 24, 7 jours sur 7.{'\n'}{'\n'}
                        N'hésitez pas à nous contacter si vous avez des questions, des suggestions ou des préoccupations.
                        Merci de faire partie de notre communauté d'échange de monnaie électronique. Nous sommes impatients de vous offrir une expérience exceptionnelle à chaque connexion. Bonnes transactions !
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollCont: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer: {
        paddingVertical: 5
    },
    container: {
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontFamily: 'serif',
        textAlign: 'center',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'justify',
    },
});

export default Acceuil;