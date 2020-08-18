const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middleware para mostrar os requests e seu tempo de execução no console
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); // Próximo middleware

  console.timeEnd(logLabel);
};
app.use(logRequests);

// Middleware para validar um uuid
function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ Error: 'Invalid repositorie ID' });
  };

  return next();
};

// Verifica se o ID passado é válido através do middleware validateRepositorieId.
app.use('/repositories/:id', validateRepositorieId);

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ Error: 'Repositorie ID not found.' });
  };

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ Error: 'Repositorie ID not found.' });
  };

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ Error: 'Invalid repositorie ID' });
  };

  // Acrescenta um like no repositório.
  repositories[repositorieIndex].likes += 1;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
