import { useEffect, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, Clipboard, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { useGlobalSearchParams, useRouter } from "expo-router";

import Toast from 'react-native-toast-message';
import config from './config';




interface UserSgpProps {
    razaoSocial: string;
    servico_wifi_password: string;
    servico_wifi_password_5: string;
    servico_wifi_ssid: string;
    servico_wifi_ssid_5: string;
    servico_login: string;
    servico_senha: string;
}

export default function Cliente<UserSgpProps>() {
    const router = useRouter();
    const {
        contratoId,
        razaoSocial,
        servico_wifi_password,
        servico_wifi_password_5,
        servico_wifi_ssid,
        servico_wifi_ssid_5,
        servico_login,
        servico_senha
    } = useGlobalSearchParams()

    const [servicoWifiPassword, setServicoWifiPassword] = useState(servico_wifi_password);
    const [servicoWifiPassword5, setServicoWifiPassword5] = useState(servico_wifi_password_5);
    const [servicoWifiSsid, setServicoWifiSsid] = useState(servico_wifi_ssid);
    const [servicoWifiSsid5, setServicoWifiSsid5] = useState(servico_wifi_ssid_5);


    const [macAddress, setMacAddress] = useState('');
    const [iconCopy, setIconCopy] = useState('content-copy')
    const [loading, setLoading] = useState(false);

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

    const callGetMac = async () => {
        const auth = await config();
        if (macAddress == "") {
            Toast.show({
                type: 'info',
                text1: 'Este campo não pode ser vazio, por favor informe o mac do roteador',
            })
            return
        }
        try {
            const response = await fetch(`${auth.url_anlix}/api/v2/device/update/${macAddress}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password)
                    }
                }
            ).then((response) => response.json())

            if (response.success == false) {
                Toast.show({
                    type: 'error',
                    text1: `${response.message}, verifique se o roteador está ligado`,
                })

                return;
            }

            if (response.status == 404) {
                Toast.show({
                    type: 'info',
                    text1: `${response.message}, verifique se o roteador está ligado`,
                })
                return
            }


            router.push({
                pathname: "/Roteador",
                params: {
                    mac: macAddress,
                    wifi_ssid: servicoWifiSsid,
                    wifi_password: servicoWifiPassword,
                    wifi_ssid_5: servicoWifiSsid5,
                    wifi_password_5: servicoWifiPassword5,
                    login: servico_login,
                    login_password: servico_senha,
                }

            });

            setLoading(true);
        } catch (error) {
            console.log(error)
        }
    }


    const formatMAC = (input: string) => {
        const formatted = input.replace(/(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})/g, "$1:$2:$3:$4:$5:$6").toUpperCase();
        setMacAddress(formatted);
    };

    const handleInputChange = (text: string) => {

        if (text.length === 12) {
            formatMAC(text);
        } else {
            setMacAddress(text);
        }
    };

    const copyToClipboard = (content: string) => {
        Clipboard.setString(content);
    };

    return (

        <KeyboardAvoidingView
            behavior="position"
            enabled>

            <ScrollView>

                <View style={{
                    padding: 15,
                }}>
                    <View style={{ ...theme, padding: 15, borderWidth: 1, borderRadius: 15 }}>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <MaterialCommunityIcons
                                name={'account'}
                                size={24}
                                color='#4CB752'
                            />
                            <Text style={{ ...theme, fontWeight: "600", fontSize: 20, maxWidth: '95%' }}>{razaoSocial}</Text>
                        </View>
                        <Text style={{ ...theme, marginLeft: 28 }}>Usuário PPPoE: {servico_login}</Text>
                    </View>

                    <View style={{ ...theme, borderWidth: 1, borderRadius: 15, padding: 15, marginVertical: 10 }}>

                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <MaterialCommunityIcons
                                name={'wifi'}
                                size={24}
                                color='#4CB752'
                            />
                            <Text style={{ ...theme, fontSize: 20 }}> 2.4Ghz Network</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1, marginTop: 3 }}>
                                <Text style={{ ...theme, color: '#333' }}>Network name</Text>
                                <TextInput
                                    style={{ ...theme, fontSize: 20, borderRadius: 8, marginVertical: 5 }}
                                    value={servicoWifiSsid}
                                    onChangeText={setServicoWifiSsid}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ padding: 4, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => copyToClipboard(wifi_ssid)}
                            >
                                <Text style={{ ...theme }}>
                                    <MaterialCommunityIcons
                                        style={{ ...theme }}
                                        name={iconCopy}
                                        size={28}
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...theme, color: '#333', marginBottom: 2 }}>Password</Text>
                                <TextInput
                                    style={{ ...theme, fontSize: 20 }}
                                    value={servicoWifiPassword}
                                    onChangeText={setServicoWifiPassword}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ padding: 4, borderRadius: 4 }}
                                onPress={() => copyToClipboard(servicoWifiPassword)}
                            >
                                <Text style={{ ...theme }}>
                                    <MaterialCommunityIcons
                                        style={{ ...theme }}
                                        name={iconCopy}
                                        size={28}
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>



                    <View style={{ ...theme, borderWidth: 1, borderRadius: 15, padding: 15 }}>
                        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 5, }}>
                            <MaterialCommunityIcons
                                name={'wifi'}
                                size={24}
                                color='#4CB752'
                            />
                            <Text style={{ ...theme, fontSize: 20 }}> 5 GHz Network</Text>
                        </View>
                        <Text style={{ ...theme, color: '#333' }}>Network name</Text>
                        <TextInput
                            style={{
                                ...theme,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 5,
                                fontSize: 20,
                            }}
                            value={servicoWifiSsid5}
                            onChangeText={setServicoWifiSsid5}

                        />
                        <Text style={{ ...theme, color: '#333', marginTop: 2 }}>Password</Text>
                        <TextInput
                            style={{
                                ...theme,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 5,
                                marginBottom: 3,
                                fontSize: 20,
                            }}
                            value={servicoWifiPassword5}
                            onChangeText={setServicoWifiPassword5}

                        />
                    </View>

                    <View>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: "row",
                        }}>

                        </View>

                        <View style={{
                            ...theme,
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: 15,
                            marginVertical: 10,

                        }}>
                            <TextInput style={{
                                ...theme,
                                marginVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                paddingHorizontal: 15,
                                fontSize: 20,
                                backgroundColor: 'transparent'


                            }}
                                placeholderTextColor="#87949D"
                                value={macAddress}
                                onChangeText={handleInputChange}
                                placeholder="Digite o endereço MAC"
                                keyboardType="ascii-capable"
                            >
                            </TextInput>
                            {macAddress && (
                                <TouchableOpacity
                                    onPress={() => setMacAddress('')}
                                    style={{ padding: 4 }}>

                                    <MaterialCommunityIcons
                                        style={{ padding: 3 }}
                                        color={'#666'}
                                        size={25}
                                        name='close-octagon'
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity style={styles.button}
                            onPress={callGetMac}
                        >
                            <Text style={{ fontSize: 20, fontWeight: '500' }}>Gerenciar CPE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#131314',
        padding: 15,
    },

    title: {
        fontSize: 20,
        color: '#4CB752',
        fontWeight: 'bold',
        marginBottom: 30,
    },

    subTitle: {
        fontSize: 18,
        color: '#87949D',
        margin: 5.4,
    },

    titleDescription: {
        fontSize: 20,
        color: '#395487',
        fontWeight: 'bold',
        marginBottom: 30,
    },

    card: {
        padding: 20,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 4,
        color: '#FFF',
        fontSize: 30,
        elevation: 1,
    },
    input: {
        backgroundColor: '#1E1F20',
        elevation: 1,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        fontSize: 20,
        color: '#87949D',
    },

    input_secondary: {
        borderRadius: 10,
        backgroundColor: '#87949D30',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        padding: 10,
        paddingHorizontal: 15,
        fontSize: 20,
        color: '#fff',
        borderWidth: 1,
        borderColor: "#333",
    },

    button: {
        backgroundColor: '#4CB752',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    }
});

