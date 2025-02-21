import Button from '@/components/Button';
import Input from '@/components/Input';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    const [loading, setLoading] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleExpandBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
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

    useEffect(() => {
        fetchVehicle();
    }, []);


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
                <TouchableOpacity
                    className='dark:text-zinc-800 py-6 my-2 bg-green-500 rounded-2xl w-full '
                    onPress={handleExpandBottomSheet}
                >
                    <Text className='text-blck dark:text-zinc-800 font-semibold text-center'>Update</Text>
                </TouchableOpacity>

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

                </View>

            </View>

            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={[0.01, '20%', '55%']}
                backgroundStyle={{ backgroundColor: '#fff' }}
                containerStyle={{ padding: 16 }}
            >
                <BottomSheetView className='p-4'>
                    <Text className='dark:text-zinc-500 font-bold text-2xl mb-4'>Atualizar km</Text>

                    <Input style={{ marginTop: 10 }} placeholder='Digite o km atual' value={vehicle.quilometragem} />
                    <TouchableOpacity
                        className='dark:text-zinc-800 py-6 my-2 bg-green-500 rounded-2xl w-full '
                        onPress={handleExpandBottomSheet}
                    >
                        <Text className='text-balck darK:text-white text-center font-semibold'>Salvar</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}


