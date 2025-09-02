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
        <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar mi cuenta </a></p>
        <p>Si tu no creaste esta cuenta puedes ignorar este mensaje 😁</p>
    `
  })

}


const emailOlvidePassword = async (datos) => {

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
  subject: 'Reestablece tu cuenta en BaulRentals',
  text: 'Reestablece tu cuenta en BaulRentals', 
  html: `
      <p>Hola ${nombre}, has solicitado recuperar tu cuenta.</p>
      <p>Para recuperar tu contraseña, haz click en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}"> Recuperar cuenta </a></p>
      <p>Si tu no solicitaste esto, puedes ignorar este mensaje 😁</p>
  `
})

}

export {
    emailRegistro,
    emailOlvidePassword
}