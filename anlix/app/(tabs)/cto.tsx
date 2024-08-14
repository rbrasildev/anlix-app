import { View, Text, TouchableOpacity, TextInput, useColorScheme, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/constants/Auth";

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
        const data = await fetch(`${auth.url_sgp}/api/api.php?cto=${ctoIdent}`).then((response) => response.json())
        if (ctoIdent == '') {
            Alert.alert(
                "Atenção",
                "Este campo não pode ser vazio verme!",
            )
            return
        }
        if (data.status == 404) {
            Alert.alert('Error 404', data.message);
            return
        } else {
            router.push({
                pathname: 'CtoInfo',
                params: {
                    ctoIdent: ctoIdent,
                },
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <MaterialCommunityIcons
                        name="package"
                        color="#666"
                        size={30}
                    />
                    <Text style={{ color: "#666" }}>Digite número da CTO</Text>
                </View>
                <TextInput
                    placeholder="EX: XX-XX-0000"
                    placeholderTextColor="#666"
                    value={ctoIdent}
                    autoCapitalize="characters"
                    onChangeText={setCtoIdent}
                    style={{
                        ...theme,
                        height: 60,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        paddingLeft: 20,
                        fontSize: 20,
                        borderWidth: 1,
                    }} />
                <TouchableOpacity
                    onPress={navigateToCto}
                    style={styles.button}>
                    <Text style={{ fontSize: 20, fontWeight: '400' }}>Buscar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#131314',
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
