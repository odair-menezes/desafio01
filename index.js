/**
 * Desafio 01. Conceitos do NodeJS
 * Crie uma aplicação do zero utilizando Express.
 * Essa aplicação será utilizada para armazenar projetos e suas tarefas.
 */
/**
 * @author Odair Menezes
 * @since 06/09/2019
 * @version 1.0.00
 */
const express = require('express'); // Importando o express

const server = express(); // Iniciando o servidor

server.use(express.json()); // Ajustando p servidor para tratar o tipo json

let requisicoes = 0; // Variável que irá controlar o número de requisições
const projects = []; // Array que irá armazenar os projetos

/**
 * Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL
 * que verifica se o projeto com aquele ID existe. Se não existir retorne um erro,
 * caso contrário permita a requisição continuar normalmente;
 */
function projetoExiste(req, res, next) {
  const { id } = req.params; // Desestruturação para capturar o id da tarefa
  const project = projects.find(p => p.id == id); // Verifica se o ID do projeto existe

  if (!project) {
    // Caso o projeto não exista, retorna um erro
    return res.status(400).json({ error: 'Projeto nào existe' });
  }

  return next(); // Se o projeto existe irá dar sequência à execução
}

/**
 * Crie um middleware global chamado em todas requisições que imprime (console.log) uma contagem de quantas
 * requisições foram feitas na aplicação até então;
 */
function logRequisicoes(req, res, next) {
  requisicoes++; // Incrementa a variável requisicoes a cada nova requisição

  console.log(`Número de requisições: ${requisicoes}`); // Imprime o numero de requisições

  return next(); // Da sequência a execução
}

// Instancia o midlleware global
server.use(logRequisicoes);

// GET /projects: Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * POST /projects: A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro de um array
 * no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto
 * o título do projeto no formato string com àspas duplas.
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body; // Desestruturação para recuperar o id e o titulo da tarefa

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project); // Cadastra o novo projeto

  return res.json(project); // Retorna o novo projeto cadastrado
});

// PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', projetoExiste, (req, res) => {
  const { id } = req.params; // Desestruturação para recuperar o id do head do projeto
  const { title } = req.body; // Desestruturação para recuperar o titulo do body do projeto

  const project = projects.find(p => p.id == id); // Verifica se o projeto existe

  project.title = title; // Atualiza o projeto

  return res.json(project); // Retorna o projeto atualizado
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', projetoExiste, (req, res) => {
  const { id } = req.params; // Desestruturação para recuperar o ID do pojeto

  const projectIndex = projects.findIndex(p => p.id == id); // Verifica se o projeto existe

  projects.splice(projectIndex, 1); // Exclui o projeto

  return res.send(); // Retorna sucesso
});

/**
 * POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no
 * array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
 */
server.post('/projects/:id/tasks', projetoExiste, (req, res) => {
  const { id } = req.params; // Desestruturação para recuperar o id do head do projeto
  const { title } = req.body; // Desestruturação para recuperar o titulo do body do projeto

  const project = projects.find(p => p.id == id); // Verifica se o projeto existe

  project.tasks.push(title); // Adiciona uma nova tarefa ao projeto

  return res.json(project); // Retorna o projeto atualizado
});

server.listen(4000); // Porta em que o servidor irá rodar
