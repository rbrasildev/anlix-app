import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { API_SGP_URL } from "@env"

interface StatusConnectionProps {
    isOnline: boolean;
}

export function StatusOnline({ isOnline }: StatusConnectionProps) {
    const [isOn, setIsOn] = useState(false)
    async function handleStatusConnection() {
        const on = await fetch(`${API_SGP_URL}/api/api.php?online=${isOnline}`).then((response) => response.json())
        setIsOn(on);
    }
    useEffect(() => {
        handleStatusConnection()
    }, [])


    return (
        <MaterialCommunityIcons style={{ color: isOn ? 'green' : 'red' }} name="wifi" size={20} />
    )
}