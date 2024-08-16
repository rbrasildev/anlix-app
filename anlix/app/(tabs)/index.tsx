import React, { useEffect, useState } from "react";
import { View, Text, useColorScheme } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import config from "../config";
import { auth } from "@/constants/Auth";
import { router } from "expo-router";


export default function HomeScreen() {
    const [dataMac, setDataMac] = useState([]);
    const scheme = useColorScheme();

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#333',
        color: '#333',
        borderColor: '#ccc',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#ccc',
        borderColor: '#ccc',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const handleAnlix = async () => {

        try {
            const auth = await config()
            if (!auth) {
                router.push({ pathname: '/settings' })
                return;
            }
            const response = await fetch(`${auth.url_anlix}/api/v2/device/get`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password)
                },
                body: JSON.stringify({ "fields": "model,use_tr069" })
            }).then((response) => response.json())
            setDataMac(response);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleAnlix()
    }, [])



    return (
        <View style={{ flex: 1, flexDirection: 'row', gap: 3, padding: 15, justifyContent: 'center' }}>
            <View style={{ width: '50%', height: '100%', borderRadius: 15, }}>
                <View style={{ ...theme, borderWidth: 0.5, padding: 20, margin: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} size={22} name="access-point" />
                        <Text style={{ ...theme }}>TOTAL TR069</Text>
                    </View>
                    <View style={{ ...theme, borderWidth: 10, width: 130, height: 130, justifyContent: 'center', alignItems: 'center', borderRadius: 65, marginTop: 10, borderColor: '#4CB752' }}>
                        <Text style={{ ...theme, fontSize: 32, fontWeight: '700' }}>{dataMac.length}</Text>
                    </View>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                        <Text style={{ ...theme }}>XX230v</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 32, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === 'XX230v').length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                        <Text style={{ ...theme }}>XX530v</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 32, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === 'XX530v').length}</Text>
                </View>

            </View>
            <View style={{ width: '50%', height: '100%', borderRadius: 15, padding: 15 }}>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                        <Text style={{ ...theme }}>EC220</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 32, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === 'EC220-G5').length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                        <Text style={{ ...theme }}>EC225</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 32, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === 'EC225-G5').length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                        <Text style={{ ...theme }}>EX220</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 32, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === 'EX220').length}</Text>
                </View>
            </View>

        </View >
    )
}


