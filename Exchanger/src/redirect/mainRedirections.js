import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserExchangeApp from "../components";
import BuyerSignIn from "../user/account/Login";
import Sinscrire from "../user/account/register";
import ClientDetails from "../user/account/userAccount";
import ModifyAccountInfo from "../user/account/modifyAccount";

const Stack = createStackNavigator();

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={BuyerSignIn} />
            <Stack.Screen name="Regiter" component={Sinscrire} />
            <Stack.Screen name="UserExchange" component={UserExchangeApp} />
            <Stack.Screen name="UserAccount" component={ClientDetails} />
            <Stack.Screen name="ModifyInfo" component={ModifyAccountInfo} />
        </Stack.Navigator>
    )
}