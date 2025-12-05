/********************************************************************************
*  WEB422 – Assignment 02
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Meet Patel     Student ID: 143275238     Date: 05 November 2025
********************************************************************************/

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.all("*", (req, res) => handle(req, res));

    const port = 3000;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
