import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad } from '../models/index.js'
import csurf from 'csurf'

//Mostrar vista de propiedades
const admin= (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
    })
}

//Mostrar formulario de propiedades
const crear = async (req, res) => {
    //Consultar modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear', {
        pagina: 'Publicar propiedad',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    //Validacion 
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //Consultar modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

        
        return res.render('propiedades/crear', {
            pagina: 'Publicar propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Crear registro

    const { titulo, descripcion, habitaciones, estacionamiento, banios, calle, lat, lng, precio:precioId, categoria:categoriaId } = req.body

    const {id:usuarioId} = req.usuario

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion, 
            habitaciones, 
            estacionamiento, 
            banios, 
            calle, 
            lat, 
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        })

        const {id} = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }

}

export {
    admin,
    crear,
    guardar
}