import { Alert, Linking, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useState } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';



interface DashProps {
  phoneNumber?: string;
}


const HomeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState();
  const scheme = useColorScheme();

  const openWhatsApp = (phoneNumber: DashProps) => {
    let url = `whatsapp://send?phone=55${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          alert('Por favor, instale o WhatsApp para enviar uma mensagem');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };


  const lightTheme = {
    backgroundColor: '#fff',
    textColor: '#000',
    borderColor: '#ccc'
  };

  const darkTheme = {
    backgroundColor: '#121212',
    textColor: '#fff',
    color: '#ccc',
    borderColor: '#333'
  };

  const theme = scheme === 'light' ? lightTheme : darkTheme;
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 15 }}>
      <KeyboardAvoidingView behavior='position'>
        {/* <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 155, height: 60, marginBottom: 10 }}
        /> */}
        <View style={{ ...theme }}>
          <TextInput
            style={{
              ...theme,
              borderWidth: 1, padding: 15, borderRadius: 8, fontSize: 20
            }}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder='Digite o telefone'
            placeholderTextColor="#ccc"

          />
          <TouchableOpacity
            style={{
              ...theme,
              backgroundColor: '#4CB752',
              padding: 15,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 3,
              marginTop: 5,
            }}
            onPress={() => openWhatsApp(phoneNumber)}>
            <MaterialCommunityIcons name='whatsapp' color="#fff" size={22} />
            <Text style={{ fontSize: 18 }}>Abrir no whatsapp</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView >
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
