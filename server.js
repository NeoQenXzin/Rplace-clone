import fastifyServer from "fastify";
import fastifySocketIo from "fastify-socket.io";
import cors from "@fastify/cors";
//instancier car type module
const fastify = fastifyServer();

fastify.register(fastifySocketIo, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: "*",
  credentials: true,
  exposedHeaders: "*",
};

await fastify.register(cors, corsOptions);

fastify.get("/", () => {
  return {
    hello: "world",
  };
});

//Constante board liée au client (index.js) 625 pixel blanc
const board = Array(625).fill("#FFFFFF");
fastify.listen({ port: 3000 }, () => {
  console.log("Server is listening on http://localhost:3000");

  //Récupérer socket
  fastify.io.on("connection", (socket) => {
    // console.log("a user connected");
    socket.emit("init", board);
    socket.on("update-pixel", (data) => {
      // console.log("update-pixel", data);
      board[data.position] = data.color;

      //emmetre a tous les subscribers
      socket.broadcast.emit("update-pixel", data);
    });
  });
});
