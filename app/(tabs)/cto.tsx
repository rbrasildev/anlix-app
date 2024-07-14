import { View, Text, TouchableOpacity, TextInput, useColorScheme, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { API_SGP_URL } from '@env'

export default function App() {

    const [ctoIdent, setCtoIdent] = useState('')
    const router = useRouter();

    const scheme = useColorScheme();

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#000',
    };

    const darkTheme = {
        backgroundColor: '#121212',
        textColor: '#fff',
        color: '#666'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;

    async function navigateToCto() {
        const data = await fetch(`${API_SGP_URL}/api/api.php?cto=${ctoIdent}`).then((response) => response.json())
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
                    onChangeText={setCtoIdent}
                    style={{
                        ...theme,
                        height: 60,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        paddingLeft: 20,
                        fontSize: 20,
                    }} />
                <TouchableOpacity
                    onPress={navigateToCto}
                    style={styles.button}>
                    <Text style={{ fontSize: 20 }}>Buscar</Text>
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
        padding: 10,

    },
    input: {
        backgroundColor: '#87949D',
        borderColor: '#87949D',
        color: '#666',
        borderWidth: 1,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        fontSize: 20,
    },
    button: {
        backgroundColor: '#4CB752',
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#ccc'
    },
});
