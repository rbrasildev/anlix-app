
import config from "../config"

const getDeviceData = async () => {
    try {
        const auth = await config();
        const response = await fetch(`${auth.url_anlix}/api/v2/device/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password)
            },
            body: JSON.stringify({ "fields": "_id,pppoe_user,model,use_tr069" })
        }).then((response) => response.json())

        return response;
    } catch (error) {
        console.log(error)
    }
}



export default getDeviceData;