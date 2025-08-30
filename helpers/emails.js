import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const {email, nombre, token} = datos

  //Enviar email
  await transport.sendMail({
    from: 'BaulaRentals.com',
    to: email,
    subject: 'Tu codigo de confirmacion de BaulRentals',
    text: 'Tu codigo de confirmacion de BaulRentals', 
    html: `
        <p>Hola ${nombre}, por favor verifica tu cuenta en BaulaRentals.com</p>
        <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace:<a href="google.com"> Confirmar mi cuenta </a></p>
        <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
    `
  })

}

export {
    emailRegistro
}