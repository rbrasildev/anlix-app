import Button from "@/components/Button";
import Input from "@/components/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";

export default function NewIncidents() {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const scheme = useColorScheme();


    const lightTheme = {
        textColor: '#333',
        color: '#141414',
        backgroundColor: '#fff',
        borderColor: '#ccc'
    };

    const darkTheme = {
        textColor: '#ccc',
        color: '#ccc',
        borderColor: '#222',
        backgroundColor: '#141414'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;

    const handleCreateIncidents = async () => {
        try {
            const response = await fetch('https://status.redeconexaonet.com/api/v1/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('rbrasildev' + ':' + 'Dr12wex1@'),
                    "X-Cachet-Token": "gAb2vv9cZKZeQjxkbVqF"
                },
                body: JSON.stringify({
                    name,
                    status: 2,
                    message
                })
            })
            Toast.show({
                type: 'success',
                text1: 'Incidente cadastrado com sucesso!'
            })
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <View style={{ padding: 15 }}>
            <View style={{ ...theme, borderWidth: 1, marginVertical: 10, padding: 15, borderRadius: 15 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
                    <MaterialCommunityIcons color={theme.color} size={20} name="alert" />
                    <Text style={{ color: theme.textColor, fontSize: 20 }}>Criar incidentes</Text>
                </View>
                <Text style={{ color: theme.textColor }}>Descreva o incidente, especifica endereço e ocorrido!</Text>
            </View>
            <Input
                onChangeText={setName}
                value={name}
                placeholder="Nome"
            />
            <Input
                style={{
                    ...theme,
                    height: 150,
                    justifyContent: 'flex-start',
                    textAlignVertical: 'top',
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 15,
                }}
                onChangeText={setMessage}
                value={message}
                placeholder="Mensagem"
                multiline={true}
                numberOfLines={6}
            />
            <Button onPress={handleCreateIncidents}><Text style={{ fontWeight: '500', color: "#fff" }}>Criar incidents</Text></Button>
        </View>
    )
}