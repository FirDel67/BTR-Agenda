import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native";

function ResetPassword() {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const emailReference = useRef(null);

    const handleResetPasword = () => {
        console.log("reset password initalization")
    };

    return (
        <View style={styles.resetPasswordContainer}>

            <View style={styles.innerResetPassword}>

                <View style={styles.goBack}>
                    <TouchableOpacity
                        style={styles.GoBackbutton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Retourner</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formResetPassword}>

                    <Text style={styles.resetTitle}>Reset Password</Text>

                    <View style={styles.inputField}>
                        <TextInput
                            ref={emailReference}
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleResetPasword}
                    >
                        <Text style={styles.buttonText}>Réinitialiser</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    resetPasswordContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    goBack: {
        alignItems: "flex-end",
        justifyContent: 'flex-end',
    },
    GoBackbutton: {
        backgroundColor: "#353",
        height: 50,
        borderRadius: 10,
        margin: 20,
        justifyContent: "center"
    },

    formResetPassword: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#edf7f7",
        borderRadius: 10,
        elevation: 20,
        padding: 8
    },

    resetTitle: {
        fontSize: 25,
        color: "orange",
    },

    input: {
        backgroundColor: "#d1f1d1",
        height: 50,
        borderRadius: 10,
        paddingLeft: 20,
        borderBottomWidth: 2,
        borderBottomColor: "orange",
        fontSize: 20,
    },

    inputField: {
        marginBottom: 20,
        width: "100%"
    },

    button: {
        backgroundColor: "#090",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    buttonText: {
        color: "#fff",
        fontSize: 25,
    },

    innerResetPassword: {
        width: "90%",
    }
});


export default ResetPassword;