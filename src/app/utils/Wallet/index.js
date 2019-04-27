var hdKey = require("ethereumjs-wallet/hdkey")
// var Wallet = require("ethereumjs-wallet")
var bip39 = require("bip39")
var unorm = require('unorm')
var _pbkdf2 = require('pbkdf2')
// var pbkdf2 = _pbkdf2.pbkdf2Sync
var pbkdf2Async = _pbkdf2.pbkdf2


function mnemonicToSeedAsyncIn (mnemonic, password) {
    return new Promise(function (resolve, reject) {
      try {
        var mnemonicBuffer = Buffer.from(unorm.nfkd(mnemonic), 'utf8')
        var saltBuffer = Buffer.from(salt(unorm.nfkd(password)), 'utf8')
      } catch (error) {
        return reject(error)
      }
  
      pbkdf2Async(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512', function (err, data) {
        if (err) return reject(err)
        else return resolve(data)
      })
    })
  }

  function salt (password) {
  return 'mnemonic' + (password || '')
}

function createWallet(password){
    return new Promise((resolve, reject) => {
        try {
            var mnemonic = bip39.generateMnemonic();

            //hash password
            var hashedPassword = _pbkdf2.pbkdf2Sync(password, '', 2048, 64, 'sha512').toString('hex');

            //store hashed password to local storage
            localStorage.setItem("hashedPassword", hashedPassword);

            //create first wallet
            generateWallet(mnemonic, password).then((wallet) => {
                resolve({mnemonic:mnemonic, wallet:wallet});
            })
        } catch(e) {
            reject(e);
        }
    })
    
}

function logIn(password){

    //hash password
    var hashedPassword = _pbkdf2.pbkdf2Sync(password, '', 2048, 64, 'sha512').toString('hex')

    //retrieve hashed password from local storage
    var retrievedPassword = localStorage.getItem("hashedPassword")
    // console.log(hashedPassword==retrievedPassword)

    if(retrievedPassword === hashedPassword){

        //retrieve wallets from local storage
        // var wallet = JSON.parse(localStorage.getItem("address"))[0];
        // var account = localStorage.getItem(wallet);
        // var retrievedAccount =  fromV3(account, password);

        return true;
    }
    return false;
}


function restoreWallet(password, mnemonic){

    return new Promise((resolve, reject) => {
        try {

            //hash password
            var hashedPassword = _pbkdf2.pbkdf2Sync(password, '', 2048, 64, 'sha512').toString('hex');

            //store hashed password to local storage
            localStorage.setItem("hashedPassword", hashedPassword);

            //create first wallet
            generateWallet(mnemonic, password).then((wallet) => {
                resolve({mnemonic:mnemonic, wallet:wallet});
            })
        } catch(e) {
            reject(e);
        }
    })
}

function generateWallet(mnemonic, password){

    return new Promise((resolve, reject) => {

        //Ethereum wallet base path
        var path = "m/44'/60'/0'/0"

        //generate seed from mnemonic and getting the promise
        var seed = mnemonicToSeedAsyncIn(mnemonic) 

        //resolve the promise
        seed.then(function(result){
            result = result.toString('hex');
            localStorage.setItem("masterSeed", result);
            resolve(result);
        },
        function(err){
            console.log(err)
            reject(err);
        })
    })
}

function validateMnemonic(mnemonic){
    return bip39.validateMnemonic(mnemonic);
}

export{
    createWallet,
    generateWallet,
    logIn,
    restoreWallet,
    validateMnemonic
}
