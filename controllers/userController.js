import { check, validationResult } from "express-validator"
import { generarID } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"
import Usuario from "../models/Usuario.js"

const  formularioLogin = (req, res) => {
    res.render('auth/login' , {
        pagina: 'Iniciar sesión'
    })
} 

const  formularioRegistro = (req, res) => {
    res.render('auth/registro' , {
        pagina: 'Crear cuenta'
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
            errores: [{msg: 'El usuario ya esta registrado, prueba recuperar tu cuenta'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    console.log(existeUsuario)
    
    // const usuario = await Usuario.create(req.body)
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



const  formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password' , {
        pagina: '¿Olvidaste tu contraseña?'
    })
} 


export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}