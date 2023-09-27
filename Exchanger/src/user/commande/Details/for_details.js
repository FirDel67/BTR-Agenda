import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { FontAwesome } from "@expo/vector-icons";

import RenderCommande from "../commande";
import DetailsCommande from "../Details";

const Stack = createStackNavigator();

export default function CommandesNavigation() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="RenderComande" component={RenderCommande}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="Details" component={DetailsCommande}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}