"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("request"));
const discord = __importStar(require("discord.js"));
const bot = new discord.Client;
const config = {
    "ip": "",
    "port": "",
    "token": "",
    "refreshtime": 5,
};


console.log(`Starting bot...`);
bot.on("message", message => {
    if (message.content == "update" && message.member.roles.has(config.devteam)) {
        if (message.deletable) {
            message.delete();
        }
        updatePlayers();
        message.reply("人數更新成功");
    }
    else if (message.content == "!線上人數") {
        const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const color = [
            randomBetween(0, 255),
            randomBetween(0, 255),
            randomBetween(0, 255),
        ];
        http.get(`http://${config.ip}:${config.port}/dynamic.json`, { json: true }, (error, res, data) => {
            if (error) {
                if (error.code == "ECONNREFUSED" || error.code == "ETIMEDOUT") {
                    message.reply(`資料偵測錯誤\n**原因:*\n伺服器關閉 or 機器人錯誤`)
                }
            }
            message.channel.send(`**伺服器在線人數:**${data.clients}\n**伺服器可容納人數:**${data.sv_maxclients}`);
        });
    }
});

bot.login(config.token);
let updatePlayerInterval = setInterval(() => updatePlayers(), config.refreshtime * 1000);


function updatePlayers() {
    http.get(`http://${config.ip}:${config.port}/dynamic.json`, { json: true }, (err, res, data) => {
        if (err) {
            if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                bot.user.setActivity(`伺服器關閉中.....`, { type: 'WATCHING' });
                return;
            }
        }
        bot.user.setActivity(`伺服器 ${data.clients} / ${data.sv_maxclients}`, { type: 'WATCHING' });
        console.log(`${new Date().toISOString()}: ${data.clients} / ${data.sv_maxclients}`);
    });
}
