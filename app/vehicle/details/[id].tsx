import Button from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity, FlatList, Alert } from 'react-native';
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
}

export default function Details() {
    const { id } = useLocalSearchParams();
    const [vehicle, setVehicle] = useState<VehicleProps>({} as VehicleProps);
    const [oilChange, setOilChange] = useState([])
    const [loading, setLoading] = useState(true);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [novaQuilometragem, setNovaQuilometragem] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleUpdateKmVehicle = async () => {
        if (!novaQuilometragem || isNaN(novaQuilometragem)) {
            Alert.alert('Erro', 'Por favor, insira uma quilometragem válida.');
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch(
                `http://170.245.175.4/api/vehicle/${vehicle.id}/km`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quilometragem: parseInt(novaQuilometragem) }),
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao atualizar quilometragem');
            }

            const data = await response.json();
            Alert.alert('Sucesso', 'Quilometragem atualizada com sucesso!');
            console.log('Resposta da API:', data);
        } catch (error) {
            console.error('Erro ao atualizar quilometragem:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a quilometragem.');
        } finally {
            setCarregando(false);
        }
    };

    const handleExpandBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSheetChanges = useCallback((index: number) => {

    }, []);

    const proximaTroca = vehicle.tipo === 'carro' ? vehicle.km_ultima_troca + 5000 : vehicle.km_ultima_troca + 1000;

    const fetchVehicle = async () => {
        try {
            const response = await fetch(`http://170.245.175.4/api/vehicle/${id}`);
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

    const fetchOilChange = async () => {
        try {
            const response = await fetch(`http://170.245.175.4/api/vehicle/${id}/oil-changes`);
            if (!response.ok) {
                throw new Error('Erro ao carregar os veículos');
            }
            const data = await response.json();
            setOilChange(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateKmVehicles = async () => {
        try {

        } catch (error) {

        } finally {
            Toast.show({
                type: 'success',
                text1: 'Quilometragem atualizada com sucesso!'
            })
            bottomSheetRef.current?.close();
        }

    }

    useEffect(() => {
        fetchVehicle();
        fetchOilChange();
    }, [vehicle]);



    if (loading) {
        return <Loading />
    }


    return (
        <GestureHandlerRootView>
            <View className='flex-1 p-4 space-y-4'>
                <View className='flex-row justify-between'>
                    <Text className='font-bold text-2xl text-black dark:text-white'>{vehicle.modelo}</Text>
                    <Text className='font-bold text-2xl text-black dark:text-white'>{vehicle.ano}</Text>

                </View>
                <Image
                    className="max-w-96 h-64"
                    source={{ uri: vehicle.imagem }}
                    resizeMode="cover"
                />

                <Text className='text-black dark:text-white text-2xl'>{vehicle.marca}</Text>
                <Text className='text-black dark:text-white text-2xl'>{vehicle.placa}</Text>

                <Button
                    title='Atualizar km'
                    onPress={handleExpandBottomSheet}
                />

                <View className='flex-row justify-between gap-2 mt-4 '>
                    <View className='justify-between items-center bg-white dark:bg-[#11181C] rounded-3xl p-4 w-32 h-32'>
                        <Text className='text-black dark:text-white'>Km Atual</Text>
                        <Text className='text-black dark:text-white text-xl'>{vehicle.quilometragem}KM</Text>
                    </View>
                    <View className='justify-between items-center bg-white dark:bg-[#11181C] rounded-3xl p-4 w-32 h-32'>
                        <Text className='text-black dark:text-white'>Última Troca</Text>
                        <Text className='text-black dark:text-white text-xl'>{vehicle.km_ultima_troca} KM</Text>
                    </View>
                    <View className='justify-between items-center bg-white dark:bg-[#11181C] rounded-3xl p-4 w-32 h-32 flex-1'>
                        <Text className='text-black dark:text-white'>Próx. Troca</Text>
                        <Text className='text-black dark:text-white text-xl'>{proximaTroca}KM</Text>
                    </View>
                </View>

                <View className='bg-white dark:bg-[#11181C] w-full h-64 mt-4 rounded-3xl'>
                    <FlatList
                        data={oilChange}
                        keyExtractor={(item: VehicleProps) => item.id.toString()}
                        ListEmptyComponent={(<Text>Nenhum registro</Text>)}
                        scrollEnabled
                        renderItem={({ item }) => (
                            <View className='p-6'>
                                <View className='p-4 flex-row justify-between rounded-2xl border border-zinc-200 dark:border-zinc-500'>
                                    <Text className='dark:text-zinc-100'>{item.data_troca}</Text>
                                    <Text className='dark:text-zinc-100'>{item.quilometragem}</Text>
                                    <Text className='dark:text-zinc-100'>{item.observacoes}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

            </View>

            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={[0.01, '20%', '30%']}
                backgroundStyle={{ backgroundColor: '#fff' }}
                containerStyle={{ padding: 16 }}
            >
                <BottomSheetView className='p-6'>
                    <Text className='dark:text-zinc-500 font-bold text-2xl mb-4'>Atualizar km</Text>
                    <Text>KM</Text>
                    <Input style={{ marginTop: 10, backgroundColor: '#eee' }}
                        placeholder='Digite o km atual'
                        value={novaQuilometragem}
                        onChangeText={setNovaQuilometragem}
                    />
                    <Button
                        title='Salvar'
                        disabled={carregando}
                        onPress={handleUpdateKmVehicle}
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}


