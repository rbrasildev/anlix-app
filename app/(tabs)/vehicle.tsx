import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";

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
    const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://170.245.175.4/api/vehicle');
            if (!response.ok) throw new Error('Erro ao carregar os veículos');
            const data = await response.json();
            setVehicles(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter((vehicle) =>
        search === '' ? true : vehicle.placa.toLowerCase().includes(search.toLowerCase())
    );

    const calculateNextChange = (vehicle: VehicleProps) => {
        const threshold = vehicle.tipo === "carro" ? 5000 : 1000;
        return vehicle.km_ultima_troca + threshold;
    };

    const calculateRemaining = (vehicle: VehicleProps) => {
        const nextChange = calculateNextChange(vehicle);
        return nextChange - vehicle.quilometragem;
    };

    const isMaintenanceNeeded = (vehicle: VehicleProps) => {
        return vehicle.quilometragem >= calculateNextChange(vehicle);
    };

    const VehicleCard = ({ item }: { item: VehicleProps }) => (
        <Link
            href={{
                pathname: '/vehicle/details/[id]',
                params: { id: item.id },
            }}
            className={`${isMaintenanceNeeded(item)
                    ? "bg-red-500/90"
                    : "bg-white dark:bg-zinc-900"
                } p-6 rounded-3xl shadow-lg mt-4`}
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                    <Text className="text-xl font-bold mb-2 text-black dark:text-white">
                        {item.marca} {item.modelo}
                    </Text>
                    <Text className="text-base mb-1 dark:text-white text-black">
                        Placa: {item.placa}
                    </Text>

                    <View className="mt-4 space-y-1">
                        <InfoRow
                            label="KM Atual"
                            value={`${item.quilometragem}`}
                        />
                        <InfoRow
                            label="Última troca"
                            value={`${item.km_ultima_troca}`}
                        />
                        <InfoRow
                            label="Próxima troca"
                            value={`${calculateNextChange(item)}`}
                        />
                        <InfoRow
                            label="Restante"
                            value={`${calculateRemaining(item)}`}
                            highlight={isMaintenanceNeeded(item)}
                        />
                    </View>
                </View>

                <Image
                    className="w-40 h-32 rounded-2xl"
                    source={{ uri: item.imagem }}
                    resizeMode="cover"
                />
            </View>
        </Link>
    );

    if (loading) return <Loading />;

    return (
        <View className="flex-1 bg-gray-50 dark:bg-black">
            <View className="px-4 pt-4">
                <Input
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar por placa..."
                />
            </View>

            <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-10">
                        <Text className="text-gray-500 text-lg">
                            Nenhum veículo encontrado
                        </Text>
                    </View>
                }
                renderItem={({ item }) => <VehicleCard item={item} />}
            />
        </View>
    );
}

const InfoRow = ({
    label,
    value,
    highlight = false
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <View className="flex-row justify-between">
        <Text className={`${highlight
                ? "text-white font-bold"
                : "text-zinc-700 dark:text-zinc-400"
            }`}>
            {label}:
        </Text>
        <Text className={`${highlight
                ? "text-white font-bold"
                : "text-zinc-700 dark:text-zinc-400"
            }`}>
            {value}
        </Text>
    </View>
);