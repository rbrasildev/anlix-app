import Input from "@/components/Input";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";

interface VehicleProps {
    id: number;
    placa: string;
    modelo: string;
    imagem: string;
    marca: string;
    quilometragem: number;
    km_ultima_troca: number;
    tipo: string;
}

export default function Vehicle() {
    const [vehicle, setVehicle] = useState<VehicleProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchVehicle = async () => {
        try {
            const response = await fetch('http://170.245.175.4/api/vehicle');
            if (!response.ok) {
                throw new Error('Erro ao carregar os veículos');
            }
            const data = await response.json();
            setVehicle(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicle();
    }, []);

    const filteredVehicles = vehicle.filter((item) =>
        search === '' ? true : item.placa.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size={32} color={'blue'} />
            </View>
        )
    }

    return (
        <View className="p-2">
            <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Digite a placa"
            />
            <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={(<Text>Nenhum registro</Text>)}
                scrollEnabled
                renderItem={({ item }) => (
                    <Link
                        href={{
                            pathname: '/vehicle/details/[id]',
                            params: { id: item.id },
                        }}
                        className="flex gap-2 flex-row justify-between bg-white dark:bg-zinc-900 p-4 space-y-1 mt-2 rounded-3xl m-2 shadow">
                        <View>
                            <Text className="text-black dark:text-white font-bold">{item.marca + " " + item.modelo}</Text>
                            <Text className="dark:text-white text-black">Placa: {item.placa}</Text>
                            <Text className="text-zinc-500 dark:text-white">KM Atual: {item.quilometragem}</Text>
                            <Text className="text-zinc-500 dark:text-white">Última troca: {item.km_ultima_troca}</Text>
                            <Text className="text-zinc-500 dark:text-white">
                                Próxima troca: {item.tipo === "carro" ? item.km_ultima_troca + 5000 : item.km_ultima_troca + 1000}
                            </Text>
                        </View>
                        <Image
                            className="w-48 h-32"
                            source={{ uri: item.imagem }}
                            resizeMode="cover"
                        />
                    </Link>
                )}
            />
        </View>
    );
}