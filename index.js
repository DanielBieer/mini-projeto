const express = require('express');
const app = express();
const PORT = 3069;

let produtos = []
app.use(express.json())

//MIDDLEWARE LOG DE HORA
const logHorario = (req, res, next) => {
    const horaAtual = new Date().toISOString();
console.log(
    `[${horaAtual} Nova solicitação recebida, ${req.method} ${req.originalUrl}]`
);
next();
}

app.use(logHorario);

//POST
app.post('/produto', (req, res) => {
const produto = req.body;
if(produtos.length > 0) {
    produto.id = produtos[produtos.length - 1].id + 1
} else {
    produto.id = 1
}
produtos.push(produto)
res.status(201).send('Produto adicionado com sucesso.')
})

//GET SIMPLES
app.get('/', (req, res) => {
    res.json(produtos)
})

//GET QUERY
app.get('/produto/:id', (req, res) => {
    const { id } = req.params
    const produto = produtos.find(produto => produto.id === parseInt(id));
    if(!produto){
        res.status(404).send('Não foi possível encontrar o produto.')
        return;
    }
    res.json(produto);
})

//PUT
app.put('/produto/:id', (req, res) => {
const { id } = req.params;
const novoDado = req.body
const index = produtos.findIndex(produto => produto.id === parseInt(id))
if(index === -1){
    res.status(400).send('Produto inválido.')
return;
}
produtos[index] = { ...produtos[index], ...novoDado };
res.status(200).send('Produto atualizado. ')
})

//DELETE
app.delete('/produto/:id', (req, res) => {
    const { id } = req.params
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
if (index === -1){
    res.status(400).send("Produto inválido");
    return;
}
    produtos.splice(index, 1)
    res.status(200).send('Produto deletado.')
})



app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`)
})
