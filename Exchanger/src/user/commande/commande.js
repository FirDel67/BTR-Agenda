import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import NewCommandeUserEchange from "./NewCommande";
import AfficherCommandeUserEchange from "./AfficherCommande";

import { FontAwesome } from "@expo/vector-icons";

const BTab = createBottomTabNavigator();

function RenderCommande() {
    return (
        <BTab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
                height: 50, backgroundColor: "#dee0e0"
            }
        }}>
            <BTab.Screen name="ShowCommande" component={AfficherCommandeUserEchange}
                options={{
                    tabBarLabel: "Commandes effectuées",
                    tabBarLabelStyle: { fontSize: 15 },
                    tabBarIcon: () => (
                        <FontAwesome name="history" size={20} color="blue" />
                    ),

                }}
            />

            <BTab.Screen name="NewCommande" component={NewCommandeUserEchange}
                options={{
                    tabBarLabel: "Nouvelle commande",
                    tabBarLabelStyle: { fontSize: 15 },
                    tabBarIcon: () => (
                        <FontAwesome name="cart-plus" size={20} color="blue" />
                    )
                }}
            />
        </BTab.Navigator>
    )
}

export default RenderCommande;