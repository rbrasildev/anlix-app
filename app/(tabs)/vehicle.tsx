import { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";

interface Vehicle {
    id: number;
    placa: string;
    model: string;
    imagem: string;
}

export default function Vehicle() {
    const [vehicle, setVehicle] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchVehicle = async () => {
        try {
            const response = await fetch('http://170.245.175.4/api/vehicle'); // Substitua pela URL da sua API
            if (!response.ok) {
                throw new Error('Erro ao carregar os usuários');
            }
            const data = await response.json();
            console.log(data);
            // Converte a resposta para JSON
            setVehicle(data); // Atualiza o estado com os dados recebidos
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicle();
    }, [])
    return (
        <View>
            <FlatList
                data={vehicle}
                keyExtractor={((item) => item.id.toString())}
                renderItem={({ item }) => (
                    <View className="bg-gray-800 p-4 my-1 rounded-md m-2">
                        <Text className="text-white">{item.placa}</Text>
                        <Image
                            className="w-48 h-32"
                            source={{ uri: item.imagem }}
                            resizeMode="cover"
                        />
                    </View>
                )}
            />
        </View>
    )
}