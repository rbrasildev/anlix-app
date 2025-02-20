import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const InputMask = ({ theme }) => {
    const [ctoIdent, setCtoIdent] = useState('');
    const [mask, setMask] = useState('AA-AA-9999'); // Máscara inicial

    const handleChangeText = (text) => {
        // Remove todos os hífens para contar os caracteres corretamente
        const rawText = text.replace(/-/g, '');

        // Decide qual máscara usar com base no comprimento do texto
        if (rawText.length <= 4) {
            setMask('AA-AA-9999');
        } else {
            setMask('AAA-AA-9999');
        }

        // Atualiza o valor do input
        setCtoIdent(text);
    };

    const handleBlur = () => {
        // Aplica a máscara correta quando o input perde o foco
        const rawText = ctoIdent.replace(/-/g, '');
        if (rawText.length <= 4) {
            setCtoIdent(rawText.replace(/(\w{2})(\w{2})/, '$1-$2-')); // AA-AA
        } else {
            setCtoIdent(rawText.replace(/(\w{3})(\w{2})/, '$1-$2-')); // AAA-AA
        }
    };

    return (
        <TextInputMask
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
                elevation: 1,
                padding: 18,
                marginBottom: 10,
                fontSize: 18,
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 10,
            }}
            placeholder="EX: XX-XX-0000 ou XXX-XX-0000"
            placeholderTextColor="#666"
            value={ctoIdent}
            autoCapitalize="characters"
            onChangeText={handleChangeText}
            onBlur={handleBlur} // Aplica a máscara correta ao perder o foco
            type={'custom'}
            options={{
                mask: mask // Usa a máscara dinâmica
            }}
        />
    );
};

export default InputMask;