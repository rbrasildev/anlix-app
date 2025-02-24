import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import config from './config';


interface StatusConnectionProps {
    isOnline: boolean;
}

export default function StatusOnline({ isOnline }: StatusConnectionProps) {
    const [isOn, setIsOn] = useState(false)
    async function handleStatusConnection() {
        const auth = await config();
        const on = await fetch(`https://sgpos.redeconexaonet.com/api/api.php?online=${isOnline}`).then((response) => response.json())
        setIsOn(on);
    }
    useEffect(() => {
        handleStatusConnection()
    }, [])


    return (
        <MaterialCommunityIcons style={{ color: isOn ? 'green' : 'red' }} name="wifi" size={20} />
    )
}