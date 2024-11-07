
import nodemailer from 'nodemailer';

export const handler = async (event) => {
  try {
    // Testa a disponibilidade das variáveis de ambiente
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "*****" : "not defined");

    const { email, nome } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de Inscrição para o Retiro Espiritual 2025',
      html: `
        <p>Olá, ${nome}!</p>
        <p>Estamos felizes em confirmar a sua inscrição para o <strong>Retiro Espiritual 2025</strong>.</p>
        <p>Esperamos que este evento seja uma experiência transformadora para você, repleta de momentos de reflexão, aprendizado e comunhão.</p>
        <p>Se tiver alguma dúvida, entre em contato com a Larissa da organização.</p>
        <br>
        <a href="https://wa.me/+5527999450744?text=Olá%20Larissa,%20gostaria%20de%20sanar%20algumas%20dúvidas%20sobre%20o%20Retiro%20Espiritual" target="_blank">
          Falar com Larissa no WhatsApp
        </a>
        <br>
        <p>Atenciosamente,</p>
        <p>Equipe de Organização do Retiro Espiritual 2025</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email de confirmação enviado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erro ao enviar o email de confirmação: ${error.message}` }),
    };
  }
};

/*import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

export const handler = async (event) => {
  try {
    const { email, nome } = JSON.parse(event.body);

    // Configuração do transportador de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Usuário (e-mail)
        pass: process.env.EMAIL_PASS, // Senha de aplicativo do Gmail
      },
    });

    // Configuração do e-mail a ser enviado
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de Inscrição para o Retiro Espiritual 2025',
      html: `
        <p>Olá, ${nome}!</p>
        <p>Estamos felizes em confirmar a sua inscrição para o <strong>Retiro Espiritual 2025</strong>.</p>
        <p>Esperamos que este evento seja uma experiência transformadora para você, repleta de momentos de reflexão, aprendizado e comunhão.</p>
        <p>Se tiver alguma dúvida, entre em contato com a Larissa da organização.</p>
        <br>
        <a href="https://wa.me/+5527999450744?text=Olá%20Larissa,%20gostaria%20de%20sanar%20algumas%20dúvidas%20sobre%20o%20Retiro%20Espiritual" target="_blank" class="button">
          Falar com Larissa no WhatsApp
        </a>
        <br>
        <p>Atenciosamente,</p>
        <p>Equipe de Organização do Retiro Espiritual 2025</p>
      `,
    };

    // Envio do e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email de confirmação enviado com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao enviar o email de confirmação.' }),
    };
  }
};*/