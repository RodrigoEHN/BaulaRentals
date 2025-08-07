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
    
    const usuario = await Usuario.create(req.body)
    res.json(usuario)
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