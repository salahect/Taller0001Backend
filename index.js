import express from "express";
import fs from "fs"
import bodyParser from "body-parser";
//Intancia de Express
const app = express();

app.use(bodyParser.json());
//Configurar Puerto
const port = 3000;
//Funcion Leer Datos
const leerDatos = () => {
  try{
  const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error al leer datos >> ${error}`);
  }
}

//Funcion Escribir Datos

const escribirDatos = (data) => {
  try{
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}

//Configurar Ruta
app.get("/", (req, res) => {
  res.send("Bienvenido a mi proyecto de Libros");
});

//GET
app.get("/libros", (req, res) => {
  const data = leerDatos();
  res.json(data.libros)
});

//GET LIBRO ID
app.get("/libros/:id", (req,res) => {
  const data = leerDatos();
  const id = parseInt(req.params.id);
  const libro = data.libros.find((libro) => libro.id === id)
  res.json(libro);

});

//POST
app.post("/libros", (req,res) => {
  const data = leerDatos();
  const body = req.body;
  const nuevoLibro = {
    id: data.libros.length + 1,
    ...body
  };
  data.libros.push(nuevoLibro);
  escribirDatos(data);
  res.json(nuevoLibro);
});


//PUT

app.put("/libros/:id", (req,res) => {
  const data = leerDatos();
  const body = req.body;
  const id = parseInt(req.params.id);
  const indiceLibro = data.libros.findIndex((libro) => libro.id === id);
  data.libros[indiceLibro] = {
    ...data.libros[indiceLibro],
    ...body
  };
  escribirDatos(data);
  res.json({ mensaje: "Libro Actualizado con éxito" });
});


//DELETE

app.delete("/libros/:id", (req,res) => { 
  const data = leerDatos();
  const id = parseInt(req.params.id);
  const indiceLibro = data.libros.findIndex((libro) => libro.id === id);
  data.libros.splice(indiceLibro, 1);
  escribirDatos(data);
  res.json({ mensaje: `Registro en la posicion  ${indiceLibro} Eliminado Correctamente` });
})



//Escuchar app por puerto 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});