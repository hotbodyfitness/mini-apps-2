const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const CoinGeckoClient = require('coingecko-api');
const CoinGecko = new CoinGeckoClient();
// console.log(new Date().getTime())
// console.log(new Date(1574269241756))

var cache = {
  size: 0,
  date: ''
};

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/data', (req, res) => {
  var date = JSON.stringify(new Date()).slice(1, 11);
  var q = req._parsedOriginalUrl.query.split('&');
  q[0] = q[0].slice(5);
  q[1] = q[1].slice(5);
  if (cache.date !== date) { cache = { size: 0, date } } // clear cache and start at 0

  var func = async () => {
    var currency = q[0];
    var interval = q[1].slice(4);
    var timeAmount = Number(q[1].slice(0, 1));
    var days;
    if (interval.includes('Year')) {
      days = 365;
      if (timeAmount === 5) { days = (days * 5) + 1; }
      else if (timeAmount === 3) { days *= 3; }
    } else if (interval.includes('Month')) {
      days = 31;
      if (timeAmount === 6) { days = 183; }
      else if (timeAmount === 3) { days = 91; }
    } else {
      days = 7;
    }
    return await CoinGecko.coins.fetchMarketChart(currency, { days });
    // return await CoinGecko.coins.fetchHistory('bitcoin', {
    //   date: '21-11-2019'
    // });
    // return await CoinGecko.coins.all();
  };
  if (cache[q]) {
    res.send(cache[q[0] + q[1]])
  } else {
    func().then(result => { cache[q[0] + q[1]] = result.data.prices; cache.size++; res.send(result.data.prices) });
  }
  // func().then(result => res.send(result.data.market_data.current_price.usd));
  // func().then(result => res.send(result.data));
});



app.listen(3000, () => { console.log('Listening on port 3000') });