import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Button
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';

const MyForm = () => {
    const [montant, setMontant] = useState('');
    const [compte, setCompte] = useState('');
    const [description, setDescription] = useState('');

    const [files, setFiles] = useState([]);

    const handleFileUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            multiple: true,
        });
        if (result.type === 'success') {
            setFiles(result.output);
        }
    };

    const handleCommander = () => {
        console.log(files);
    }

    return (
        <View style={styles.container}>
            <Text>Montant</Text>
            <TextInput
                value={montant}
                onChangeText={setMontant}
                placeholder="Entrez le montant"
                style={styles.input}
            />
            <Text>Compte</Text>
            <TextInput
                value={compte}
                onChangeText={setCompte}
                placeholder="Entrez le compte"
                style={styles.input}
            />
            <Text>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Entrez la description"
                style={styles.input}
            />
            <TouchableOpacity onPress={handleFileUpload}>
                <Text style={styles.button}>Ajouter des images</Text>
            </TouchableOpacity>

            <Button title="Commander" onPress={handleCommander} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default MyForm;