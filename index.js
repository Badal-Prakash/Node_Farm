const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const replaceTemplate = require("./module/replaceTemp");

const tempoverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempprduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempcard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardHtml = productData
      .map((el) => replaceTemplate(tempcard, el))
      .join("");

    const output = tempoverview.replace("{%PRODUCT_CARDS%", cardHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = productData[query.id];
    const output = replaceTemplate(tempprduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.end("page not found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log(`listening on port 8000`);
});
