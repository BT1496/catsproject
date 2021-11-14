import React, { useEffect } from "react";
import BlockChain from "../block/blockchain";
import Message from "../block/message";
import Transaction from "../block/transaction";

const bc = new BlockChain();

const Index = () => {
  let ws;
  const webSocketServerUrl = "ws://localhost:8080";
  let isStop = false;

  useEffect(() => {
    initConnection();

    ;
  []}, );

  const initConnection = () => {
    ws = new WebSocket(webSocketServerUrl);
    ws.onmessage = onMessage;
  };

  const onMessage = (data) => {
    const message = Message.fromJson(data.data);
    switch (message.action) {
      case Message.INIT_BLOCKCHAIN:
        const blockchain = message.data;
        initBlockchain(blockchain);
        break;
      case Message.ADD_TRANSACTION:
        addTransaction(message.data);
        break;
      case Message.SYNC_BLOCKCHAIN:
        syncBlockchain(message.data);
        break;

      default:
        break;
    }
  };

  const addTransaction = (tx) => {
    const transaction = new Transaction(tx);
    if (transaction.from === "SYSTEM") {
      console.log("보상 후 거래내역 초기화");
      bc.transactions = [];
    }
    bc.addTransaction(transaction);
  };

  const syncBlockchain = (blockchain) => {
    bc.blockchain = blockchain;
    localStorage.setItem("blockchain", bc.blockchain);
  };

  const initBlockchain = (blockchain) => {
    if (blockchain) bc.blockchain = blockchain;
    localStorage.setItem("blockchain", JSON.stringify(bc.blockchain));
    console.log("현재 블록체인", bc.blockchain);
  };

  const startMining = async () => {
    console.log("startMinig");
    isStop = false;
    while (!isStop) {
      const blcok = await bc.mining();
      bc.addBlock(blcok);
      send({ action: Message.END_MINING, data: bc.blockchain });
    }
  };

  const send = (data) => {
    ws.send(JSON.stringify(new Message(data)));
  };

  const stopMining = () => {
    console.log("stopMining");
    isStop = true;
  };

  const sendTx = () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const amount = document.getElementById("amount").value;
    send({
      action: Message.ADD_TRANSACTION,
      data: new Transaction({ from, to, amount }),
    });
  };

  return (
    <div>
      <div>
        <div>
          from : <input type="text" id="from" />
        </div>
        <div>
          to : <input type="text" id="to" />
        </div>
        <div>
          amount : <input type="text" id="amount" />
        </div>
        <div>
          <button onClick={sendTx}>send</button>
        </div>
      </div>
      hello world
      <button onClick={startMining}>startMining</button>
      <button onClick={stopMining}>stopMining</button>
    </div>
  );
};

export default Index;
