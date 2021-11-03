const express = require('express');
const https = require('https');
const zip = require('zip-array').zip;

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
  function requestAsync(url) {
  	return new Promise((resolve, reject) => {
  	  const request =  https.get(url, (response) => {
  	  	var body = "";
  	    response.on("data", (chunk) => {
  	      body += chunk;
        });
        response.on("end", (chunk) => {
  	      resolve(body);
        });
        response.on("error", (err) => {
  	      reject(body);
        });
      });
      request.end();
  	});
  }

  const urls = [
    "https://api.coinbase.com/v2/prices/BTC-USD/buy",
    "https://api.coinbase.com/v2/prices/ETH-USD/buy",
    "https://api.coinbase.com/v2/prices/BTC-USD/sell",
    "https://api.coinbase.com/v2/prices/ETH-USD/sell",
    "https://api.gemini.com/v1/pubticker/btcusd",
    "https://api.gemini.com/v1/pubticker/ethusd"
  ];
  let prices = {
    "BTC": {
      "Coinbase": {},
      "Gemini": {},
    },
    "ETH": {
      "Coinbase": {},
      "Gemini": {},
    },
  };

  Promise.all(urls.map(url => requestAsync(url))).then(responses => {
  	zip(urls, responses).forEach(pair => {
      const url = pair[0];
      const response = pair[1];
      const parsedData = JSON.parse(response);
      
  	  if (url.includes("coinbase")) {
        const base = parsedData.data.base;
        const amount = parsedData.data.amount;

        if (url.includes("buy")) {
          prices[base]["Coinbase"]["Buy"] = Number(amount).toFixed(2);
        }
        else {
          prices[base]["Coinbase"]["Sell"] = Number(amount).toFixed(2);
        }
  	  }
  	  else {
        const buyPrice = parsedData.bid;
        const sellPrice = parsedData.ask;

        if (url.includes("btc")) {
          prices["BTC"]["Gemini"]["Buy"] = Number(buyPrice).toFixed(2);
          prices["BTC"]["Gemini"]["Sell"] = Number(sellPrice).toFixed(2);
        }
        else {
          prices["ETH"]["Gemini"]["Buy"] = Number(buyPrice).toFixed(2);
          prices["ETH"]["Gemini"]["Sell"] = Number(sellPrice).toFixed(2);
        }
  	  }
  	});
  }).then(() => {
    const btcBestPlatformToBuy = prices["BTC"]["Gemini"]["Buy"] < prices["BTC"]["Coinbase"]["Buy"] ? "Gemini" : "Coinbase";
    const btcBestPlatformToSell = prices["BTC"]["Gemini"]["Sell"] > prices["BTC"]["Coinbase"]["Sell"] ? "Gemini" : "Coinbase";
    const ethBestPlatformToBuy = prices["ETH"]["Gemini"]["Buy"] < prices["ETH"]["Coinbase"]["Buy"] ? "Gemini" : "Coinbase";
    const ethBestPlatformToSell = prices["ETH"]["Gemini"]["Sell"] > prices["ETH"]["Coinbase"]["Sell"] ? "Gemini" : "Coinbase";
  	res.render("crypto-tracker", {prices: prices, btcBestPlatformToBuy: btcBestPlatformToBuy, btcBestPlatformToSell: btcBestPlatformToSell, 
      ethBestPlatformToBuy: ethBestPlatformToBuy, ethBestPlatformToSell: ethBestPlatformToSell});
  });
});

app.listen(process.env.PORT || port, () => {
  console.log("Server listening on port " + port);
});