import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


import ClientDetails from "./DetailsClients";
import AllClients from "./AllClients";
import AddClient from "./newClient";
import PendingClients from "./PendingClient";
import StandByVoirPlus from "./DetailsPendingClients";

const Stack = createStackNavigator();

export default function Clients() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="AllClients" component={AllClients} />
            <Stack.Screen name="DetailsClient" component={ClientDetails} />
            <Stack.Screen name="AjouterClient" component={AddClient} />
            <Stack.Screen name="ClientEnAttente" component={PendingClients} />
            <Stack.Screen name="DetailsClientEnAttente" component={StandByVoirPlus} />
        </Stack.Navigator>
    )
}