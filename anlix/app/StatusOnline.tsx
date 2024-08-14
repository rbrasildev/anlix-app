import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { auth } from '@/constants/Auth';

interface StatusConnectionProps {
    isOnline: boolean;
}

export function StatusOnline({ isOnline }: StatusConnectionProps) {
    const [isOn, setIsOn] = useState(false)
    async function handleStatusConnection() {
        const on = await fetch(`${auth.url_sgp}/api/api.php?online=${isOnline}`).then((response) => response.json())
        setIsOn(on);
    }
    useEffect(() => {
        handleStatusConnection()
    }, [])


    return (
        <MaterialCommunityIcons style={{ color: isOn ? 'green' : '#590202' }} name="wifi" size={20} />
    )
}