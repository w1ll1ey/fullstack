const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
morgan.token("body", function (request) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `;
  response.send(info);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  const same = (old) => old.name === person.name;

  if (!person.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!person.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (persons.some(same)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  person.id = String(Math.floor(Math.random() * 1000000));
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
