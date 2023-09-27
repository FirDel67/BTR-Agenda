import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { ToastAndroid } from 'react-native';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (name.trim() === '') {
            ToastAndroid.show('Le nom est obligatoire', ToastAndroid.SHORT);
            return;
        }

        if (email.trim() === '') {
            ToastAndroid.show("L'adresse email est obligatoire", ToastAndroid.SHORT);
            return;
        }

        if (message.trim() === '') {
            ToastAndroid.show('Votre commentaire est nécessaire', ToastAndroid.SHORT);
            return;
        }

        // Perform form submission logic here
    };

    return (
        <View>
            <Text>Remerciement</Text>
            <Text>
                Nous apprécions votre visite et votre intérêt pour nos services. Si vous
                rencontrez des problèmes ou des difficultés lors de votre utilisation du
                site, nous sommes là pour vous aider. Votre expérience est importante
                pour nous, et nous sommes engagés à fournir un service de qualité.
            </Text>
            <Text>
                Si vous avez des suggestions d'amélioration ou si vous rencontrez des
                problèmes techniques, n'hésitez pas à nous en informer. Votre retour nous
                permettra d'identifier les problèmes et de les résoudre rapidement pour
                rendre votre expérience sur notre site encore meilleure.
            </Text>
            <Text>
                Nous vous remercions de votre soutien et de votre collaboration. Nous
                sommes impatients de vous offrir une expérience agréable et satisfaisante
                sur notre site. N'hésitez pas à nous contacter en remplissant le
                formulaire ci-dessous si vous avez des questions ou des préoccupations.
            </Text>
            <Text>Formulaire de contact</Text>
            <TextInput
                placeholder="Nom"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType='email-address'
            />
            <TextInput
                placeholder="Message"
                value={message}
                onChangeText={setMessage}
                multiline={true}
                numberOfLines={4}
                style={styles.inputMessage}
            />
            <Button title="Envoyer" onPress={handleSubmit} />
        </View>
    );
}

export default Contact;