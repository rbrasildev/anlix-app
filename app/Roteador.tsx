import React, { useState, useEffect } from 'react';
import { useGlobalSearchParams } from 'expo-router';

import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Alert, View, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { API_URL, API_USER, API_PASSWORD } from '@env'
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

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
}

export default function Roteador() {
    const [loading, setLoading] = useState(true)
    const [dataWifi, setDataWifi] = useState<RoteadorProps>({});


    const params = useGlobalSearchParams()

    const scheme = useColorScheme();
    const lightTheme = {
        textColor: '#000',
        color: '#141414',
        backgroundColor: '#f9f9f9'
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#fff',
        backgroundColor: '#212121'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;



    const callGetApi = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v2/device/update/${params.mac}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(API_USER + ':' + API_PASSWORD)
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
        const response = await fetch(`${API_URL}/api/v2/device/update/${params.mac}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(API_USER + ':' + API_PASSWORD)
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

        }).catch(error => {
            if (error.response.status == 500) {
                Alert.alert(
                    error.message,
                    "Erro ao atualizar o Roteador, Favor pedir para as meninas tirar a porra dos caracteres especiais. Tente novamente!",
                )
            }
            if (error.response.status == 404) {
                Alert.alert(
                    error.message,
                    "Falha ao conectar com o servidor"
                );
            }
            if (error.code == "ERR_NETWORK") {
                Alert.alert(
                    "Erro",
                    error.message
                )
            }
            console.log(error)
            return;
        })

        if (response.status == 200) {
            Alert.alert(
                'Successo',
                "Configuração aplicada com sucesso!"
            )
        }

    }

    useEffect(() => {
        callGetApi();
    }, [])

    if (loading) { return <ActivityIndicator size="large" color="#fff" /> }

    return (
        <View style={{ flex: 1, padding: 5, gap: 3 }}>
            <View style={{ paddingHorizontal: 15, gap: 3 }}>
                <View style={{ ...theme, padding: 10, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ ...theme, fontSize: 22 }}>{getStatus()} </Text>
                        <MaterialCommunityIcons
                            name='lock'
                            size={24}
                            style={{ ...theme }}
                        />
                        {dataWifi.use_tr069 ? <Text style={{ ...theme }}>tr069</Text> : 'Firmware'}
                    </View>
                    <View>
                        <Text style={{ ...theme, fontWeight: 'bold', fontSize: 20, }}>Modelo</Text>
                        <Text style={{ ...theme, }}>{dataWifi.model}</Text>
                    </View>
                </View>

                <View style={{ ...theme, padding: 10, borderRadius: 10 }}>
                    <View style={{ ...theme, marginTop: 15, flexDirection: 'row', gap: 3 }}>
                        <TabBarIcon name='navigate' size={20} style={{ ...theme }} />
                        <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold', }}>PPPoE_User</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16, marginLeft: 30 }}>{dataWifi.pppoe_user}</Text>
                    <View style={{ ...theme, marginTop: 15, flexDirection: 'row', gap: 3 }}>
                        <TabBarIcon name='lock-closed' size={20} style={{ ...theme }} />
                        <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold', }}>PPPoE_User</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16, marginLeft: 30 }}>{dataWifi.pppoe_password}</Text>
                </View>

                <View style={{ ...theme, padding: 10, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <TabBarIcon name='wifi' size={20} style={{ ...theme }} />
                        <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold' }}>SSID</Text>
                    </View>
                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_ssid}</Text>
                    <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold' }}>Password</Text>
                    <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_password}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 3 }}>
                        <TabBarIcon name='wifi' size={20} style={{ ...theme }} />
                        <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold' }}>SSID 5Ghz</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_ssid_5ghz}</Text>
                        <Text style={{ ...theme, fontSize: 20, fontWeight: 'bold' }}>Password_5</Text>
                        <Text style={{ ...theme, fontSize: 16 }}>{dataWifi.wifi_password_5ghz}</Text>
                    </View>
                </View>
            </View>

            <Text>
                {loading && <ActivityIndicator size="large" color="#00ff00" />}
            </Text>
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity style={styles.button}
                    onPress={callPostApi}
                >
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Aplicar</Text>
                </TouchableOpacity>
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
        borderRadius: 10,
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
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
        marginHorizontal: 15,
    }
});