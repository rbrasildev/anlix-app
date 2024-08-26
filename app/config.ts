import { useAsyncStorage } from "@react-native-async-storage/async-storage"

interface AuthProps {
    url_sgp: string;
    app: string;
    token: string;
    url_anlix: string;
    username: string;
    password: string;
}
export default async function config<AuthProps>() {
    const { getItem } = useAsyncStorage('@anlix:auth');
    const response = await getItem();
    const data = response ? JSON.parse(response) : null;
    return data;
}