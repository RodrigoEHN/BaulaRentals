//Mostrar vista de propiedades
const admin= (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
    })
}

//Mostrar formulario de propiedades
const crear = (req, res) => {
    res.render('propiedades/crear', {
        pagina: 'Publicar propiedad',
        barra: true
    })
}

export {
    admin,
    crear
}