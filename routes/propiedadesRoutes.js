import express from 'express'
import { body } from 'express-validator'
import { admin, crear, guardar } from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)

router.post('/propiedades/crear' , protegerRuta,
    
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
                .notEmpty().withMessage('La descripcion no puede ir vacia')
                .isLength({max: 200}).withMessage('La descripcion es muy larga, maximo 200 caracteres'),
    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Seleccione un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Seleccione el numero de habitaciones de la propiedad'),
    body('estacionamiento').isNumeric().withMessage('Seleccione el numero de estacionamientos de la propiedad'),
    body('banios').isNumeric().withMessage('Seleccione el numero de banos de la propiedad'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    
    guardar)

export default router