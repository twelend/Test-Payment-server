require('dotenv').config()
const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

const PORT = process.env.PORT
let ballance = 1500;


function sendMoney({ deposit }) {
    return new Promise((resolve, reject) => {
        if (ballance < deposit) {
            reject({ message: 'Недостаточно средств'})
        }
        ballance -= deposit
        resolve({ message: 'Операция проведена успешно'})
    })
}


app.get('/', (req, res) => {
    res.send({ ballance })
})

app.get('/replenish', (req, res) => {
    sendMoney(req.query) 
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.status(500).send({ message: error })
            console.warn(error)
        })
})

try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

} catch (error) {
    console.warn(`Ошибка запуска сервера: ${error}`)
}