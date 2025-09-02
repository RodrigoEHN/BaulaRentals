import { check, validationResult } from "express-validator"
import bcrypt from 'bcrypt'
import { generarJWT, generarID } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword} from "../helpers/emails.js"
import Usuario from "../models/Usuario.js"

const  formularioLogin = (req, res) => {
    res.render('auth/login' , {
        pagina: 'Iniciar sesión',
        csrfToken: req.csrfToken()
    })
} 

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    let resultado = validationResult(req)

    //Verioficar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login' , {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const {email, password} = req.body

    //Comprobar si usuario existe
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario) {
        return res.render('auth/login' , {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login' , {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }

    //Comprobar la contrasena
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login' , {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña no es correcta'}]
        })
    }

    const token = generarID({id: usuario.id, nombre:usuario.nombre})

    //Almacenar token en un cookie
    return res.cookie('_token', token, {
        httpOnly: true, 
        // secure: true,
        // same-Site: true
    }).redirect('/mis-propiedades')

}

const  formularioRegistro = (req, res) => {
    res.render('auth/registro' , {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    })
} 

const registrar = async(req, res) => {

    //Validator
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min:6 }).withMessage('Tu contraseña debe de tener al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('La contraseña debe concidir').run(req)

    let resultado = validationResult(req)

    //return res.json(resultado.array())

    //Verioficar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/registro' , {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }


    //Estraer datos para no hacer req.body.X
    const {nombre, email, password} = req.body


    //Verificar que el correo no este duplicado
    const existeUsuario = await Usuario.findOne({where: {email}})

    if (existeUsuario) {
        return res.render('auth/registro' , {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado, prueba recuperar tu cuenta'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    console.log(existeUsuario)
    
    // res.json(usuario)

    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarID()
    })

    //Enviar email de confirmacion
    emailRegistro({
        nombre : usuario.nombre,
        email : usuario.email,
        token : usuario.token
    })


    //Mostrar mensaje de confirmacion
    res.render('templates/message', {
    pagina: 'Tu cuenta ha sido creada',
    mensaje: 'Hemos enviado un codigo de confirmacion a tu correo.'
    })

}

//Comprobar una cuenta
const confirmar = async (req, res) => {
    
    const {token} = req.params
    console.log(token)

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }


    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'Tu cuenta se ha conformado correctamente.',
    })

}



const  formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password' , {
        pagina: '¿Olvidaste tu contraseña?',
        csrfToken: req.csrfToken()
    })
} 

const resetPassword = async (req, res) => {
      //Validator
      await check('email').isEmail().withMessage('Eso no parece un email').run(req)

      let resultado = validationResult(req)
  
      //Verioficar que el resultado este vacio
      if(!resultado.isEmpty()){
          //Errores
          return res.render('auth/olvide-password' , {
            pagina: '¿Olvidaste tu contraseña?',
            csrfToken: req.csrfToken(),
            errores : resultado.array()
          })
      }

      //Buscar el usuario
      const {email} = req.body

      const usuario = await Usuario.findOne({where: {email}})

      if(!usuario){
        return res.render('auth/olvide-password' , {
            pagina: '¿Olvidaste tu contraseña?',
            csrfToken: req.csrfToken(),
            errores : [{msg: 'El email no pertenece a ningun usuario'}]
          })
      }

      //Generar un token y enviar el email
      usuario.token = generarID()
      await usuario.save();

      //Enviando email
      emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token

      });

      //Renderizar el mensaje
      res.render('templates/message', {
        pagina: 'Reestablece tu contraseña',
        mensaje: 'Hemos enviado los pasos para recuperar tu contraseña tu correo electronico'
        })

}

const comprobarToken = async (req, res) => {

    const {token} = req.params

    const usuario = await Usuario.findOne({where:{token}})

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al recuperar tu cuenta',
            mensaje: 'Hubo un error tratar de recuperar tu cuenta, intenta de nuevo o pongase en contacto con soporte',
            error: true
        })
    }

    //Mostar formulario para recuperar password
    res.render('auth/reset-password', {
        csrfToken: req.csrfToken(),
        pagina: 'Reestablece tu contraseña'
        
    })

}


const nuevoPassword = async (req, res) => {
    //Validar password
    await check('password').isLength({min:6 }).withMessage('Tu contraseña debe de tener al menos 6 caracteres').run(req)

    let resultado = validationResult(req)
  
    //Verioficar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/reset-password' , {
          pagina: 'Reestablece tu contraseña',
          csrfToken: req.csrfToken(),
          errores : resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where:{token}})

    //Hashear password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null

    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'Tu contraseña ha sido reestablecida correctamente'
    })
}


export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}