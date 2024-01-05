module.exports.config = {
	name: "approve",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "approve the group by admin",
	commandCategory: "Admin",
    cooldowns: 5
};


const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
	if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
}
module.exports.handleReply = async function ({ event, api, Currencies, handleReply, Users, args }) {
    if (handleReply.author != event.senderID) return;
    const { body, threadID, messageID, senderID } = event;
    const { type } = handleReply;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let idBox = (args[0]) ? args[0] : threadID;
  switch (type) {
        case "pending": {
          switch (body) {
                case `A`: {
   			data.push(idBox);
   			fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
   			api.sendMessage(`» 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐁𝐨𝐱: ${idBox}\n𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝 𝐁𝐲 𝐘𝐨𝐮🙌🤓`, threadID, () => {
          dataP.splice(dataP.indexOf(idBox), 1);
    		fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
    	}, messageID)
        }
        }
      }
    }
  }
module.exports.run = async ({ event, api, args, Threads, handleReply, Users }) => {
	const { threadID, messageID, senderID } = event;
	let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let msg = "";
  var lydo = args.splice(2).join(" ");
  let idBox = (args[0]) ? args[0] : threadID;
        if (args[0] == "list" || args[0] == "l") {
    	msg = `=====「 GC THAT HAD BEEN APPROVED: ${data.length} 」 ====`;
    	let count = 0;
    	for (e of data) {
        let threadInfo = await api.getThreadInfo(e);
          let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
    		msg += `\n〘${count+=1}〙» ${threadName}\n${e}`;
    	}
    	api.sendMessage(msg, threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "a",
        })
    }, messageID);
        }
     else if (args[0] == "pending" || args[0] == "p") {
    	msg = `=====「 THREADS NEED TO BE APPROVE: ${dataP.length} 」 ====`;
    	let count = 0;
    	for (e of dataP) {
        let threadInfo = await api.getThreadInfo(e);
          let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
    		msg += `\n〘${count+=1}〙» ${threadName}\n${e}`;
    	}
    	api.sendMessage(msg, threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "pending",
        })
    }, messageID);
     }
       else if (args[0] == "help" || args[0] == "h") {
         const tst = (await Threads.getData(String(event.threadID))).data || {};
  const pb = (tst.hasOwnProperty("PREFIX")) ? tst.PREFIX : global.config.PREFIX;
  const nmdl = this.config.name
  const cre = this.config.credits
        return api.sendMessage(`=====「 APPROVE 」=====\n\n${pb}${nmdl} l/list => see list of approved boxes\n\n${pb}${nmdl} p/pending => see the list of unapproved boxes\n\n${pb}${nmdl} d/del => with ID to remove from bot used list\n\n${pb}${nmdl} => Attach an ID to browse that box\n\n⇒ ${cre} ⇐`, threadID, messageID);
       }
      
    else if (args[0] == "del" || args[0] == "d") {
    	idBox = (args[1]) ? args[1] : event.threadID;
      if (isNaN(parseInt(idBox))) return api.sendMessage("[ ERR ] Not a number", threadID, messageID);
    	if (!data.includes(idBox)) return api.sendMessage("[ ERR ] Box is not pre-approved!", threadID, messageID);
      api.sendMessage(`𝐘𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐛𝐫𝐨𝐰𝐬𝐢𝐧𝐠 𝐥𝐢𝐬𝐭 𝐛𝐲 𝐭𝐡𝐞 𝐚𝐝𝐦𝐢𝐧 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐫𝐞𝐚𝐬𝐨𝐧: ${lydo}`, idBox);
    	api.sendMessage(`𝐁𝐨𝐱 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭 𝐨𝐟 𝐚𝐥𝐥𝐨𝐰𝐞𝐝 𝐛𝐨𝐭𝐬`, threadID, () => {
    		data.splice(data.indexOf(idBox), 1);
    		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    	}, messageID)
    }
    else if (isNaN(parseInt(idBox))) api.sendMessage("[ ERR ] 𝐓𝐡𝐞 𝐈𝐃 𝐲𝐨𝐮 𝐞𝐧𝐭𝐞𝐫𝐞𝐝 𝐢𝐬 𝐧𝐨𝐭 𝐯𝐚𝐥𝐢𝐝", threadID, messageID);
    else if (data.includes(idBox)) api.sendMessage(`[ - ] ID ${idBox} 𝐩𝐫𝐞-𝐚𝐩𝐩𝐫𝐨𝐯𝐞𝐝!`, threadID, messageID);
   	else api.sendMessage("✨ApKa Group Approved Kar Diya Hai🙌.\n 🖤So Enjoy\n\n 💝🥀𝐎𝐖𝐍𝐄𝐑:- 𝕻𝖗𝖎𝖞𝖆𝖓𝖘𝖍 𝕽𝖆𝖏𝖕𝖚𝖙☜ 💫\n🖤\n😳𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝🤓:-  www.facebook.com/priyanshu.rajput.official\n\n👋For Any Kind Of Help Contact On Telegram  Username 👉 @Priyanshrajput😇", idBox, (error, info) => {
   		api.changeNickname(` 〖 ${global.config.PREFIX} 〗 ➺ ${(!global.config.BOTNAME) ? "" : global.config.BOTNAME}`, idBox, global.data.botID);
      const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
   let admID = "100037743553265";    
  
      api.getUserInfo(parseInt(admID), (err, data) => {
      if(err){ return console.log(err)}
     var obj = Object.keys(data);
    var firstname = data[obj].name.replace("@", "");  
      
      axios.get('https://anime.apibypriyansh.repl.co/img/anime').then(res => {
	let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
	let callback = function () {
      api.sendMessage({body: `🅱🅾🆃 🅸🆂 🅲🅾🅽🅵🅸🅶🆄🆁🅴 🅽🅾🆆\n\nB͜͡o͜͡t͜͡ : ${global.config.BOTNAME}\nᑭᖇEᖴI᙭🖲️: [ ${global.config.PREFIX} ] 𝐌𝐲 𝐩𝐫𝐞𝐟𝐢𝐱\n𝐔𝐬𝐞𝐫👼🏻: ${global.data.allUserID.length} 𝐌𝐞𝐦𝐞𝐛𝐞𝐫𝐬\n𝐆𝐫𝐨𝐮𝐩🥀: ${global.data.allThreadID.length} 𝐎𝐧𝐥𝐲\n𝐔𝐬𝐞🕹️ ${global.config.PREFIX}help fσr víєw cσmmαnd σf mч вσt👾\n\n🤠M̸a̸d̸e̸ B̸y̸: ${firstname}\n`, mentions: [{
                           tag: firstname,
                           id: admID,
                           fromIndex: 0,
                 }],
						attachment: fs.createReadStream(__dirname + `/cache/duyet.${ext}`)
					}, idBox,() => fs.unlinkSync(__dirname + `/cache/duyet.${ext}`));
				};
				request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/duyet.${ext}`)).on("close", callback);
			}) 
      })
   		if (error) return api.sendMessage("𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠, 𝐦𝐚𝐤𝐞 𝐬𝐮𝐫𝐞 𝐭𝐡𝐞 𝐢𝐝 𝐲𝐨𝐮 𝐞𝐧𝐭𝐞𝐫𝐞𝐝 𝐢𝐬 𝐯𝐚𝐥𝐢𝐝 𝐚𝐧𝐝 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐢𝐬 𝐢𝐧 𝐭𝐡𝐞 𝐛𝐨𝐱![𝐄𝐫𝐫𝐨𝐫]", threadID, messageID);
   		else {
   			data.push(idBox);
   			fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
   			api.sendMessage(`𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐁𝐨𝐱: ${idBox}\n𝐀𝐩𝐩𝐫𝐨𝐯𝐞𝐝 𝐁𝐲 𝐘𝐨𝐮🙌🤓`, threadID, () => {
          dataP.splice(dataP.indexOf(idBox), 1);
    		fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
    	}, messageID)
        }
   	});
          }