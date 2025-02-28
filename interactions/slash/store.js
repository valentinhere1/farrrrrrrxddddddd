const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("store")
        .setDescription("View the store link."),
    async execute(interaction, locale, lang) {
        const shopEmbed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle(lang[locale].store_title)
            .setDescription(lang[locale].store_description)
            .setFooter({
                text: "Farlands Network",
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.reply({ embeds: [shopEmbed], ephemeral: true });
    },
};