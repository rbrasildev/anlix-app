import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Text, useColorScheme, View } from "react-native";
import * as Animatable from 'react-native-animatable'
interface IncidentesProps {
    id: number;
    name: string;
    message: string;
    created_at: Date;
    status: number;
    updates: {
        message: string;
    }

}

export default function Incidents() {
    const [dataIncidents, setDataIncidents] = useState<IncidentesProps[]>([])

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        color: '#141414',
        backgroundColor: '#fff',
        borderColor: '#ddd'
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

                })
            })
        } catch (error) {
            console.log(error)
        }

    }

    const handleFetchIncidents = async () => {
        try {
            const response = await fetch('https://status.redeconexaonet.com/api/v1/incidents').then((response) => response.json());
            setDataIncidents(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        handleFetchIncidents()
    }, [])

    return (
        <View className="flex-1 p-4">
            <FlatList
                contentContainerStyle={{ gap: 4, borderLeftWidth: 1, paddingLeft: 10, borderLeftColor: '#333', backgroundColor: 'none' }}
                data={dataIncidents}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) =>
                    <Animatable.View animation={'slideInDown'} duration={index * 300} style={{ ...theme, borderWidth: 1, padding: 10, borderRadius: 15 }}>
                        <View style={{ flexDirection: 'row', gap: 3 }}>
                            {/* {item.status == 4 ? <MaterialCommunityIcons name="check-circle" size={18} color={'green'} /> : <MaterialCommunityIcons name="information" size={18} color={'red'} />} */}
                            <Text className="font-semibold text-gray-400 mb-2">{item.name}</Text>
                        </View>
                        <Text className="text-gray-500 font-light">{item.message}</Text>
                        <Text className="text-gray-500 font-light">{item.updates.message}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                            <MaterialCommunityIcons size={14} name="calendar" color={theme.color} />
                            <Text style={{ ...theme }}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text>
                        </View>
                        <Text style={{ position: 'absolute', top: -12, left: -15, }}>
                            {item.status == 4 ? <MaterialCommunityIcons name="check-circle" size={18} color={'green'} /> : <MaterialCommunityIcons name="information" size={18} color={'red'} />}
                        </Text>
                    </Animatable.View>
                }
            />
        </View>
    )
}