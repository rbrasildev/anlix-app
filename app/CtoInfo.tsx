import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusOnline } from "./StatusOnline";
import { useGlobalSearchParams } from "expo-router";
import { auth } from "@/constants/Auth";

export default function Cto() {
    const [data, setData] = useState()
    const [totalClientes, setTotalClientes] = useState(0);
    const { ctoIdent } = useGlobalSearchParams();

    const scheme = useColorScheme();

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#000',
        borderColor: '#333',
    };

    const darkTheme = {
        backgroundColor: '#121212',
        textColor: '#fff',
        color: '#87949D',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const handleCto = async () => {
        const data = await fetch(`${auth.url_sgp}/api/api.php?cto=${ctoIdent}`).then((response) => response.json())
        setData(data)
        setTotalClientes(data.length)
    }
    useEffect(() => {
        handleCto()
    }, [])

    return (
        <View style={{ ...theme, flex: 1 }}>
            <FlatList
                style={{ ...theme, padding: 5 }}
                data={data}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1E90FF']}
                        tintColor={'#1E90FF'}
                    />
                }
                ListHeaderComponent={
                    <>
                        <View style={{ marginBottom: 15, marginTop: -10, flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                            <MaterialCommunityIcons
                                name="package"
                                size={32}
                                color='#B8001C'
                            />
                            <Text style={{ color: '#666', fontSize: 24, }}>{ctoIdent}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10, gap: 10 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20, color: '#131314' }}>
                                <Text style={{ color: '#666', fontSize: 16, fontWeight: 'bold' }}><MaterialCommunityIcons size={16} name="image-filter-frames" /> Ocupadas ({totalClientes})</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20, color: '#131314' }}>
                                <Text style={{ color: '#666', fontSize: 16, fontWeight: 'bold' }}><MaterialCommunityIcons size={16} name="image-filter-frames" /> Livres ({16 - totalClientes})</Text>
                            </View>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={{ ...theme, borderRadius: 10, padding: 10, backgroundColor: item.status == 3 ? '#590202' : item.status == 4 ? '#F28705' : '#1E1F20', margin: 5 }}>
                        <View>
                            <Text style={{ color: '#ccc', fontWeight: "700", marginBottom: 4 }}>{item.nome}</Text>
                            <Text style={{ color: '#666', paddingLeft: 5 }}>{`${item.login} - ${item.status == 3 ? 'Cancelado' : item.status == 4 ? 'Suspenso' : 'Ativo'}`} </Text>
                            <View style={{ gap: 10, marginVertical: 4, borderRadius: 3, padding: 5, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ color: '#ccc', fontSize: 16, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <MaterialCommunityIcons style={{ color: '#ccc' }} name="image-filter-frames" size={20} />
                                    <Text style={{ color: '#CCC', fontSize: 20 }}>{item.splitter_port}</Text>
                                </View>
                                <View style={{ color: '#ccc', fontSize: 16, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <Text style={{ color: '#CCC', fontSize: 20 }}>{item.wifi_ssid_5}</Text>
                                    <StatusOnline isOnline={item.login} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}
