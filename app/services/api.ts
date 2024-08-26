
const api = async (cpfcnpj: string, senha: string) => {

    var formdata = new FormData();
    formdata.append("cpfcnpj", cpfcnpj);
    formdata.append("senha", senha);

    var requestOptions: {} = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    return fetch("https://sgptins.redeconexaonet.com/api/central/contratos", requestOptions).then((response) => response.json())

}

export default api;
