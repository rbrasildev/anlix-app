import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, RefreshControl, FlatList } from "react-native";
import * as Clipboard from 'expo-clipboard';

import getDeviceData from "../services/getDeviceData";

type RoteadorProps = {
    _id: string;
    pppoe_user: string;
    model: string;
    use_tr069: boolean;
}

export default function Device() {
    const [dataMac, setDataMac] = useState<RoteadorProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)

    const copyToClipboard = async (content: string) => {
        await Clipboard.setStringAsync(content);
    };

    const handleResetDefault = async () => {
        setIsLoading(true);
        try {
            const response = await getDeviceData();
            setDataMac(response);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    let resetdefaults = dataMac.filter(item => item.pppoe_user === "resetdefault");

    useEffect(() => {
        handleResetDefault()
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        handleResetDefault()
    };

    if (refreshing) {
        resetdefaults = [];
    }

    return (
        <View className="flex-1 justify-center">
            <FlatList
                data={resetdefaults}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <View
                        key={item._id}
                        className="flex-row items-center justify-between mt-2.5 rounded-2xl border border-gray-200 dark:border-gray-800"
                    >
                        <View className="w-[60px] h-[60px] rounded-full items-center justify-center mr-1">
                            <MaterialCommunityIcons
                                name="router-wireless"
                                size={24}
                                color='#4CB752'
                            />
                            <Text className="text-xs dark:text-gray-300">{item.model}</Text>
                            <Text className="text-[8px] dark:text-gray-300">
                                {item.use_tr069 ? 'tr069' : 'firmware'}
                            </Text>
                        </View>
                        
                        <View>
                            <Text className="text-xl dark:text-gray-300">{item._id}</Text>
                        </View>

                        <TouchableOpacity
                            className="p-1 rounded justify-center items-center mr-2.5"
                            onPress={() => copyToClipboard(resetdefaults[index]._id)}
                        >
                            <View>
                                <MaterialCommunityIcons
                                    className="dark:text-gray-300"
                                    name="content-copy"
                                    size={24}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#1E90FF']}
                        tintColor={'#1E90FF'}
                    />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center">
                        {isLoading ? (
                            <ActivityIndicator className="mt-1" size="large" color="#fff" />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="mt-64 text-lg dark:text-gray-300">
                                    Nenhum registro
                                </Text>
                            </View>
                        )}
                    </View>
                }
            />
        </View>
    );
}
