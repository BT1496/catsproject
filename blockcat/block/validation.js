const Block = require("./block");

class Validation {
    static compareWithLength(newBlock, blockchain) {
        const result = 
         newBlock.index === blockchain.length;
        if (!result) {
            console.log("The index of the new block and the number of blocks do not match.");
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
                "The previous hash of the last block and the current hash of the new block are not the same."
                );
        }
        return result;
    }
        
    static compareHashAndData(newBlock) {
        if (newBlock.index === 0) return true;
            const result = newBlock.hash === newBlock.getHash();
         if(!result) {
             console.log("The data hash of the new block is not the same.");
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
               "The length of the new blockchain is not the same."
               );
       }
       return result;
    }

    }
  

    module.exports = Validation;
