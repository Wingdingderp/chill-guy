const fs = require('node:fs');
const path = require('node:path');
const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const functionsExt = require('./functions');

const client = new Client({ partials: [Partials.Message, Partials.Reaction],intents: [ Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,       GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions, ] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'src/commands/.');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));

(async () => {
    for (file of functions) {
        require(`./src/functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
})();

var eCount = 0;
var getEventsStatus = false;
// Load handlers
fs.readdirSync('./src/Event Handler').forEach((dir) => {
	fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
		require(`./src/Event Handler/${dir}/${handler}`)(client);
		eCount++
		getEventsStatus = true
	}); 
  });


//Anti Crash System
process.on('unhandledRejection', (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
	// Optionally use functionsExt.generateError if it logs the details as desired
	functionsExt.generateError("Unhandled Rejection", reason.stack ? reason + '\n' + reason.stack : reason, promise);
  });
  
  process.on('uncaughtException', (err) => {
	console.error("Uncaught Exception:", err);
	// Optionally use functionsExt.generateError if it logs the details as desired
	functionsExt.generateError("Uncaught Exception", err.stack ? err + '\n' + err.stack : err);
  });
  
  process.on('uncaughtExceptionMonitor', (err, origin) => {
	console.error("Uncaught Exception Monitor:", err, "Origin:", origin);
	// Optionally use functionsExt.generateError if it logs the details as desired
	functionsExt.generateError("Uncaught Exception Monitor", err.stack ? err + '\n' + err.stack : err, origin);
});
  
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);


//Reaction Roles
const { ReactionRole } = require("discordjs-reaction-role");

// Make sure that all the  environment variables are declared.
["MEMBER_ROLE", "VERIFY_MESSAGE",
	"ROLE_MSG", "BLUE_ROLE", "RED_ROLE", "GREEN_ROLE", "PURPLE_ROLE", "BLACK_ROLE",
	"YELLOW_ROLE", "ORANGE_ROLE", "PINK_ROLE", "SNEEKPEEK_ROLE"
].forEach((env) => {
  if (!process.env[env]) {
	console.error(`Missing environment variable: ${env}`);
  }
});

const rr = new ReactionRole(client, [
	//Verify
	{ messageId: `${process.env.VERIFY_MESSAGE}`, reaction: "✅", roleId: `${process.env.MEMBER_ROLE}` }, 
	//Color Roles
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟦", roleId: `${process.env.BLUE_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟥", roleId: `${process.env.RED_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟩", roleId: `${process.env.GREEN_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟪", roleId: `${process.env.PURPLE_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🖤", roleId: `${process.env.BLACK_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟨", roleId: `${process.env.YELLOW_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🟧", roleId: `${process.env.ORANGE_ROLE}` }, 
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "🩷", roleId: `${process.env.PINK_ROLE}` }, 
	//Mention Roles
	{ messageId: `${process.env.ROLE_MSG}`, reaction: "👀", roleId: `${process.env.SNEEKPEEK_ROLE}` },
]);
