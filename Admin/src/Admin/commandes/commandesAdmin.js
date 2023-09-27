import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommandesClient from "./commandesClient";
import CommandeDetail from "./detailsCommandes";
import HistoriqueCommandes from "./historyCommandes";
import HistoryDetails from "./detailsHistoryCom";

const Native = createNativeStackNavigator();

export default function CommandesAdmin() {
    return (
        <Native.Navigator screenOptions={{
            headerShown: false
        }}>
            <Native.Screen name="CommandesClient" component={CommandesClient} />
            <Native.Screen name="HistoriqueCommandes" component={HistoriqueCommandes} />
            <Native.Screen name="DetailsCommandes" component={CommandeDetail} />
            <Native.Screen name="DetailsHistoriques" component={HistoryDetails} />
        </Native.Navigator>
    )
}