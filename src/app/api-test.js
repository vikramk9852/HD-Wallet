// const rp = require('request-promise');
const fs = require('fs');

// const requestOptions = {
//     method: 'GET',
//     uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
//     qs: {
//         start: 1,
//         limit: 5000,
//         convert: 'USD'
//     },
//     headers: {
//         'X-CMC_PRO_API_KEY': 'e108a40e-964b-4c46-8ed0-2be51a4aed63'
//     },
//     json: true,
//     gzip: true
// };

// rp(requestOptions).then(response => {
//     return new Promise(function (resolve, reject) {
//         fs.writeFile('response.json', response, function (data, err) {
//             if (err) reject(err);
//             else resolve(data);
//         });
//     });
// }).catch((err) => {
//     console.log('API call error:', err.message);
// });
fs.readFile("/media/vikram/hdk/crypto-wallet/src/app/response.json", function(err, data){
    console.log(data.toString())
})