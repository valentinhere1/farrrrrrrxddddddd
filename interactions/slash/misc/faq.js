const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faq")
        .setDescription("Provides answers to frequently asked questions."),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700") // Blue for an informative look
            .setTitle("📋 Frequently Asked Questions")
            .addFields(
                { name: "❓ How do I order a build?", value: "..." },
                { name: "⏱️ How long does it take to complete a project?", value: "..." },
                { name: "💰 What are the costs?", value: "..." },
                { name: "🌍 ????", value: "..." },
                { name: "🎨 ????", value: "..." }
            )
            .setFooter({ text: "Have more questions? Feel free to ask our team!", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
