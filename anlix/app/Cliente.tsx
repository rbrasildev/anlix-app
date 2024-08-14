import { useEffect, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, Clipboard, StyleSheet, useColorScheme } from 'react-native';
import { useGlobalSearchParams, useRouter } from "expo-router";
import { auth } from '@/constants/Auth';
import { getBackgroundColorAsync } from 'expo-system-ui';

interface WifiProps {
    wifi_ssid: string;
    wifi_password: string;
    wifi_ssid_5: string;
    wifi_password_5: string;
}

interface UserSgpProps {
    nome: string;
    login: string;
    login_password: string;
    mac: string;
    wifi_ssid: string;
    wifi_password: string;
    wifi_ssid_5: string;
    wifi_password_5: string;
}

export default function Cliente<WifiProps>() {
    const router = useRouter();
    const { cpf } = useGlobalSearchParams()
    const [macAddress, setMacAddress] = useState('');
    const [dataUserSgp, setDataUserSgp] = useState<UserSgpProps>({});
    const [wifi_ssid, setWifi_ssid] = useState();
    const [wifi_password, setWifi_password] = useState();
    const [wifi_ssid_5, setWifi_ssid_5] = useState();
    const [wifi_password_5, setWifi_password_5] = useState();
    const [iconCopy, setIconCopy] = useState('content-copy')
    const [loading, setLoading] = useState(true)

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
        

            if (macAddress == "") {
                Alert.alert(
                    "Preencha o campo MAC",
                    "Esse campo não pode ser vazio, informe o mac do cliente"
                );
                return
            }
            if (response.success == false) {
                Alert.alert(
                    "Atenção",
                    `${response.message}, verifique se o roteador está ligado`,
                )
                return;
            }

            if (response.status == 404) {
                Alert.alert(
                    "Atenção",
                    `${response.message}, verifique se o roteador está ligado`,
                )
                return
            }

            router.push({
                pathname: "Roteador",
                params: {
                    mac: macAddress,
                    wifi_ssid: wifi_ssid,
                    wifi_password: wifi_password,
                    wifi_ssid_5: wifi_ssid_5,
                    wifi_password_5: wifi_password_5,
                    login: dataUserSgp.login,
                    login_password: dataUserSgp.login_password,
                }

            });

            setLoading(true);
        } catch (error) {
            console.log(error)
        }
    }

    const callGetApi = async () => {
        try {
            const response = await fetch(`${auth.url_sgp}/api/api.php?login=${cpf}`).then((response) => response.json())

            setDataUserSgp(response)
            setWifi_ssid(response.wifi_ssid)
            setWifi_password(response.wifi_password)
            setWifi_ssid_5(response.wifi_ssid_5)
            setWifi_password_5(response.wifi_password_5)
            setLoading(false)

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        callGetApi()
    }, []);


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
                        <Text style={{ ...theme, fontWeight: "600", fontSize: 20 }}>{dataUserSgp.nome}</Text>
                    </View>
                    <Text style={{ ...theme, marginLeft: 28 }}>Usuário PPPoE: {dataUserSgp.login}</Text>
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
                                value={wifi_ssid}
                                onChangeText={setWifi_ssid}
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
                                value={wifi_password}
                                onChangeText={setWifi_password}
                            />
                        </View>
                        <TouchableOpacity
                            style={{ padding: 4, borderRadius: 4 }}
                            onPress={() => copyToClipboard(wifi_password)}
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
                        value={wifi_ssid_5}
                        onChangeText={setWifi_ssid_5}
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
                        value={wifi_password_5}
                        onChangeText={setWifi_password_5}
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
        </KeyboardAvoidingView>
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

