const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verifymessage')
    .setDescription(`Sends the verify message`),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You don't have permissions to execute this command!", ephemeral: true})

            interaction.deferReply();
            interaction.deleteReply();
            interaction.channel.send({ content: `Even though I'm a chill guy, I do require you to verify you have read and understood the rules by reacting with the ✅ above before you can access the rest of the server. Also, don't forget to head over to <#1317901376554143905> to change the color of your name and opt to be pinged for sneak-peaks or other goodies!` }).then(sentMessage => {
            sentMessage.react("✅");

        })
    }
}