import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";

import Toast from "react-native-toast-message";
import Input from "@/components/Input";
import getSgpData from "../services/getSgpData";
import * as Animatable from 'react-native-animatable';

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ContratoProps { razaoSocial: string, planointernet: string; servico_login: string, servico_wifi_ssid: string, contratoId: number }

export default function Apply() {
    const [pppoe, setPppoe] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [contratoData, setContratoData] = useState<ContratoProps | any>([])
    const bottomSheetRef = useRef<BottomSheet>(null);
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


    async function handleDataSgp() {
        setIsLoading(true)
        try {

            const response = await getSgpData(pppoe)
            setContratoData(response.contratos);

            if (pppoe === "") {
                Toast.show({
                    type: 'info',
                    text1: 'Este campo não pode ser vazio seu verme!'
                })
                setIsLoading(false);
                return;
            }

            if (response.contratos == false) {
                Toast.show({
                    type: 'error',
                    text1: `Não conseguimos localizar esse cpf ${pppoe}`
                })
                setIsLoading(false);
                return;
            }

            if (response.contratos.length > 1) {
                bottomSheetRef.current?.expand()
            } else {
                router.push({
                    pathname: "/Cliente",
                    params: {
                        clienteId: response.contratos[0].clienteId,
                        contratoId: response.contratos[0].contratoId,
                        razaoSocial: response.contratos[0].razaoSocial,
                        servico_wifi_password: response.contratos[0].servico_wifi_password,
                        servico_wifi_password_5: response.contratos[0].servico_wifi_password_5,
                        servico_wifi_ssid: response.contratos[0].servico_wifi_ssid,
                        servico_wifi_ssid_5: response.contratos[0].servico_wifi_ssid_5,
                        servico_login: response.contratos[0].servico_login,
                        servico_senha: response.contratos[0].servico_senha
                    }
                });

            }

        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: `Error${error}`
            })
        } finally {
            setIsLoading(false);
        }
    }

    function handleContractSelected(id: number) {
        const response = contratoData.filter((item: ContratoProps) => item.contratoId === id)

        router.push({
            pathname: "/Cliente",
            params: {
                clienteId: response[0].clienteId,
                contratoId: response[0].contratoId,
                razaoSocial: response[0].razaoSocial,
                servico_wifi_password: response[0].servico_wifi_password,
                servico_wifi_password_5: response[0].servico_wifi_password_5,
                servico_wifi_ssid: response[0].servico_wifi_ssid,
                servico_wifi_ssid_5: response[0].servico_wifi_ssid_5,
                servico_login: response[0].servico_login,
                servico_senha: response[0].servico_senha
            }
        });
    }

    const contracts = (item: ContratoProps, index: number) => {
        return (
            <Animatable.View duration={300 * index} animation={'slideInUp'}>
                <TouchableOpacity
                    onPress={() => handleContractSelected(item.contratoId)}
                    className="bg-gray-100 p-4 border border-gray-100 gap-2 rounded-md"
                >
                    <View>
                        <Text className="text-slate-900 font-bold text-lg">{item.razaoSocial}</Text>
                        <Text className="text-slate-900 font-light">{item.planointernet}</Text>
                    </View>
                    <View>
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="account" size={16} />
                            <Text className="text-slate-900 font-medium">{item.servico_login}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="wifi" size={16} />
                            <Text className="text-slate-900 font-medium">{item.servico_wifi_ssid}</Text>
                        </View>

                    </View>
                    <View className="border-[0.5px] border-gray-200 my-2 px-10" />
                </TouchableOpacity>
            </Animatable.View>
        )

    }

    return (
        <Animatable.View animation={'slideInLeft'} style={styles.container}>
            <KeyboardAvoidingView behavior="position" enabled>
                <Text className="text-bg-green-500 text-3xl font-medium uppercase">Anlix apply</Text>

                <Text className="font-light text-slate-100 text-2xl">CPF/CNPJ</Text>
                <Input
                    placeholderTextColor="#87949D"
                    placeholder="Digite CPF do cliente"
                    value={pppoe}
                    onChangeText={setPppoe}
                    autoCapitalize={"none"}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.button} onPress={handleDataSgp}>
                    <Text className="font-medium text-slate-200">Enviar</Text>
                    <View style={{ width: 32 }}>
                        {isLoading && <ActivityIndicator size="small" color="#fff" />}
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[0.01, '50%', '100%']}
            >
                <Text className='text-2xl font-light m-4 text-center text-gray-800'>contratos</Text>
                <BottomSheetFlatList className='p-4'
                    data={contratoData}
                    keyExtractor={(item: ContratoProps) => String(item.contratoId)}
                    renderItem={({ item, index }) => contracts(item, index)}
                >
                </BottomSheetFlatList>
            </BottomSheet>
        </Animatable.View>
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
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        flexDirection: 'row',
        gap: 3,
    }
})
