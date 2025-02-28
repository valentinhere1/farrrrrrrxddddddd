const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send an announcement embed.")
        .addStringOption(option =>
            option.setName("title")
                .setDescription("The title of the announcement.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("The description of the announcement.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel to send the announcement to.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName("color")
                .setDescription("The color of the embed.")
                .setRequired(false)
                .addChoices(
                    { name: "Purple", value: "#9B59B6" },
                    { name: "Gold", value: "#FFD700" },
                    { name: "Red", value: "#E74C3C" },
                    { name: "Green", value: "#2ECC71" },
                    { name: "Yellow", value: "#F1C40F" },
                    { name: "Orange", value: "#E67E22" }
                )
        )
        .addStringOption(option =>
            option.setName("image")
                .setDescription("The URL of the image to include.")
                .setRequired(false)
        ),
    async execute(interaction, locale, lang) {
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const channel = interaction.options.getChannel("channel");
        const color = interaction.options.getString("color") || "#2ECC71";
        const imageURL = interaction.options.getString("image");

        const announceEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setFooter({
                text: "Farlands Network",
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        if (imageURL) {
            announceEmbed.setImage(imageURL);
        }

        try {
            await channel.send({ embeds: [announceEmbed] });
            await interaction.reply({
                content: lang[locale].announce_success.replace("{channel}", channel.toString()),
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error sending announcement:", error);
            await interaction.reply({
                content: lang[locale].announce_error,
                ephemeral: true,
            });
        }
    },
};