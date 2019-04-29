var request = require('request');


export function convert(cryptoCurrency, fiatCurrency) {
    const promise = new Promise((resolve, reject)=>{
        let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoCurrency}&tsyms=${fiatCurrency}&api_key=5d040287827d7fe63f7a8bb11723d95ffbda59c7600d22f5c98d9947b4a5ea95`;
        request(url, function (error, response, body){
            if(error){
                console.log(error)
                return reject(error);
            }  
            resolve(body)

        })
    })
    return promise;
}
