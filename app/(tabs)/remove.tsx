import axios from "axios";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native";
import { useColorScheme } from "react-native";
import { Text, View, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Clipboard, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";
import { auth } from "@/constants/Auth";
import getDeviceData from "../services/getDeviceData";

interface roteadorProps {
    _id: string;
}

export default function Remove() {
    const [dataMac, setDataMac] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mac, setMac] = useState('');

    const scheme = useColorScheme();
    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#333',
        color: '#141414',
        borderColor: '#ccc',
    };

    const darkTheme = {
        backgroundColor: '#121212',
        textColor: '#fff',
        color: '#ccc',
        borderColor: '#333',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const callPostApi = async () => {
        setIsLoading(true)
        try {
            const response = await getDeviceData()
            setDataMac(response)
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        }

    }


    const callDeleteRouter = async () => {
        setIsLoading(true)
        const auth = await config();
        const api = await axios({
            method: "DELETE",
            url: `${auth.url_anlix}/api/v2/device/delete/${mac}`,
            auth: {
                username: auth.username,
                password: auth.password
            },

        }).catch(error => {
            Toast.show({
                type: "error",
                text1: `Error ${error.response.status} - ${error.response.data.message}`
            })
            setIsLoading(false)
            return;
        })
        Toast.show({
            type: "success",
            text1: api.data.message,
        })

        setIsLoading(false);
        setMac('')
        callPostApi()

    }


    function confirm() {
        Alert.alert('Deletar', 'Tem certeza que desejar remover o roteador do sistema?', [
            {
                text: 'Sim',
                onPress: () => callDeleteRouter(),
            },
            {
                text: 'Não',
            }
        ])
    }

    const formatMAC = (input) => {
        const formatted = input.replace(/(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})/g, "$1:$2:$3:$4:$5:$6").toUpperCase();
        setMac(formatted);
    }
    const handleInputChange = (text) => {
        if (text.length === 12) {
            formatMAC(text);
        } else {
            setMac(text);
        }
    };

    const resetdefaults = dataMac.filter(item => item._id == mac)

    useEffect(() => {
        callPostApi();
    }, []);

    return (
        <View style={{ ...theme, backgroundColor: 'transparent', flex: 1, justifyContent: 'center' }}>
            <TextInput
                style={{ ...theme, padding: 15, fontSize: 18, marginHorizontal: 15, borderWidth: 1, borderRadius: 15, marginTop: 10, }}
                value={mac}
                placeholderTextColor={'#87949D'}
                onChangeText={handleInputChange}
                placeholder='Digite o MAC'
                keyboardType="ascii-capable"
            >
            </TextInput>

            {isLoading && <ActivityIndicator style={{ marginTop: '80%' }} size="large" color="#666" />}
            {resetdefaults == false && isLoading == false && mac != "" ? <Text style={{ color: "#fff", marginTop: '60%', textAlign: 'center' }}>Nenhum registro</Text> :
                <FlatList
                    data={resetdefaults}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity
                            onLongPress={() => confirm()}
                            style={{
                                ...theme,
                                marginTop: 15,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: "row",
                                padding: 5,
                                marginHorizontal: 15,
                                borderRadius: 15,
                            }}>
                            <View style={{
                                ...theme,
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>

                                <MaterialCommunityIcons
                                    name="router-wireless"
                                    size={24}
                                    color='#4CB752'
                                />
                                <Text style={{ ...theme, fontSize: 10, }}>{item.model}</Text>
                                <Text style={{ ...theme, fontSize: 8 }}>{item.use_tr069 ? 'tr069' : 'firmware'}</Text>
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
                                    marginLeft: 10
                                }}
                                onPress={() => confirm()}
                            >
                                <View style={{ ...theme, padding: 6, borderRadius: 4, }}>
                                    <MaterialCommunityIcons
                                        style={{ ...theme }}
                                        name="trash-can"
                                        size={24}
                                    />
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }
                />
            }

        </View>
    );
}

