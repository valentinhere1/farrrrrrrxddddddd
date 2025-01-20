const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-ticket")
        .setDescription("Set up the ticket system in the current channel."),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("🎟️ Ticket System")
            .setDescription(
                "Choose a category below to open a ticket:\n\n" +
                "💎 **Commissions**\n" +
                "📑 **Support**\n" +
                "🚩 **Report Theft**"
            )
            .setFooter({ text: "Beyond Blocks Studios" });

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticket-category")
                .setPlaceholder("Select a category...")
                .addOptions([
                    {
                        label: "Commissions",
                        description: "Request custom commissions.",
                        value: "commissions",
                        emoji: "💎",
                    },
                    {
                        label: "Support",
                        description: "Get support for your issues.",
                        value: "support",
                        emoji: "📑",
                    },
                    {
                        label: "Report Theft",
                        description: "Report stolen builds or assets.",
                        value: "report",
                        emoji: "🚩",
                    },
                ])
        );

        await interaction.reply({ content: "✅ Ticket system setup complete!", ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [menu] });
    },
};
