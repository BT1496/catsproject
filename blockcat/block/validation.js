const Block = require("./block");

class Validation {
    static compareWithLength(newBlock, blockchain) {
        const result = 
         newBlock.index === blockchain.length;
        if (!result) {
            console.log("새로운블록의 인덱스와 블록갯수가 맞지않습니다.");
        }
        return result;
    }

    static compareWithHashs(newBlock, blockchain) {
        const result = 
         newBlock.previousHash  === blockchain[blockchain.length - 1].hash;
         console.log(newBlock);
         console.log(blockchain[blockchain.length - 1]);      
         if(!result){
            console.log(
                "마지막블록의 이전해시와 새로운블록의 현재해시가 같지않습니다."
                );
        }
        return result;
    }
        
    static compareHashAndData(newBlock) {
        if (newBlock.index === 0) return true;
            const result = newBlock.hash === newBlock.getHash();
         if(!result) {
             console.log("새로운블록의 데이터 해시화가 해시가 같지않습니다.");
        }
        return result;
    }        
        

    static confirmFirst(newBlock, blockchain) {
        return (
        this.compareHashAndData(newBlock) &&
        this.compareWithHashs(newBlock, blockchain) && 
        this.compareWithLength(newBlock, blockchain)
      );
    }
    
    static confirmSecond(preBlockchain, newBlockchain){
        return (
               this.compareWithAllHashs(newBlockchain) &&
               this.compareBlockchainLength(preBlockchain, newBlockchain)
            );
        }
    
    static compareWithAllHashs(newBlockchain){
        let result = false;
        for (let i = 0; i < newBlockchain.length; i++) {
            if(i + 1 !== newBlockchain.length ) {
                if(
                    newBlockchain[i + 1].previousHash === newBlockchain[i].hash &&
                    this.compareHashAndData(new Block(newBlockchain[i]))
                    ) {
                        result = true;         
            } else {
                 return false; 
            }
        } else {
            if(this.compareHashAndData(new Block(newBlockchain[i]))) {
                result = true;
            } else {
                return false;
            }
          }  
        }
        return result;
    }
    
    static compareBlockchainLength(preBlockchain, newBlockchain){
        const result = preBlockchain.length < newBlockchain.length;      
        if(!result){
           console.log(
               "새로운 블록체인의 길이가 같지 않습니다."
               );
       }
       return result;
    }

    }
  

    module.exports = Validation;
