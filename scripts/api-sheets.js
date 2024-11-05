// api-sheets.js
async function enviarDadosParaSheets(dados) {
    try {
        const response = await fetch('https://YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            console.log('Dados enviados com sucesso para o Google Sheets.');
        } else {
            console.error('Erro ao enviar dados para o Google Sheets.', response.statusText);
        }
    } catch (error) {
        console.error('Erro na comunicação com a API:', error);
    }
}

// Exporta a função para ser utilizada em outro arquivo
export { enviarDadosParaSheets };
