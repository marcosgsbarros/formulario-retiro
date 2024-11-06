const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    // Autenticação com OAuth2 ou JWT usando variáveis de ambiente
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') // Substitui as quebras de linha no caso de chaves privadas
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '19Akdef8g-4h50KGkqFJtfGV3Tksrbu60llfpYipv5vI',
      range: 'NOME_DA_PAGINA!A1:D10' // Ajuste o intervalo conforme necessário
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data: response.data.values }),
    };
  } catch (error) {
    console.error('Erro ao acessar a API do Google Sheets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao acessar a API do Google Sheets' }),
    };
  }
};
