const Web3 = require('web3');

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/b9aaf785bae74fc7b2efe86446abd5cf'));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.https://mainnet.infura.io/v3/b9aaf785bae74fc7b2efe86446abd5cf.io/v3/'));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    
                    if (this.account == tx.to.toLowerCase()) {
                        console.log({ 
                            address: tx.from, 
                            value: this.web3.utils.fromWei(tx.value, 'ether'), 
                              timestamp: new Date() 
                        });
                    }
                    
                } catch (err) {
                    //console.error(err);
                    //console.log('Watching all pending transactions...');
                }
            }, 5000)
        });
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();