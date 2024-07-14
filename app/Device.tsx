import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, useColorScheme, Clipboard, RefreshControl, FlatList, SafeAreaView } from "react-native";
import { API_URL, API_USER, API_PASSWORD } from '@env'

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
            const response = await fetch(`${API_URL}api/v2/device/get/`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(API_USER + ':' + API_PASSWORD)
                },
                body: JSON.stringify({ "fields": "_id,pppoe_user,model,use_tr069" })
            }).then((response) => response.json())
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

        <FlatList
            data={resetdefaults}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) =>
                <View
                    key={item._id}
                    style={{
                        ...theme,
                        marginTop: 4,
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
                    colors={['#1E90FF']} // Cor do indicador de atualização
                    tintColor={'#1E90FF'} // Cor de fundo do indicador de atualização no iOS
                />
            }
            ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                        <ActivityIndicator style={{ marginTop: '80%' }} size="large" color="#fff" />
                    ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...theme, backgroundColor: 'transparent', marginTop: 250, fontSize: 18 }}>Nenhum registro</Text>
                        </View>
                    )}
                </View>
            }
        />

    );
}
