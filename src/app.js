const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  /* const objExists = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  if (objExists.length > 0) {
    response.status(400).json({ error: "Item já cadastrado" });
  } else { */
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
  /* } */
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found !" });
  } else {
    const repository = {
      id,
      title:
        title != undefined && title != repositories[repositoryIndex].title
          ? title
          : repositories[repositoryIndex].title,

      url:
        url != undefined && url != repositories[repositoryIndex].url
          ? url
          : repositories[repositoryIndex].url,

      techs:
        techs != undefined && techs != repositories[repositoryIndex].techs
          ? techs
          : repositories[repositoryIndex].techs,
      likes: repositories[repositoryIndex].likes,
    };

    repositories[repositoryIndex] = repository;

    if (isUuid(repository.id)) {
      return response.json(repository);
    }
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not Found" });
  } else {
    repositories.splice(repositoryIndex, 1);

    return response.status(204).send("No Content ");
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id == id);

  if (repository == undefined) {
    return response.status(400).json({ error: "Repository not Found !" });
  } else {
    repository.likes += 1;

    return response.json({ likes: repository.likes });
  }
});

module.exports = app;
