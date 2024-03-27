const express = require('express')
const fs = require('fs')
const PDFDocument = require('pdfkit');
const {leerArchivo, escribirArchivo} = require('./src/files')

const app = express()

app.use(express.json())

//RUTAS
app.get('/', (req, res) => {
    res.send('Welcome to the Marvel Universe')
})

//RUTA INDEX
// app.get('/marvel', (req, res) => {
//     res.send('Hello Mr. Stark')
// })

// //RUTA POSTMAN INDEX
// app.get('/marvel', (req,res) => {
//     const personajes = leerArchivo('./db.json')
//     res.send(personajes)
// })

// //RUTA SHOW
// app.get('/marvel/:id', (req, res) => {
//     res.send('Hello Capitan America ' + req.params.id)
// })

// //RUTA POSTMAN SHOW
// app.get('/marvel/:id', (req, res) => {
//     const id = req.params.id
//     const personajes = leerArchivo('./db.json')
//     const marv = personajes.find(marv => marv.id === parseInt(id))

//     //No existe 
//     if( !marv )//( todo == undefined)
//     {
//         res.status(404).send('No existe el superheroe')
//         return
//     }
       //Existe
//     res.send(marv)
//     console.log('Superhereo encontrado')
// })

// //RUTA STORE
// app.post('/marvel', (req, res) => {
//     console.log(req.body)
//     res.send('Hello Natasha Romanoff')
// })

// //RUTA POSTMAN STORE
// app.post('/marvel', (req, res) => {
//     const marv = req.body
//     const personajes = leerArchivo('./db.json')
//     marv.id = personajes.length + 1
//     personajes.push(marv)

//     escribirArchivo('./db.json', personajes)
//     res.status(201).send(marv)
// })

// //RUTA PARA CREAR EL PDF
app.post('/marvel', async (req, res) => {
    const marv = req.body;
    const personajes = leerArchivo('./db.json');
    marv.id = personajes.length + 1;
    personajes.push(marv);

    escribirArchivo('./db.json', personajes);

    try {
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(`./pdfs/${marv.id}.pdf`)); 

        pdfDoc.fontSize(20).text('INFORMACIÓN DEL NUEVO SUPERHEROE:', { align: 'center' });
        pdfDoc.moveDown();
        pdfDoc.fontSize(14).text(`Nombre: ${marv.nombre}`);
        pdfDoc.moveDown(); 
        pdfDoc.fontSize(14).text(`Poder: ${marv.poderes}`);
        pdfDoc.moveDown(); 
        pdfDoc.fontSize(14).text(`Está vivo: ${marv.vivo}`);
        pdfDoc.moveDown(); 
        pdfDoc.fontSize(14).text(`Nivel de Peligrosidad: ${marv.nivelPeligrosidad}`);
        pdfDoc.moveDown();
        pdfDoc.moveDown();
        pdfDoc.moveDown();
        pdfDoc.fontSize(10).text('Copyright © 2024, Valentina Velez Castrillon', { align: 'center' });

        pdfDoc.end();

        res.status(201).send(marv);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
});

//RUTA UPDATE
// app.put('/marvel/:id', (req, res) => {
//     res.send('Hello Peter Parker')
// })

// //RUTA POSTMAN UPDATE
// app.put('/marvel/:id', (req, res) => {
//     const id = req.params.id;
//     const newData = req.body;
//     const personajes = leerArchivo('./db.json');
//     const index = personajes.findIndex(marv => marv.id === parseInt(id));

//     if (index === -1) {
//         res.status(404).send('No existe el superhéroe con el ID proporcionado');
//         return;
//     }
//     personajes[index] = { ...personajes[index], ...newData };
//     escribirArchivo('./db.json', personajes);
//     res.send(personajes[index]);
// });

// //RUTA DESTROY
// app.delete('/marvel/:id', (req, res) => {
//     res.send('Hello Dr. Bruce Banner')
// })

// //RUTA POSTMAN DESTROY
// app.delete('/marvel/:id', (req, res) => {
//     let personajes = leerArchivo('./db.json');
//     personajes = personajes.filter(marv => marv.id !== parseInt(id));
//     escribirArchivo('./db.json', personajes);
//     res.send(`Se ha eliminado el superhéroe con el ID ${id}`);
// });

// // MODULO BUILT-IN DE FILESYSTEM
// app.get('/marvel', (req, res) => {
//     const marvel = fs.readFileSync('db.json')
//     const marvelJSON = JSON.parse(marvel)
//     res.send(marvelJSON)
// })

//Levantando el servidor para escuchar por el puerto 3000
app.listen(3000, () => {
    console.log('Listening on port 3000');
}
)