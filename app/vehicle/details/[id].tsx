import Button from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

interface VehicleProps {
    id: number;
    placa: string;
    modelo: string;
    imagem: string;
    marca: string;
    ano: number;
    quilometragem: string;
    km_ultima_troca: number;
    tipo: string;
    valor: number;
}

interface OilChangeProps {
    id: number;
    data_troca: string;
    quilometragem: number;
    observacoes: string;
}

const formatKM = (km: number): string => {
    return km.toLocaleString('pt-BR') + ' km';
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const InfoCard = ({ title, value }: { title: string; value: string | number }) => (
    <View className='justify-between items-center bg-white dark:bg-zinc-900 rounded-3xl p-4 flex-1 min-h-32 shadow-sm'>
        <Text className='text-zinc-600 dark:text-zinc-400 font-medium'>{title}</Text>
        <Text className='text-black dark:text-white text-xl font-bold mt-2'>
            {typeof value === 'number' ? formatKM(value) : value}
        </Text>
    </View>
);

const OilChangeCard = ({ item }: { item: OilChangeProps }) => (
    <View className='py-2'>
        <View className='p-4 flex-row justify-between items-center rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-b-zinc-500'>
            <Text className='text-zinc-800 dark:text-zinc-100 font-medium'>
                {formatKM(item.quilometragem)}
            </Text>
            <Text className='text-zinc-600 dark:text-zinc-300'>
                {formatDate(item.data_troca)}
            </Text>
            <Text className='text-zinc-600 dark:text-zinc-300'>{item.observacoes}</Text>
            <Text className='text-zinc-600 dark:text-zinc-300'>{item.valor}</Text>
        </View>
    </View>
);

export default function Details() {
    const { id } = useLocalSearchParams();
    const [vehicle, setVehicle] = useState<VehicleProps>({} as VehicleProps);
    const [oilChanges, setOilChanges] = useState<OilChangeProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [novaQuilometragem, setNovaQuilometragem] = useState('');
    const [carregando, setCarregando] = useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const proximaTroca = vehicle.tipo === 'carro' ? vehicle.km_ultima_troca + 5000 : vehicle.km_ultima_troca + 1000;

    const fetchData = async () => {
        try {
            const [vehicleResponse, oilChangeResponse] = await Promise.all([
                fetch(`http://170.245.175.4/api/vehicle/${id}`),
                fetch(`http://170.245.175.4/api/vehicle/${id}/oil-changes`)
            ]);

            if (!vehicleResponse.ok || !oilChangeResponse.ok) {
                throw new Error('Erro ao carregar dados');
            }

            const vehicleData = await vehicleResponse.json();
            const oilChangeData = await oilChangeResponse.json();

            setVehicle(vehicleData);
            setOilChanges(oilChangeData);
        } catch (err) {
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar dados'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateKmVehicle = async () => {
        if (!novaQuilometragem || isNaN(Number(novaQuilometragem))) {
            Alert.alert('Erro', 'Por favor, insira uma quilometragem válida.');
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch(
                `http://170.245.175.4/api/vehicle/${vehicle.id}/km`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quilometragem: parseInt(novaQuilometragem) }),
                }
            );

            if (!response.ok) throw new Error('Erro ao atualizar quilometragem');

            await fetchData();
            Toast.show({
                type: 'success',
                text1: 'Quilometragem atualizada com sucesso!'
            });
            bottomSheetRef.current?.close();
            setNovaQuilometragem('');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar quilometragem'
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <Loading />;

    return (
        <GestureHandlerRootView className="flex-1">
            <View className='flex-1 p-4 bg-gray-50 dark:bg-black'>
                {/* Header Section */}
                <View className='flex-row justify-between items-center mb-4'>
                    <View>
                        <Text className='font-bold text-3xl text-black dark:text-white'>{vehicle.modelo}</Text>
                        <Text className='text-lg text-zinc-600 dark:text-zinc-400'>{vehicle.marca}</Text>
                    </View>
                    <Text className='font-bold text-2xl text-black dark:text-white'>{vehicle.ano}</Text>
                </View>

                {/* Vehicle Image */}
                <Image
                    className="w-full h-56 rounded-3xl mb-4"
                    source={{ uri: vehicle.imagem }}
                    resizeMode="cover"
                />

                {/* License Plate */}
                <Text className='text-center text-2xl font-bold text-black dark:text-white mb-4'>
                    {vehicle.placa}
                </Text>

                {/* Update KM Button */}
                <Button
                    title='Atualizar quilometragem'
                    onPress={() => bottomSheetRef.current?.expand()}
                />

                {/* Info Cards */}
                <View className='flex-row justify-between gap-2 my-2'>
                    <InfoCard title="KM Atual" value={Number(vehicle.quilometragem)} />
                    <InfoCard title="Última Troca" value={vehicle.km_ultima_troca} />
                    <InfoCard title="Próx. Troca" value={proximaTroca} />
                </View>

                {/* Oil Changes History */}
                <View className='flex-1 bg-gray-100 dark:bg-zinc-900 rounded-3xl p-4'>
                    <Text className='text-lg font-bold text-black dark:text-white'>
                        Histórico de Trocas
                    </Text>
                    <FlatList
                        data={oilChanges}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <OilChangeCard item={item} />}
                        ListEmptyComponent={
                            <Text className='text-center text-zinc-500 py-4'>
                                Nenhum registro encontrado
                            </Text>
                        }
                    />
                </View>
            </View>

            {/* Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[0.01, '25%', '35%']}
                backgroundStyle={{ backgroundColor: '#fff' }}
            >
                <BottomSheetView className='p-6'>
                    <Text className='text-xl font-bold text-black mb-4'>
                        Atualizar Quilometragem
                    </Text>
                    <Input
                        style={{ backgroundColor: '#fff' }}
                        placeholder='Digite a quilometragem atual'
                        value={novaQuilometragem}
                        onChangeText={setNovaQuilometragem}
                        keyboardType="numeric"
                    />
                    <Button
                        title={carregando ? 'Atualizando...' : 'Salvar'}
                        disabled={carregando}
                        onPress={handleUpdateKmVehicle}
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}


