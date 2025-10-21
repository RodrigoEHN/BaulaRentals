import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Rodrigo',
        email: 'rodrigo@dev.com',
        confirmado: 1, 
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios