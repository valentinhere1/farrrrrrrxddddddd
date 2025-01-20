const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the shop link."),
    async execute(interaction) {
        const shopEmbed = new EmbedBuilder()
            .setColor("#FFD700") // Gold color
            .setTitle("🛒 Go to the Shop!")
            .setDescription("Click the link below to visit our shop:\n[**Beyond Blocks Shop**](https://)") // Replace with your shop link
            .setFooter({
                text: "Beyond Blocks Studios",
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        // Reply to the interaction with the embed
        await interaction.reply({ embeds: [shopEmbed] });
    },
};
