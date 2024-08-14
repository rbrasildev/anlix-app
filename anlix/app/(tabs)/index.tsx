import React, { useEffect, useState } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import { auth } from "@/constants/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Configuration from "@/components/Configuration";


export default function HomeScreen() {
    const [dataMac, setDataMac] = useState({});
    const [isConfigured, setIsConfigured] = useState(true);

    const router = useRouter()
    const scheme = useColorScheme();

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#000',
        borderColor: '#ccc',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#87949D',
        borderColor: '#333',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;

    const handleAnlix = async () => {

        try {
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


    if (!isConfigured) {
        return <Configuration />
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', gap: 3, padding: 15, justifyContent: 'center' }}>
            <View style={{ width: '50%', height: '100%', borderRadius: 15, }}>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin:10, borderRadius: 15, paddingVertical: 40, justifyContent: 'center' }}>
                    <Text style={{ ...theme }}>TR069</Text>
                    <Text style={{ ...theme, fontSize: 32 }}>{dataMac.length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin:10, borderRadius: 15 }}>
                    <Text style={{ ...theme }}>XX230v</Text>
                    <Text style={{ ...theme, fontSize: 32 }}>{dataMac.filter(item => item.model === 'XX230v').length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin:10, borderRadius: 15 }}>
                    <Text style={{ ...theme }}>XX530v</Text>
                    <Text style={{ ...theme, fontSize: 32 }}>{dataMac.filter(item => item.model === 'XX530v').length}</Text>
                </View>

            </View>
            <View style={{ width: '50%', height: '100%', borderRadius: 15, padding: 15 }}>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin:10, borderRadius: 15 }}>
                    <Text style={{ ...theme }}>EC220</Text>
                    <Text style={{ ...theme, fontSize: 32 }}>{dataMac.filter(item => item.model === 'EC220-G5').length}</Text>
                </View>
                <View style={{ ...theme, borderWidth: 1, padding: 20, margin:10, borderRadius: 15 }}>
                    <Text style={{ ...theme }}>EX220</Text>
                    <Text style={{ ...theme, fontSize: 32 }}>{dataMac.filter(item => item.model === 'EX220').length}</Text>
                </View>
            </View>

        </View >
    )
}


