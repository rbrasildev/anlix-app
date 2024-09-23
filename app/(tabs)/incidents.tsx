import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Text, useColorScheme, View } from "react-native";

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
        <View style={{ flex: 1, margin: 20, position: 'relative', zIndex: -1, backgroundColor: 'transparent' }}>
            <FlatList
                contentContainerStyle={{ gap: 4, borderLeftWidth: 1, paddingLeft: 10, borderLeftColor: '#ccc', backgroundColor: 'transparent' }}
                data={dataIncidents}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) =>
                    <View style={{ ...theme, borderWidth: 1, padding: 10, borderRadius: 15 }}>
                        <View style={{ flexDirection: 'row', gap: 3 }}>
                            {/* {item.status == 4 ? <MaterialCommunityIcons name="check-circle" size={18} color={'green'} /> : <MaterialCommunityIcons name="information" size={18} color={'red'} />} */}
                            <Text style={{ ...theme, fontWeight: 'bold' }}>{item.name}</Text>
                        </View>
                        <Text style={{ ...theme, marginTop: 5, marginLeft: 3 }}>{item.message}</Text>
                        <Text style={{ ...theme, marginTop: 5, marginLeft: 3 }}>{item.updates.message}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                            <MaterialCommunityIcons size={14} name="calendar" color={theme.color} />
                            <Text style={{ ...theme }}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text>
                        </View>
                        <View style={{ position: 'absolute', top: 10, left: -23, zIndex: 999 }}>
                            {item.status == 4 ? <MaterialCommunityIcons name="check-circle" size={18} color={'green'} /> : <MaterialCommunityIcons name="information" size={18} color={'red'} />}
                        </View>
                    </View>
                }
            />
        </View>
    )
}