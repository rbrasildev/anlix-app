import { View, Text, TouchableOpacity, TextInput, useColorScheme, StyleSheet } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";

import { useRouter } from "expo-router";
import * as Animatable from 'react-native-animatable';
import Toast from "react-native-toast-message";
import config from "../config";
import Input from "@/components/Input";


export default function App() {

    const [ctoIdent, setCtoIdent] = useState('')
    const router = useRouter();

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

    async function navigateToCto() {
        try {
            const auth = await config();

            const data = await fetch(`https://sgpos.redeconexaonet.com/api/api.php?cto=${ctoIdent}`).then((response) => response.json())
            if (ctoIdent == '') {
                Toast.show({
                    type: 'info',
                    text1: 'Este campo não pode ser vazio seu verme!'
                })
                return
            }
            if (data.status == 404) {
                Toast.show({
                    type: 'error',
                    text1: data.message
                });
                return
            } else {
                router.push({
                    pathname: '/CtoInfo',
                    params: {
                        ctoIdent: ctoIdent,
                    },
                })
            }
        } catch (erro) {
            Toast.show({
                type: 'error',
                text1: 'Erro inesperado'
            })
        }

    }

    return (
        <Animatable.View animation={'slideInLeft'} style={styles.container}>
            <View style={{ width: '100%' }}>
                <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons
                        name="package"
                        color="#666"
                        size={30}
                    />
                    <Text className="font-semibold text-gray-500 text-xl uppercase my-4">IDENTIFICAÇÃO DA CTO</Text>
                </View>
                <Input
                    placeholder="EX: XX-XX-0000"
                    placeholderTextColor="#666"
                    value={ctoIdent}
                    autoCapitalize="characters"
                    onChangeText={setCtoIdent}
                />
                
                <TouchableOpacity
                    onPress={navigateToCto}
                    style={styles.button}>
                    <Text className="font-semibold text-gray-100 text-xl">Buscar</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,

    },
    button: {
        backgroundColor: '#4CB752',
        height: 60,
        fontWeight: '500',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ccc'
    },
});
