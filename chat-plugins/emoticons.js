/* Emoticons! Thanks to CreaturePhil. */

'use strict';

const color = require('../config/color');
let demFeels = function () {};
demFeels.getEmotes = function () {
	return {};
};
try {
	demFeels = require('dem-feels');
} catch (e) {
	console.error(e);
}

exports.parseEmoticons = parseEmoticons;

// for travis build
if (typeof demFeels.extendEmotes === 'function') {
	// example extending emotes
	demFeels.extendEmotes({
		'(ditto)': 'https://cdn.betterttv.net/emote/554da1a289d53f2d12781907/2x',
		'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
		'feelsbn': 'http://i.imgur.com/wp51rIg.png',
		'feelshelper': 'http://i.imgur.com/YO1Wl8v.png',
		'feelsllama': 'http://i.imgur.com/oSLSk2I.gif',
		'feelsshrk': 'http://i.imgur.com/wHxMhjO.jpg',
		'datboi': 'http://i.imgur.com/rgIivM2.gif',
		'feelsevil': 'http://i.imgur.com/zOemc0n.png',
		'feelsveno': 'http://i.imgur.com/HdoPK9x.png',
		'kappa': 'http://i.imgur.com/ZxRU4z3.png',
		'feelstrump': 'http://i.imgur.com/tqW8s6Ys.jpg',
		'llamatea': 'http://i.imgur.com/nJnakEU.gif',
		'llamayawn': 'http://i.imgur.com/SVj8kBt.gif',
		'feelsilum': 'http://i.imgur.com/CnyGTTD.png',
		'respek': 'http://i.imgur.com/YvovaQn.jpg',
		'doge': 'http://i.imgur.com/cUWrvHv.png',
		'llamarawr': 'http://i.imgur.com/KWAQbPu.gif',
		'feelsmeta': 'http://i.imgur.com/cjiqtwE.jpg',
		'hitmonfeels': 'http://i.imgur.com/8lMcn9R.jpg',
		'feelspuke': 'http://i.imgur.com/npVJ6AP.jpg',
		'feelsgarde': 'http://i.imgur.com/CMwwvU7.png',
		'feelsworm': 'http://i.imgur.com/3fMjll2.png',
		'feelskawaii': 'http://i.imgur.com/Hz4w27G.gif',
		'feelsenpai': 'http://i.imgur.com/S7oIMzT.gif',
		'feelsspl': 'http://i.imgur.com/RIOKSJ3.gif',
		'lewd': 'http://i.imgur.com/STUuZyv.png',
		'feelscactus': 'http://i.imgur.com/qGRBSWl.jpg',
		'feelsemo': 'http://i.imgur.com/FPolh5d.png',
		'feelsya': 'http://i.imgur.com/bwEpZ8G.gif',
		'feelsnolife': 'http://i.imgur.com/VYkfmJJ.jpg',
		'feelstea': 'http://i.imgur.com/FCRsHKI.jpg',
		'feelscri': 'http://i.imgur.com/24VDnF5.jpg',
		'feelsinf': 'http://i.imgur.com/rrBTdFu.jpg',
		'vapo': 'http://i.imgur.com/7n3qNdu.gif',
		'feelsponge': 'http://i.imgur.com/lZrE3it.jpg',
		'feelsplank': 'http://i.imgur.com/2Se7cXW.jpg',
		'feelsash': 'http://i.imgur.com/Eo27Lqx.png',
		'feelsnaruto': 'http://i.imgur.com/fhgK5pb.png',
	});
}

const emotes = demFeels.getEmotes();

const emotesKeys = Object.keys(emotes).sort();

/**
* Parse emoticons in message.
*
* @param {String} message
* @param {Object} room
* @param {Object} user
* @param {Boolean} pm - returns a string if it is in private messages
* @returns {Boolean|String}
*/
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;

	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// escape HTML
	message = Tools.escapeHTML(message);

	// add emotes
	message = demFeels(message);

	// __italics__
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');

	// **bold**
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');

	let group = user.getIdentity().charAt(0);
	if (room.auth) group = room.auth[user.userid] || group;
	if (pm && !user.hiding) group = user.group;

	if (pm) return "<div class='chat' style='display:inline'>" + "<em class='mine'>" + message + "</em></div>";

	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";
	message = "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='" + hashColorWithCustoms(user.userid) + "'>" + user.name + ":</font></b>" + "</button><em class='mine'>" + message + "</em></div>";

	room.addRaw(message);
	return true;
}

/**
* Create a two column table listing emoticons.
*
* @return {String} emotes table
*/
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;

	for (let i = 0; i < len; i++) {
		emotes_list.push("<td style='padding: 5px; box-shadow: 0px 0px 2px rgb(255, 255, 255) inset; border-radius: 5px;'>" + "<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='25' width='25' style='vertical-align: middle;  padding-right: 5px;' />" + emotes_name[i] + "</td>");
	}

	for (let i = 0; i < len; i += 4) {
		let emoteOutput = [emotes_list[i], emotes_list[i + 1], emotes_list[i + 2], emotes_list[i + 3]];
		if (i < len) emotes_group_list.push("<tr>" + emoteOutput.join('') + "</tr>");
	}

	return (
		"<div class='infobox'><center><font style='font-weight: bold; text-decoration: underline; color: #1a1aff;'>SpacialGaze List of Emoticons:</font></center>" +
		"<div style='max-height: 300px; overflow-y: scroll; padding: 5px 0px;'><table style='background: rgb(0, 102, 255); border: 1px solid #ffffff;' width='100%'>" +
		emotes_group_list.join("") +
		"</table></div></div>"
	);
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("You are already blocking emoticons in private messages! To unblock, use /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("You are now blocking emoticons in private messages.");
	},
	blockemoticonshelp: ["/blockemoticons - Blocks emoticons in private messages. Unblock them with /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("You are not blocking emoticons in private messages! To block, use /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("You are no longer blocking emoticons in private messages.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Unblocks emoticons in private messages. Block them with /blockemoticons."],

	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Emoticons are disabled!</b><br />Emoticons will not work.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Emoticons are enabled!</b><br />Emoticons will work now.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

	rande: 'randemote',
	randemote: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let rng = Math.floor(Math.random() * emotesKeys.length);
		let randomEmote = emotesKeys[rng];
		this.sendReplyBox("<img src='" + emotes[randomEmote] + "' title='" + randomEmote + "' height='25' width='25' />");
	},
	randemotehelp: ["/randemote - Get a random emote."],
};
