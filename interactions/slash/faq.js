const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faq")
        .setDescription("Provides answers to frequently asked questions."),
    async execute(interaction, locale, lang) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle(lang[locale].faq_title)
            .addFields(
                { name: "❓ pregunta 1", value: ".................." },
                { name: "⏱️ pregunta 2", value: "......" },
                { name: "💰 pregunta 3", value: "........." },
                { name: "🌍 pregunta 4", value: "........." },
                { name: "🎨 pregunta 5", value: "........." }
            )
            .setFooter({ text: lang[locale].faq_footer, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};