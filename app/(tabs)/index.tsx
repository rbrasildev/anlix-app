import React, { useEffect, useState } from "react";
import { View, Text, useColorScheme, ScrollView, ActivityIndicator } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import config from "../config";
import { router } from "expo-router";
import getDeviceData from "../services/getDeviceData";


interface DeviceProps {
    model: String;
    use_tr069: boolean
}


export default function HomeScreen() {
    const [models, setModels] = useState<DeviceProps[]>([])
    const [dataMac, setDataMac] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

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
        setIsLoading(true)
        try {
            const auth = await config()
            if (!auth) {
                router.push({ pathname: '/settings' })
                return;
            }

            const response: DeviceProps[] = await getDeviceData();

            const uniqueModels: String[] = [...new Set(response.map((item: DeviceProps) => item.model))];

            setModels(uniqueModels);
            setDataMac(response)

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleAnlix()
    }, [])

    const renderDeviceCard = (model: string) => (
        <View key={model} style={{ ...theme, borderWidth: 1, padding: 20, margin: 10, borderRadius: 15 }}>
            <View style={{ flexDirection: 'row', gap: 3 }}>
                <MaterialCommunityIcons style={{ ...theme }} name="router-wireless" size={18} />
                <Text style={{ ...theme, maxWidth: '85%' }}>{model}</Text>
            </View>
            <Text style={{ ...theme, fontSize: 36, fontWeight: 'bold' }}>{dataMac.filter(item => item.model === model).length}</Text>
        </View>

    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={theme.color} size={48} />
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', gap: 3, padding: 15, justifyContent: 'center' }}>
                <View style={{ width: '50%', height: '100%', borderRadius: 15, }}>
                    <View style={{ ...theme, borderWidth: 0.5, padding: 20, margin: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <MaterialCommunityIcons style={{ ...theme }} size={22} name="access-point" />
                            <Text style={{ ...theme, fontSize: 18 }}>Total </Text>
                        </View>
                        <View style={{ ...theme, borderWidth: 10, width: 130, height: 130, justifyContent: 'center', alignItems: 'center', borderRadius: 65, marginTop: 10, borderColor: '#4CB752' }}>
                            <Text style={{ ...theme, fontSize: 32, fontWeight: '700' }}>{dataMac.length}</Text>
                        </View>
                    </View>
                    {models.map((model, key) => (key <= 2 && renderDeviceCard(model)))}
                </View>

                <View style={{ width: '50%', height: '100%', borderRadius: 15, padding: 15 }}>
                    {models.map((model, key) => (key > 2 && renderDeviceCard(model)))}
                </View>

            </View >
        </ScrollView>
    )
}


