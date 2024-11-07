const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    console.log('Início da função handler');

    // Verificação para garantir que o método HTTP é POST
    if (event.httpMethod !== 'POST') {
        console.warn('Método HTTP não permitido:', event.httpMethod);
        return {
            statusCode: 405,
            headers: {
                'Allow': 'POST',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
                'Access-Control-Allow-Methods': 'POST',  // Método permitido
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ message: 'Método não permitido. Use POST.' })
        };
    }

    // Extração dos dados recebidos no corpo da requisição
    let dadosFormulario;
    try {
        console.log('Corpo da requisição recebido:', event.body);
        dadosFormulario = JSON.parse(event.body);
        console.log('Dados extraídos do formulário:', dadosFormulario);
    } catch (error) {
        console.error('Erro ao parsear JSON do corpo da requisição:', error.message);
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
            },
            body: JSON.stringify({ message: 'Erro ao parsear JSON do corpo da requisição', error: error.message })
        };
    }

    try {
        // Envio dos dados para a API externa
        console.log('Enviando dados para a API externa:', dadosFormulario);
        const response = await fetch('https://apiencontrocpc.zapnexus.com/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',  // Garantia de compatibilidade
                'Access-Control-Allow-Origin': '*',  // Header de CORS
                'Access-Control-Allow-Methods': 'POST',  // Método permitido
            },
            body: JSON.stringify(dadosFormulario)
        });

        console.log('Resposta da API recebida:', response.status);

        // Verificação se a resposta da API foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro na resposta da API:', errorData);
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',  // Header de CORS
                },
                body: JSON.stringify({ message: 'Erro ao enviar dados para a API', error: errorData })
            };
        }

        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error.message);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
            },
            body: JSON.stringify({ message: 'Erro ao enviar dados para a API', error: error.message })
        };
    }
};





/*const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const dadosFormulario = JSON.parse(event.body);

    try {
        const response = await fetch('https://apiencontrocpc.zapnexus.com/api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosFormulario)
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao enviar dados para a api', error })
        };
    }
};*/
