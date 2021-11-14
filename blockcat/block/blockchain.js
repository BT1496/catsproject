const { BN } = require("bn.js");
const Block = require("./block.js");
const Validation = require("./validation.js");

class BlockChain {
    constructor() {
        this.hadicap = 0x4000000;
        this.blockchain = [Block.getGenesis()];
        this.transactions = [];
    }
    addTransaction(transaction) {
        console.log("거래가 성사되었습니다.", transaction);
        this.transactions.push(transaction);
    }

    getTarget(bits){
        let bits16 = parseInt("0x" + bits.toString(16), 16);
        let exponent = bits16 >> 24;
        let mantissa = bits16 & 0xffffff;
        let target = mantissa * 2 ** (8 * (exponent - 3));
        let target16 = target.toString(16);
        let k = Buffer.from("0".repeat(64 - target16.length) + target16, "hex");
        return k.toString("hex");
    }

    bitsToDifficulty(bits){
        const target = this.getTarget(bits);
        const maximumTarget = "0x00000000ffff" + "0".repeat(64 - 12);
        return parseInt(maximumTarget, 16) / parseInt(target, 16);   
    }

    getLastBlock() {
     return this.blockchain[this.blockchain.length - 1];
    }

    slowResolve(){
        return new Promise((Resolve) => setTimeout(Resolve.bind(), 0));

    }
    async mining(){
      const lastBlock = this.getLastBlock();
      const newBlock = new Block({
        index: lastBlock.index + 1,
        previousHash: lastBlock.hash,
        timestamp: Date.now(),
        transactions : this.transactions,
        nonce: 0,
       });
    const target = this.getTarget(lastBlock.bits + this.hadicap);
    console.log("현재 난이도 목표값:", target);
    while (target <= newBlock.getHash()) {
       newBlock.nonce++;
       await this.slowResolve();
      }
      
    let difficulty = this.getDifficulty(lastBlock.difficulty);
    newBlock.hash = newBlock.getHash();
    newBlock.difficulty = difficulty;
    newBlock.bits = this.difficultyToBits(newBlock.difficulty);
    console.log("새로 채굴된 블록", newBlock);
    return newBlock;
    }
    
    getDifficulty(difficulty) {
        const lastBlock = this.getLastBlock()
        if(lastBlock.index > 0 && lastBlock.index % 5 == 0) {
            let prevTime = this.blockchain[this.blockchain.length - 5].timestamp;
            let time = lastBlock.timestamp;
            let elaspedTime = (time - prevTime) / 5 / 1000;
            let multiple = elaspedTime > 10 ? 0.25 : 4;
            difficulty = difficulty * multiple;
            

        }  //난이도 조절 (5의 배수일때 나머지는 0 비트는 2016개 조절시간 10분)
        return difficulty;

    }

    difficultyToBits(difficulty) {
        const difficulty16 = difficulty.toString(16)
        const maximumTarget = "0x00000000ffff" + "0".repeat(64 - 12);
        const target = parseInt(maximumTarget, 16) / parseInt(difficulty16, 16);   
        let num = new BN(target.toString(16), "hex");
        let compact, nSize, bits;
        nSize = num.byteLength();
        if (nSize <= 3) {
            compact = num.toNumber();
            compact <<= 8 * (3 - nSize);
        }else{
            compact = num.ushrn(8*(nSize-3)).toNumber();
        }
        if(compact & 0x800000){
            compact >>= 8;
            nSize++;    
        }
        bits = (nSize << 24) | compact;
        if(num.isNeg()){
            bits |= 0x800000;
        }
        bits >>>= 0;
        return parseInt(bits.toString(10));


    }

    addBlock(newBlock) {
        if (Validation.confirmFirst(newBlock, this.blockchain)) {
            this.blockchain.push(newBlock);
        } else {
            console.log("유효하지 않은 블록입니다.");
        } 
      }
    }
    module.exports = BlockChain;   
        // const bc = new Blockchain();
        // let block= bc.mining();
        // // block.index = 14; (유효하지 않은블록)
        // bc.addBlock(block);
        // console.log(bc.blockchain);

// console.log(new Blockchain().difficultyToBits(1));

// console.log(new Blockchain().bitsToDifficulty(486604799));


