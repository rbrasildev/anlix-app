import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, Clipboard, RefreshControl, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import config from "../config";
import getDeviceData from "../services/getDeviceData";

export default function Device() {
    const [dataMac, setDataMac] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        color: '#141414',
        backgroundColor: '#fff',
        borderColor: '#ddd'
    };

    const darkTheme = {
        textColor: '#ccc',
        color: '#ccc',
        borderColor: '#222',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;

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

    const resetdefaults = dataMac.filter(item => item.pppoe_user === "resetdefault");

    useEffect(() => {
        handleResetDefault()
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        handleResetDefault()
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <FlatList
                data={resetdefaults}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) =>
                    <View
                        key={item._id}
                        style={{
                            ...theme,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: "row",
                            padding: 5,
                            borderRadius: 10,
                            marginHorizontal: 15,
                            borderWidth: 1,
                        }}>
                        <View style={{
                            ...theme,
                            width: 60, height: 60,
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 4,
                        }}>

                            <MaterialCommunityIcons
                                name="router-wireless"
                                size={24}
                                color='#4CB752'
                            />
                            <Text style={{ ...theme, fontSize: 10, }}>{item.model}</Text>
                            <Text style={{ ...theme, fontSize: 8, }}>{item.use_tr069 ? 'tr069' : 'firmware'}</Text>
                        </View>
                        <View>
                            <Text style={{ ...theme, fontSize: 20, }}>{item._id}</Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                padding: 4,
                                borderRadius: 4,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                            }}
                            onPress={() => {
                                Clipboard.setString(resetdefaults[index]._id);
                            }}
                        >
                            <View>
                                <MaterialCommunityIcons
                                    style={{ ...theme }}
                                    name="content-copy"
                                    size={24}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#1E90FF']}
                        tintColor={'#1E90FF'}
                    />
                }
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isLoading ? (
                            <ActivityIndicator style={{ marginTop: 5 }} size="large" color="#fff" />
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ ...theme, backgroundColor: 'transparent', marginTop: 250, fontSize: 18 }}>Nenhum registro</Text>
                            </View>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
}
