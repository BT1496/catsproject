class Message{
    static INIT_BLOCKCHAIN = "INIT_BLOCKCHAIN";
    static END_MINING = "END_MINING";
    static ADD_TRANSACTION = "ADD_TRANSACTION";
    static SYNC_BLOCKCHAIN = "SYNC_BLOCKCHAIN";
    
    constructor(obj) {
        this.action = obj.action;
        this.data = obj.data;

    }
    
    static fromJson(str) {
        return new Message(JSON.parse(str));

    }
}


module.exports =  Message;
