const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rolereactions')
    .setDescription(`Sends the reaction roles embed`),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You don't have permissions to execute this command!", ephemeral: true})

        const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle('**REACTION ROLES**')
        .setDescription(`
            **COLOR ROLES**\n
            🟦-Blue\n
            🟥-Red\n
            🟩-Green\n
            🟪-Purple\n
            🖤-Black\n
            🟨-Yellow\n
            🟧-Orange\n
            🩷-Pink\n
            **MENTION ROLES**\n
            👀-SNEAKPEEKS\n`)

        await interaction.channel.send({ embeds: [embed] }).then((sentEmbed) => {
            sentEmbed.react("🟦");
            sentEmbed.react("🟥");
            sentEmbed.react("🟩");
            sentEmbed.react("🟪");
            sentEmbed.react("🖤");
            sentEmbed.react("🟨");
            sentEmbed.react("🟧");
            sentEmbed.react("🩷");
            sentEmbed.react("👀");
        })
    }
}