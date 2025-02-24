import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatusOnline from "./StatusOnline";
import { useGlobalSearchParams } from "expo-router";
import * as Animatable from 'react-native-animatable';

export default function Cto() {
    const [data, setData] = useState()
    const [totalClientes, setTotalClientes] = useState(0);
    const { ctoIdent } = useGlobalSearchParams();
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
        <View className="flex-1 p-2.5">
            <FlatList
                className="p-1.5"
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
                                color={"#ccc"}
                            />
                            <Text className="font-bold text-gray-500 text-2xl">{ctoIdent}</Text>
                        </View>
                        <View className="flex-row gap-2.5">
                            <View className="items-center justify-center rounded-2xl">
                                <Text className="font-bold text-zinc-400 dark:text-gray-400">
                                    <MaterialCommunityIcons size={16} name="image-filter-frames" />
                                    Ocupadas ({totalClientes})
                                </Text>
                            </View>
                            <View className="items-center justify-center rounded-2xl">
                                <Text className="font-bold text-zinc-400 dark:text-gray-400 gap-2">
                                    <MaterialCommunityIcons size={16} name="image-filter-frames" />
                                    Livres ({16 - totalClientes})
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item, index }) => (
                    <Animatable.View
                        animation={'fadeInUp'}
                        duration={300 * index}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl mb-2"
                    >
                        <View className="p-4">
                            <Text className="font-bold mb-2 text-zinc-800 dark:text-zinc-500">
                                {item.nome}
                            </Text>

                            <Text className={`pl-1.5 ${item.status == 3
                                    ? 'text-[#E3371E]'
                                    : item.status == 4
                                        ? 'text-[#F2AE30]'
                                        : 'text-gray-600'
                                }`}>
                                {`${item.login} - ${item.status == 3
                                        ? 'Cancelado'
                                        : item.status == 4
                                            ? 'Suspenso'
                                            : 'Ativo'
                                    }`}
                            </Text>

                            <View className="flex-row justify-between items-center gap-2.5 my-1 rounded p-1.5">
                                <View className="flex-row items-center gap-2.5">
                                    <MaterialCommunityIcons
                                        color={"#ccc"}
                                        name="image-filter-frames"
                                        size={20}
                                    />
                                    <Text className="text-gray-500 dark:text-gray-400 text-xl">
                                        {item.splitter_port}
                                    </Text>
                                </View>

                                <View className="flex-row items-center gap-2.5">
                                    <Text className="text-gray-500 dark:text-gray-400 text-base">
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
