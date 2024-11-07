const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Verificação para garantir que o método HTTP é POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Allow': 'POST',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
                'Access-Control-Allow-Methods': 'POST'  // Método permitido
            },
            body: JSON.stringify({ message: 'Método não permitido. Use POST.' })
        };
    }

    // Extração dos dados recebidos no corpo da requisição
    let dadosFormulario;
    try {
        dadosFormulario = JSON.parse(event.body);
    } catch (error) {
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

        // Verificação se a resposta da API foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.text();
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
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Header de CORS
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
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
