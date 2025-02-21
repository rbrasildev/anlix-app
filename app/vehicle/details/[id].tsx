import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text className='text-white'>Details of vehicle {id} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
