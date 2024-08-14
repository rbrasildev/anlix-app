import React, { useState } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import { auth } from "@/constants/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Configuration from "@/components/Configuration";


export default function HomeScreen() {
    const [pppoe, setPppoe] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isConfigured, setIsConfigured] = useState(true);

    const router = useRouter()
    const scheme = useColorScheme();

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#000',
        borderColor: '#ccc',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#87949D',
        borderColor: '#333',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const getDataSgp = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${auth.url_sgp}/api/api.php?login=${pppoe}`).then((response) => response.json())
            console.log(response)

            if (pppoe === "") {
                Alert.alert(
                    "Atenção",
                    "Este campo não pode ser vazio verme!",
                );
                setIsLoading(false);
                return;
            }

            if (!response.login) {
                Alert.alert(
                    "Falha ao buscar dados",
                    "Cliente não encontrado!",
                );
                setIsLoading(false);
                return;
            }

            router.push({
                pathname: "Cliente",
                params: { cpf: pppoe }
            });

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Erro", "Ocorreu um erro ao buscar os dados.");
        }
    }

    if (!isConfigured) {
        return <Configuration />
    }

    return (
        <View style={{...theme, flex:1, padding:15, justifyContent:'center'}}>
            <KeyboardAvoidingView behavior="position" enabled>
                <Text style={{ fontSize: 32, color: '#4CB752' }}>Anlix apply</Text>

                <Text style={{...theme, backgroundColor:'transparent', fontSize: 20, color: "#d0d0d0", fontWeight: 'bold' }}>PPPoE</Text>

                <View style={{ flexDirection: 'row', borderWidth: 1, ...theme, borderRadius: 15, marginVertical: 10, alignItems: 'center' }}>
                    <TextInput
                        style={{
                            ...theme,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 20,
                            fontSize: 20,
                            padding: 15,
                            backgroundColor: 'transparent'
                        }}
                        placeholderTextColor="#87949D"
                        placeholder="Digite login pppoe"
                        value={pppoe}
                        onChangeText={setPppoe}
                        autoCapitalize={"none"}
                    />

                    {pppoe && (
                        <TouchableOpacity

                            onPress={() => setPppoe('')}
                            style={{ padding: 4, paddingHorizontal: 10 }}>

                            <MaterialCommunityIcons
                                style={{ padding: 3 }}
                                color={'#666'}
                                size={25}
                                name='close-octagon'
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={getDataSgp}>
                    <Text style={{ fontSize: 20, fontWeight: 'medium' }}>Enviar</Text>
                    <View style={{ marginLeft: 10 }}>
                        {isLoading && <ActivityIndicator size="small" color="#fff" />}
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#131314',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#1E1F20',
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
    button: {
        backgroundColor: '#4CB752',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        flexDirection: 'row',
        gap: 3,
    }
})
