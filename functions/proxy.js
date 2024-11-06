const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const dadosFormulario = JSON.parse(event.body);

    try {
        const response = await fetch('https://hooks.zapier.com/hooks/catch/20646902/251vjp1/', {
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
            body: JSON.stringify({ message: 'Erro ao enviar dados para o Zapier', error })
        };
    }
};
