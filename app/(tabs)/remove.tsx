import axios from "axios";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native";

import { Text, View, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Clipboard, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";
import { auth } from "@/constants/Auth";
import getDeviceData from "../services/getDeviceData";
import Input from "@/components/Input";

interface roteadorProps {
    _id: string;
}

export default function Remove() {
    const [dataMac, setDataMac] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mac, setMac] = useState('');

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
        <View className="p-4">
            <Input
                value={mac}
                placeholderTextColor={'#87949D'}
                onChangeText={handleInputChange}
                placeholder='Digite o MAC'
                keyboardType="ascii-capable"
            />

            {isLoading && <ActivityIndicator className="mt-[80%]" size="large" color="#666" />}

            {resetdefaults == false && isLoading == false && mac != "" ? (
                <Text className="text-white mt-[60%] text-center">Nenhum registro</Text>
            ) : (
                <FlatList
                    data={resetdefaults}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onLongPress={() => confirm()}
                            className="mt-4 items-center justify-around flex-row p-1.5 rounded-2xl bg-white dark:bg-[#121212]"
                        >
                            <View className="w-[60px] h-[60px] rounded-full items-center justify-center bg-white dark:bg-[#121212]">
                                <MaterialCommunityIcons
                                    name="router-wireless"
                                    size={24}
                                    color='#4CB752'
                                />
                                <Text className="text-[10px] text-[#333] dark:text-[#ccc]">{item.model}</Text>
                                <Text className="text-[8px] text-[#333] dark:text-[#ccc]">
                                    {item.use_tr069 ? 'tr069' : 'firmware'}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xl text-[#333] dark:text-[#ccc]">{item._id}</Text>
                            </View>

                            <TouchableOpacity
                                className="p-1 rounded justify-center items-center ml-2.5"
                                onPress={() => confirm()}
                            >

                                <MaterialCommunityIcons
                                    className="text-[#333] dark:text-red-500]"
                                    name="trash-can"
                                    color="#ef4444"
                                    size={24}
                                />

                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

