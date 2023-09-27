import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BuyerSignIn from "./Login";
import Sinscrire from "./register";

import { FontAwesome } from "@expo/vector-icons";

const BTab = createBottomTabNavigator();

function Accounts() {
    return (
        <BTab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
                height: 50
            }
        }}>
            <BTab.Screen name="Login" component={BuyerSignIn}
                options={{
                    tabBarLabel: "Se Connecter",
                    tabBarLabelStyle: { fontSize: 20 },
                    tabBarIcon: () => (
                        <FontAwesome name="sign-in" size={20} color="blue" />
                    )
                }}
            />
            <BTab.Screen name="Register" component={Sinscrire}
                options={{
                    tabBarLabel: "S'inscrire",
                    tabBarLabelStyle: { fontSize: 20 },
                    tabBarIcon: () => (
                        <FontAwesome name="sign-out" size={20} color="blue" />
                    )
                }}
            />
        </BTab.Navigator>
    )
}

export default Accounts;