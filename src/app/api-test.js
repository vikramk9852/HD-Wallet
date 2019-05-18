const rp = require('request-promise');
const requestOptions = {
	method: 'GET',
	uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC&convert=ETH',
	headers: {

		'Accept': 'application/json',
		'Accept-Encoding': 'deflate, gzip',
		'X-CMC_PRO_API_KEY': 'e108a40e-964b-4c46-8ed0-2be51a4aed63'
	},
	json: true,
	gzip: true
};

rp(requestOptions).then(response => {
	for (let key in response) {
		console.log(response[key]);
	}
}).catch((err) => {
	console.log('API call error:', err.message);
});