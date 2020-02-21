// Configurando o servidor
const express = require("express")
const server = express()

//Configurar o servidor para apresentar aquivos estáticos (css, js e etc.)
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'cristian',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// Configura a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Se o name, email e blood for igual a "vazio" => Todos os campos são obrigatórios
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }

    // Coloca valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err){
        if (err) return res.send("Erro no banco de dados.")
        return res.redirect("/")
    })

})

// Liga o servidor permitindo acesso a porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor.")
})