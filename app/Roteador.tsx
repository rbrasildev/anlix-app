import React, { useState, useEffect } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, ActivityIndicator, useColorScheme, StyleSheet, FlatList, ScrollView } from 'react-native';

import Toast from 'react-native-toast-message';
import config from './config';



interface RoteadorProps {
    online_status: boolean;
    status: number;
    use_tr069: boolean;
    model: string;
    pppoe_user: string;
    pppoe_password: string;
    wifi_ssid: string;
    wifi_ssid_5ghz: string;
    wifi_password: string;
    wifi_password_5ghz: string;
    lan_devices: [];
}

export default function Roteador() {
    const [loading, setLoading] = useState(true)
    const [dataWifi, setDataWifi] = useState<RoteadorProps>([]);


    const params = useGlobalSearchParams()

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        borderColor: '#ccc',
        color: '#333',
        backgroundColor: '#fff',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#87949D',
        borderColor: '#212121',
        backgroundColor: '#141414'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const callGetApi = async () => {
        const auth = await config();
        try {
            const response = await fetch(`${auth.url_anlix}/api/v2/device/update/${params.mac}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password)
                    }
                }
            ).then((response) => response.json())
            setDataWifi(response);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

    }

    function getStatus() {
        if (dataWifi.online_status == true) {
            return <View style={styles.online}></View>

        } else {
            return <View style={styles.offline}></View>
        }
    }

    //criar wifi
    const callPostApi = async () => {
        try {
            const auth = await config();
            const response = await fetch(`${auth.url_anlix}/api/v2/device/update/${params.mac}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password)
                },
                body: JSON.stringify(
                    {
                        "content": {
                            mac_address: params.mac,
                            pppoe_user: params.login,
                            pppoe_password: params.login_password,
                            wifi_ssid: params.wifi_ssid,
                            wifi_password: params.wifi_password,
                            wifi_ssid_5ghz: params.wifi_ssid_5,
                            wifi_password_5ghz: params.wifi_password_5,
                        }
                    })

            })
            if (response.status == 200) {
                Toast.show({
                    type: 'success',
                    text1: "Configuração aplicada com sucesso!"
                })
            }

            if (response.status == 404) {
                Toast.show({
                    type: 'error',
                    text1: "Roteador não encontrado!"
                })
            }

            if (response.status == 500) {
                Toast.show({
                    type: 'error',
                    text1: "Erro ao validar os campos!",
                    text2: "Certifique que os dados estão corretos"
                })
            }



        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        callGetApi();
    }, [])

    if (loading) { return <ActivityIndicator size="large" color="#fff" /> }

    const devices = (device: RoteadorProps | any) => {
        return (
            <View style={{ ...theme, borderWidth: 1, borderRadius: 15, padding: 5, marginHorizontal: 15 }}>
                <Text style={{ ...theme, padding: 10, paddingBottom: 0, }}>Conectados</Text>
                <Text style={{ ...theme, textAlign: 'center' }}>{device == '' && 'Nenhum dispostivo conectado!'}</Text>
                <FlatList
                    style={{ paddingHorizontal: 15, height: '40%' }}
                    data={device}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...theme }}>{item.dhcp_name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ ...theme }}>{item.ip}</Text>
                                <MaterialCommunityIcons color={theme.color} name='signal-cellular-3' />
                            </View>
                        </View>
                    )}
                />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, padding: 5, gap: 3 }}>
            <View style={{ paddingHorizontal: 15, gap: 6 }}>
                <View style={{ ...theme, padding: 10, borderWidth: 1, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ ...theme }}>{getStatus()} </Text>
                        <MaterialCommunityIcons
                            name='lock'
                            size={24}
                            style={{ ...theme }}
                        />
                        {dataWifi.use_tr069 ? <Text style={{ color: theme.color }}>tr069</Text> : 'Firmware'}
                    </View>
                    <View>
                        <Text style={{ color: '#666', fontWeight: 'bold', }}>Modelo</Text>
                        <Text style={{ ...theme, }}>{dataWifi.model}</Text>
                    </View>

                    <View style={{ ...theme, marginTop: 10, flexDirection: 'row', gap: 3 }}>
                        <Text style={{ color: '#666', fontWeight: 'bold', }}>PPPOE</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.pppoe_user}</Text>
                    <View style={{ ...theme, marginTop: 10, flexDirection: 'row', gap: 3 }}>
                        <Text style={{ color: '#666', fontWeight: 'bold', }}>PPPOE Password</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.pppoe_password}</Text>
                </View>

                <View style={{ ...theme, padding: 10, borderWidth: 1, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <MaterialCommunityIcons name='wifi' color='#666' size={24} />
                        <Text style={{ ...theme, fontWeight: 'bold' }}>2.4Ghz Network</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_ssid}</Text>

                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_password}</Text>

                    <View style={{ borderTopWidth: 0.5, marginTop: 10, ...theme }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 3 }}>
                        <MaterialCommunityIcons name='wifi' color='#666' size={24} />
                        <Text style={{ ...theme, fontWeight: 'bold' }}>5Ghz Network</Text>
                    </View>
                    <View>
                        <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_ssid_5ghz}</Text>

                        <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_password_5ghz}</Text>
                    </View>
                </View>
            </View>

            <View>
                {devices(dataWifi.lan_devices)}
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button}
                        onPress={callPostApi}
                    >
                        <Text>{loading && <ActivityIndicator size="large" color="#00ff00" />}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '500' }}>Aplicar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#131314',
    },

    title: {
        fontSize: 20,
        color: '#eeee',
        alignItems: "center",
        justifyContent: "center",
        margin: 6
    },

    subTitle: {
        fontSize: 18,
        color: '#fff',
        margin: 5.4,
        fontWeight: 'bold'
    },


    card: {
        padding: 20,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: '#1e1f20',
        borderRadius: 15,
        color: '#FFF',
        fontSize: 30,
        width: "90%"

    },


    online: {
        color: '#4CAF50',
        marginRight: 20,
        width: 20,
        height: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
    },
    offline: {
        color: 'red',
        marginRight: 20,
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#F55265',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
        marginHorizontal: 15,
    }
});