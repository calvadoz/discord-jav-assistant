 require('dotenv').config();
const javbus = require('node-javbus')();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const javbusWeb = "https://javbus.com/en/";
const javbusWebRoot = "https://javbus.com";
const bannedCode = "nykd";
const totalPages = 156;
const axios = require("axios");
const dns = require('dns');

bot.login(TOKEN);

bot.on('ready', () => {
    console.log(`${bot.user.tag} ! is summoned and reporting for duty..... o7`);
    loadCodes().then((data) => {
        dailyCodes = splitCodesToArray(data);
    }, (err) => {
        console.log("Some error occured during loading of the code... ", err.message)
    });
});

bot.on('message', msg => {
    if (msg.content.toLowerCase() === ';cotd') {
        let code = randomizeAndFetch(dailyCodes);
        if (preventDisruptiveCode(code)) {
            msg.reply("Disruptive code detected, do NOT try it again");
            return;
        }
        queryJAVBus(code).then(result => {
            const cover = javbusWebRoot + result.cover;
            msg.channel.send(result.title);
            msg.channel.send("***Model: ***" + result.stars.map(star => star.name).join(", "));
            msg.channel.send(cover);
        },  err => {
            msg.reply("Code kenot found or got error, please stop being so horny...", err.message);
            console.error("Error Occured, with code ", code);
        })
    } 
    else if (msg.content.toLowerCase() === '!cotd') {
        // dns.lookup('xvideos.com', (err, value) => { 
        //     if(err) { 
        //         console.log(err); 
        //         return; 
        //     } 
        //     console.log(value); 
        // }) 
        // (async () => {
        //     console.log(
        //       (await axios.get('https://xvideos.com')).config
        //         .url
        //     );
        //   })();
        fetchFromJavBus().then(result => {
            let randomCodeFromPage = randomizeAndFetch(result);
            console.log("Random Code: ", randomCodeFromPage.id);
            queryJAVBus(randomCodeFromPage.id).then(result => {
                const cover = javbusWebRoot + result.cover;
                msg.channel.send(result.title);
                msg.channel.send("***Model: ***" + result.stars.map(star => star.name).join(", "));
                msg.channel.send("***Release Date: *** " + randomCodeFromPage.date);
                msg.channel.send(cover);
            }, err => {
                msg.reply("Code kenot found or got error, please stop being so horny...", err.message);
                console.error("Error Occured, with code ", randomCodeFromPage.id);
            });
        });
    } else if (msg.content.toLowerCase().startsWith('[') && msg.content.toLowerCase().endsWith(']')) {
        let codeOnDemand = msg.content.replace('[', '').replace(']', '').toLowerCase();

        queryJAVBus(codeOnDemand).then(result => {
            const cover = javbusWebRoot + result.cover;
            msg.channel.send(result.title);
            msg.channel.send("***Model: ***" + result.stars.map(star => star.name).join(", "));
            msg.channel.send(cover);
        }, err => {
            msg.reply("Code kenot found or got error, please stop being so horny...", err.message);
            console.error("Error Occured, with code ", code);
        });
    }
});

function fetchFromJavBus() {
    let randomPage = randomizeAndFetchRandomPage();
    console.log("Page no: ", randomPage);
    try {
        return javbus.page(randomPage);
    }
    catch (e) {
        throw new error("Got error la");
    }
}

function preventDisruptiveCode(code) {
    if (code.toLowerCase().includes(bannedCode)) {
        return true;
    }
    return false;
}

function loadCodes() {
    const dailyCodeFileName = "./DailyCode.txt";
    return new Promise((resolve, reject) => {
        fs.readFile(dailyCodeFileName, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            console.log("Codes are loaded successfully...");
            resolve(data);
        });
    })
}

function queryJAVBus(code) {
    try {
        return javbus.show(code);
    } catch (e) {
        throw new error("Got error la");
    }
}

function splitCodesToArray(data) {
    if (data) {
        return data.split("\r\n");
    }
    return [];
}

function randomizeAndFetch(codes) {
    if (codes) {
        const randomLine = Math.floor(Math.random() * codes.length); // Math.floor(0 - 1 * 2000xx)
        return codes[randomLine];
    }
    return "Bo code liao...";
}

function randomizeAndFetchRandomPage() {
    return Math.floor(Math.random() * totalPages);
}