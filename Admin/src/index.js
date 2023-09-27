import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdminSignIn from "./Admin/Account/LoginAdmin";
import AdminSignUp from "./Admin/Account/RegisterAdmin";
import ResetPassword from "./Admin/Account/ResetPassword";
import AdminAccount from "./Admin/Account/AdminAccount";
import ModifyAdminInfo from "./Admin/Account/ModifyInfo";
import AdminAfterLoginPage from "./main";

const Stack = createStackNavigator();

export default function AdminPage() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="AdminLogin" component={AdminSignIn} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="AdminSignup" component={AdminSignUp} />
            <Stack.Screen name="AdminAccount" component={AdminAccount} />
            <Stack.Screen name="ModifyAdminInfo" component={ModifyAdminInfo} />
            <Stack.Screen name="AdminMainPage" component={AdminAfterLoginPage} />
        </Stack.Navigator>
    )
}