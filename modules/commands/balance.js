module.exports.config = {
	name: "balance",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Check Balance(tag)",
	commandCategory: "economy",
	usages: "[Tag]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
	const { threadID, messageID, senderID, mentions } = event;

	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
		return api.sendMessage(`Amount of money you currently have: ${money} dollars`, threadID);
	}
	else if (Object.keys(event.mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		if (!money) money = 0;
		return api.sendMessage({
			body: `Your current money is ${mentions[mention].replace("@", "")}: ${money} coin.`,
			mentions: [{
				tag: mentions[mention].replace("@", ""),
				id: mention
			}]
		}, threadID, messageID);
	}
	else if (Object.keys(event.mentions).length > 0) {
		const mention = Object.keys(mentions);
		var msg = "";
		for (const value of mention) {
			var money = (await Currencies.getData(value)).money;
			if (!money) money = 0;
			msg += (` - ${mentions[value].replace("@", "")}: ${money} coin\n`);
		};
		return api.sendMessage(`Amount of your membership: \n${msg}`, threadID, messageID);
	}
	else return global.utils.throwError(this.config.name, threadID, messageID);
}