const events = require("events");
const net = require("net");

const chanel = new events.EventEmitter();
chanel.clients = {};
chanel.subscriptions = {};
chanel.on("join", function(id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      this.clients[id].write(message);
    }
  };
  const welcome = `
    Welcome!
      Guests online: ${this.listeners("broadcast").length}  
  `;
  client.write(`${welcome}\r\n`);
  this.on("broadcast", this.subscriptions[id]);
});

chanel.on("leave", function(id) {
  chanel.removeListener("broadcast", this.subscriptions[id]);
  chanel.emit("broadcast", id, `${id} has left the chatroom.\r\n`);
});

chanel.on("shutdown", () => {
  chanel.emit("broadcast", "", "The server has shut down.\r\n");
  chanel.removeAllListeners("broadcast");
});

chanel.on("error", err => {
  console.log(`ERROR: ${err.message}`);
});

chanel.setMaxListeners(50); // warning displays when more than 10 listeners

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  chanel.emit("join", id, client);
  client.on("data", data => {
    data = data.toString();
    // if (data === "q") {
    //   chanel.emit("shutdown");
    // }
    // if (data === "e") {
    //   chanel.emit("error", new Error("Something is wrong."));
    // }
    chanel.emit("broadcast", id, data);
  });
  client.on("close", () => {
    chanel.emit("leave", id);
  });
});

process.on("uncaughtException", err => {
  console.error(err.stack);
  process.exit(1);
});

server.listen(8888);
