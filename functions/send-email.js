import nodemailer from 'nodemailer';

export const handler = async (event) => {
  try {

    const { email, nome } = JSON.parse(event.body);

    // Configuração do transportador de e-mail usando variáveis de ambiente
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
        <p>Falar com Larissa no WhatsApp</p> <a href="https://bit.ly/retiro-espiritual2025"></a>
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
};
