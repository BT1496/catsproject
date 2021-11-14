const Wedsoket = require("ws");
const { END_MINING } = require("../block/message");
const Message = require("../block/message");
const Validation = require("../block/validation");
const wss = new Wedsoket.Server({ port: 8080 });
const Transaction = require("../block/transaction");
let blockchain = [];

wss.on("connection", (ws, req) => {
  const address = req.socket.remoteAddress;
  initConnection(ws, address);
  ws.on("message", (data) => onMessage(data, ws, address));
  ws.on("open", onOpen);
  ws.on("close", onClose);
  ws.on("error", onError);
});

const initConnection = (ws, address) => {
  console.log("connect! - " + address);
  ws.send(
    JSON.stringify(
      new Message({
        action: Message.INIT_BLOCKCHAIN,
        data: blockchain.length > 0 ? blockchain : undefined,
      })
    )
  );
};
const onMessage = (data, ws, address) => {
  const message = Message.fromJson(data);
  switch (message.action) {
    case Message.END_MINING:
      endMining(message.data, address);
      break;
    case Message.ADD_TRANSACTION:
      broadcast(message);
    default:
      break;
  }
};

const endMining = (newBlockchain, address) => {
  
  if (Validation.confirmSecond(blockchain, newBlockchain)) {
    
    blockchain = newBlockchain;
    
    reward(address);
    
    syncNewBlockchain(blockchain);
  }
};

const syncNewBlockchain = (newBlockchain) => {
  broadcast(
    new Message({
      action: Message.SYNC_BLOCKCHAIN,
      data: newBlockchain,
    })
  );
};

const reward = (address) => {
  console.log("We've got a reward. - "+ address);
  broadcast(
    new Message({
      action: Message.ADD_TRANSACTION,
      data: new Transaction({
        from: "SYSTEM", 
        to: address, 
        amount: 50, 
      }),
    })
  );
};

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === Wedsoket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const onOpen = () => {};

const onClose = () => {
  console.log("close");
};
const onError = () => {};
