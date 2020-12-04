require('dotenv').config();
const javbus = require('node-javbus')();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const javbusWeb = "https://javbus.com/en/";
let dailyCodes = [];

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
    if (msg.content.toLowerCase() === '!cotd') {
        let code = randomizeAndFetch(dailyCodes);
        queryJAVBus(code).then(result => {
            msg.channel.send(result.title);
            msg.channel.send("***Model: ***" + result.stars.map(star => star.name).join(", "));
            msg.channel.send(result.cover);
        }, err => {
            msg.reply("Code kenot found or got error, please stop being so horny...", err.message);
            console.error("Error Occured, with code ", code);
        })
    } else if (msg.content.toLowerCase().startsWith('[') && msg.content.toLowerCase().endsWith(']')) {
        let codeOnDemand = msg.content.replace('[', '').replace(']', '');
        queryJAVBus(codeOnDemand).then(result => {
            msg.channel.send(result.title);
            msg.channel.send("***Model: ***" + result.stars.map(star => star.name).join(", "));
            msg.channel.send(result.cover);
        }, err => {
            msg.reply("Code kenot found or got error, please stop being so horny...", err.message);
            console.error("Error Occured, with code ", code);
        });
    }
});

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