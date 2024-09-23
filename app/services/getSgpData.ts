import config from "../config";

const getSgpData = async (pppoe: string) => {
    try {
        const auth = await config();

        var formdata = new FormData();
        formdata.append("app", auth.app);
        formdata.append("token", auth.token);
        formdata.append("cpfcnpj", pppoe);

        var requestOptions: {} = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const response = await fetch(`${auth.url_sgp}/api/ura/consultacliente/`, requestOptions).then(response => response.json());
        return response;
    } catch (error) {
        console.log(error)
    }
}

export default getSgpData;