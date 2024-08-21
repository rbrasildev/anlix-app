import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export default function Configuration() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/settings'
                    })
                }}
                style={{
                    backgroundColor: '#4CB752',
                    height: 60,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 30,
                    flexDirection: 'row',
                    gap: 3,
                }}
            >
                <MaterialCommunityIcons
                    name="cog"
                    size={32}
                />
                <Text>Configurar</Text>
            </TouchableOpacity>
        </View>
    )
}