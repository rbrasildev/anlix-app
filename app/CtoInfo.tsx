import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusOnline } from "./StatusOnline";
import { useGlobalSearchParams } from "expo-router";
import * as Animatable from 'react-native-animatable';


export default function Cto() {
    const [data, setData] = useState()
    const [totalClientes, setTotalClientes] = useState(0);
    const { ctoIdent } = useGlobalSearchParams();

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        borderColor: '#ddd',
        color: '#333',
        backgroundColor: '#f3f3f4',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#666',
        borderColor: '#212121',
        backgroundColor: '#141414'
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
        const data = await fetch(`https://sgpos.redeconexaonet.com/api/api.php?cto=${ctoIdent}`).then((response) => response.json())
        setData(data)
        setTotalClientes(data.length)
    }
    useEffect(() => {
        handleCto()
    }, [])

    return (
        <View style={{ flex: 3, padding: 10 }}>
            <FlatList
                style={{ padding: 5, gap:4 }}
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
                    <View className="py-4">
                        <View className="mb-2 flex-row items-center">
                            <MaterialCommunityIcons
                                name="package"
                                size={32}
                                style={{ color: theme.color }}
                            />
                            <Text className="font-bold text-gray-500 text-2xl">{ctoIdent}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                <Text className="font-bold text-zic-400 dark:text-gray-400"><MaterialCommunityIcons size={16} name="image-filter-frames" /> Ocupadas ({totalClientes})</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                <Text className="font-bold text-zic-400 dark:text-gray-400"><MaterialCommunityIcons size={16} name="image-filter-frames" /> Livres ({16 - totalClientes})</Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item, index }) => (
                    <Animatable.View
                        animation={'fadeInUp'}
                        duration={300 * index}
                        className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl mb-2"
                    >
                        <View className="p-4">
                            <Text className="font-bold mb-2 text-zinc-800 dark:text-zinc-500">{item.nome}</Text>

                            <Text style={{
                                paddingLeft: 5,
                                color: item.status == 3 ? '#E3371E' : item.status == 4 ? '#F2AE30' : '#666'
                            }}>
                                {`${item.login} - ${item.status == 3 ? 'Cancelado' : item.status == 4 ? 'Suspenso' : 'Ativo'}`}
                            </Text>
                            <View
                                style={{
                                    gap: 10,
                                    marginVertical: 4,
                                    borderRadius: 3,
                                    padding: 5,
                                    alignItems: 'flex-start',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10, alignItems: 'center'
                                    }}>
                                    <MaterialCommunityIcons style={{
                                        color: theme.color
                                    }}
                                        name="image-filter-frames"
                                        size={20}
                                    />
                                    <Text
                                        style={{
                                            color: theme.color,
                                            fontSize: 20,
                                        }}>
                                        {item.splitter_port}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        alignItems: 'center',

                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: theme.color,
                                        }}>
                                        {item.wifi_ssid_5}
                                    </Text>
                                    <StatusOnline isOnline={item.login} />
                                </View>
                            </View>
                        </View>
                    </Animatable.View>
                )}
            />
        </View>
    )
}
