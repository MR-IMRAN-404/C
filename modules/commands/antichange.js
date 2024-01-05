module.exports.config = {
  name: "antichange",
  version: "1.0.0",
  credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
  hasPermssion: 2,
  description: "Ban 1 something in the group",
  usages: "< nickname/boximage/boxname >",
  commandCategory: "Box chat",
  dependencies: {
    "imgbb-uploader": "",
    "axios": "",
    "fs": ""
  }
};

const isBoolean = val => 'boolean' === typeof val;

module.exports.run = async ({
  api, event, args, Threads
}) => {
  try {
    const {
      threadID,
      messageID,
      senderID
    } = event;
    if (!await global.modelAntiSt.findOne({
      where: {
        threadID
      }
    }))
      await global.modelAntiSt.create({
        threadID, data: {}
      });


    try {
      if (senderID == threadID)
        return;
      const data = (await global.modelAntiSt.findOne({
        where: {
          threadID
        }
      })).data;
      if (!data.hasOwnProperty("antist")) {
        data.antist = {};
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
          data
        });
      }
      if (!data.hasOwnProperty("antist_info")) {
        data.antist_info = {};
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
          data
        });
      }

      const setting = args[0]?.toLowerCase();
      const _switch = args[1]?.toLowerCase();
      switch (setting) {
        case 'nickname': {
          if (_switch == "on")
            data.antist.nickname = true;
          else if (_switch == "off")
            data.antist.nickname = false;
          else
            data.antist.nickname = !data.antist.nickname;

          if (data.antist.nickname === true) {
            const _info = data.antist_info.nicknames ? data.antist_info : (await api.getThreadInfo(threadID) || {});
            const {
              nicknames
            } = _info;
            if (!nicknames) return api.sendMessage("[ 𝗠𝗢𝗗𝗘 ] -> Kuch to problem hai Boss edhar", threadID);
            data.antist_info.nicknames = nicknames;
          } else {
            data.antist_info.nicknames = null;
          }
          break;
        }
        case 'boximage': {
          if (_switch == "on")
            data.antist.boximage = true;
          else if (_switch == "off")
            data.antist.boximage = false;
          else
            data.antist.boximage = !(isBoolean(data.antist.boximage) ? data.antist.boximage : false);

          if (data.antist.boximage == true) {
            const fs = global.nodemodule["fs"];
            const axios = global.nodemodule["axios"];
            const uploadIMG = global.nodemodule["imgbb-uploader"];

            const _info = data.antist_info.imageSrc ? data.antist_info : (await api.getThreadInfo(threadID) || {});
            const {
              imageSrc
            } = _info;
            if (!imageSrc) return api.sendMessage("Pahle group ki dp to lagao.....", threadID);
            const imageStream = (await axios.get(imageSrc, {
              responseType: 'arraybuffer'
            })).data;
            const pathToImage = __dirname + `/cache/imgbb_antist_${Date.now()}.png`;
            fs.writeFileSync(pathToImage, Buffer.from(imageStream, 'utf-8'));
            const {
              url
            } = await uploadIMG("c4847250684c798013f3c7ee322d8692", pathToImage);

            fs.unlinkSync(pathToImage);

            data.antist_info.imageSrc = url;
          } else {
            data.antist_info.imageSrc = null;
          }

          break;
        }
        case 'boxname': {
          if (_switch == "on")
            data.antist.boxname = true;
          else if (_switch == "off")
            data.antist.boxname = false;
          else
            data.antist.boxname = !(isBoolean(data.antist.boxname) ? data.antist.boxname : false);


          if (data.antist.boxname === true) {
            const _info = data.antist_info.name ? data.antist_info : (await api.getThreadInfo(threadID) || {});
            const {
              name
            } = _info;
            if (!name) return api.sendMessage("Group ka name to rakho pahle", threadID);
            data.antist_info.name = name;
          } else {
            data.antist_info.name = null;
          }

          break;
        }
        case "theme": {
          if (_switch == "on")
            data.antist.theme = true;
          else if (_switch == "off")
            data.antist.theme = false;
          else
            data.antist.theme = !(isBoolean(data.antist.theme) ? data.antist.theme : false);

          if (!global.client.antistTheme)
            global.client.antistTheme = {};
          if (data.antist.theme === true)
            return api.sendMessage('Group setting me jake default theme select karo ', threadID, (err, info) => {
              global.client.antistTheme[threadID] = {
                threadID,
                messageID: info.messageID,
                author: senderID,
                run: async function (themeID, accessibility_label) {
                  delete global.client.antistTheme[threadID];
                  const data = (await global.modelAntiSt.findOne({
                    where: {
                      threadID
                    }
                  })).data;
                  if (!data.hasOwnProperty("antist")) {
                    data.antist = {};
                    await global.modelAntiSt.findOneAndUpdate({
                      threadID
                    }, {
                      data
                    });
                  }
                  if (!data.hasOwnProperty("antist_info")) {
                    data.antist_info = {};
                    await global.modelAntiSt.findOneAndUpdate({
                      threadID
                    }, {
                      data
                    });
                  }

                  data.antist.theme = true;
                  data.antist_info.themeID = themeID;
                  api.sendMessage('Saved default theme as: ' + accessibility_label, threadID);
                  await global.modelAntiSt.findOneAndUpdate({
                    threadID
                  }, {
                    data
                  });
                }
              };
            });
          break;
        }
        case "emoji": {
          if (_switch == "on")
            data.antist.emoji = true;
          else if (_switch == "off")
            data.antist.emoji = false;
          else
            data.antist.emoji = !(isBoolean(data.antist.emoji) ? data.antist.emoji : false);


          if (data.antist.emoji === true) {
            const _info = data.antist_info.emoji ? data.antist_info : (await api.getThreadInfo(threadID) || {});
            const {
              emoji
            } = _info;
            data.antist_info.emoji = emoji;
          } else {
            data.antist_info.emoji = null;
          }

          break;
        }

        default:
          return api.sendMessage(`🛠 ==== [ 𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗧𝗜𝗢𝗡𝗦 ] ====🛠\n━━━━━━━━━━━━━━━━━\n\n• 𝗔𝗻𝘁𝗶𝗰𝗵𝗮𝗻𝗴𝗲 𝗯𝗼𝘅𝗻𝗮𝗺𝗲: 𝗘𝗻𝗮𝗯𝗹𝗲/𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗯𝗮𝗻 𝗼𝗻 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲 𝗿𝗲𝗽𝗹𝗮𝗰𝗲𝗺𝗲𝗻𝘁\n• 𝗔𝗻𝘁𝗶𝗰𝗵𝗮𝗻𝗴𝗲 𝗯𝗼𝘅𝗶𝗺𝗮𝗴𝗲: 𝗘𝗻𝗮𝗯𝗹𝗲/𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗯𝗮𝗻 𝗼𝗻 𝗴𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝗿𝗲𝗽𝗹𝗮𝗰𝗲𝗺𝗲𝗻𝘁\n• 𝗔𝗻𝘁𝗶𝗰𝗵𝗮𝗻𝗴𝗲 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲: 𝗘𝗻𝗮𝗯𝗹𝗲/𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗯𝗮𝗻 𝗼𝗻 𝗰𝗵𝗮𝗻𝗴𝗶𝗻𝗴 𝗺𝗲𝗺𝗯𝗲𝗿 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲\n• 𝗔𝗻𝘁𝗶𝗰𝗵𝗮𝗻𝗴𝗲 𝗲𝗺𝗼𝗷𝗶: 𝗘𝗻𝗮𝗯𝗹𝗲/𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗯𝗮𝗻 𝗼𝗻 𝗰𝗵𝗮𝗻𝗴𝗶𝗻𝗴 𝗴𝗿𝗼𝘂𝗽 𝗶𝗰𝗼𝗻\n•𝗔𝗻𝘁𝗶𝗰𝗵𝗮𝗻𝗴𝗲 𝘁𝗵𝗲𝗺𝗲: 𝗘𝗻𝗮𝗯𝗹𝗲/𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗯𝗮𝗻 𝗼𝗻 𝗰𝗵𝗮𝗻𝗴𝗶𝗻𝗴 𝘁𝗵𝗲𝗺𝗲 𝗯𝗼𝘅\n•𝗕𝗼𝘁 𝘂𝗻𝗱𝗲𝗿 𝗽𝗿𝗼𝘁𝗲𝗰𝘁𝗲𝗱 𝗯𝘆 𝗣𝗿𝗶𝘆𝗮𝗻𝘀𝗵 𝗥𝗮𝗷𝗽𝘂𝘁 🖤`, threadID);
      }

      await global.modelAntiSt.findOneAndUpdate({
        threadID
      }, {
        data
      });
      return api.sendMessage(`[ 𝗠𝗢𝗗𝗘 ] -> Antichange mode ${setting}: ${data.antist[setting] ? 'Turn on' : 'Turn off'}`, threadID);
    } catch (e) {
      console.log(e);
      api.sendMessage("[ 𝗠𝗢𝗗𝗘 ] -> Kuch to problem hai Boss edhar", threadID);
    }
  }
  catch (err) {
    console.log(err)
  }
};