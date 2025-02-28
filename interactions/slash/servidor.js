const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("servidor")
        .setDescription("Verifica el estado de los servidores de Farlands.")
        .addStringOption(option =>
            option.setName("servidor")
                .setDescription("Elige el servidor para verificar.")
                .setRequired(true)
                .addChoices(
                    { name: "Medieval", value: "medieval.farlands.club" },
                    { name: "Survival", value: "play.farlands.club" }
                )
        ),
    async execute(interaction, locale, lang) {
        const serverAddress = interaction.options.getString("servidor");

        try {
            const { players, version } = await status(serverAddress, 25565, { timeout: 5000 });

            const serverEmbed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle(lang[locale].server_online.replace("{server}", serverAddress))
                .addFields(
                    { name: "Jugadores en línea", value: `${players.online}/${players.max}`, inline: true },
                    { name: "Versión", value: version.name, inline: true },
                    { name: "Estado", value: "🟢 En línea", inline: true }
                )
                .setFooter({
                    text: "Farlands Network",
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [serverEmbed] });
        } catch (error) {
            const serverEmbed = new EmbedBuilder()
                .setColor("#E74C3C")
                .setTitle(lang[locale].server_offline.replace("{server}", serverAddress))
                .addFields(
                    { name: "Estado", value: "🔴 Apagado o detenido", inline: true }
                )
                .setFooter({
                    text: "Farlands Network",
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [serverEmbed] });
        }
    },
};