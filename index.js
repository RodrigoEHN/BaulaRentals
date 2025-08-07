import express from 'express'
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js'

//App
const app = express()

//
app.use(express.urlencoded({extended:true}))

//Data base connection
try {
    await db.authenticate();
    db.sync()
    console.log('Database connected')
} catch (error) {
    console.log(error)
}

//Routing
app.use('/auth', userRoutes)

//Pug
app.set('view engine', 'pug')
app.set('views', 'views')

//Public Files
app.use( express.static('public'))

// Port Confiouration 
const port = 3000;

app.listen(port, () => {
    console.log('Server running')
}) 

