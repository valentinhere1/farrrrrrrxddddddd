const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const path = require("path");
const fs = require("fs");

// Ruta para guardar los logs de tickets
const logFilePath = path.join(__dirname, "../logs/ticket_logs.json");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === "ticket-category") {
            const categories = {
                commissions: { id: "1324497179972206704", emoji: "💎" },
                support: { id: "1324497179972206704", emoji: "📑" },
                report: { id: "1324497179972206704", emoji: "🚩" },
            };

            const ticketType = interaction.values[0];
            const user = interaction.user;

            // Validar categoría seleccionada
            const category = categories[ticketType];
            if (!category) {
                return interaction.reply({ content: "❌ Invalid category selected.", ephemeral: true });
            }

            // Verificar si el usuario ya tiene un ticket en la categoría
            const existingChannel = interaction.guild.channels.cache.find(
                (channel) =>
                    channel.name === `${category.emoji}-ticket-${user.username}` &&
                    channel.parentId === category.id
            );

            if (existingChannel) {
                return interaction.reply({
                    embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("❌ Ticket Already Open").setDescription(`You already have an open ticket: <#${existingChannel.id}>.`)],
                    ephemeral: true,
                });
            }

            // Crear canal del ticket
            const ticketChannel = await interaction.guild.channels.create({
                name: `${category.emoji}-ticket-${user.username}`,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: "1324502787010068520", // Rol administrativo
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            // Enviar mensaje inicial en el canal del ticket
            const ticketEmbed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle(`🎟️ Ticket Opened - ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)}`)
                .setDescription(`Hello <@${user.id}>, our team will assist you shortly.`)
                .setFooter({ text: "Beyond Blocks Studios" });

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("claim-ticket").setLabel("Claim Ticket").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("delete-ticket").setLabel("Delete Ticket").setStyle(ButtonStyle.Danger)
            );

            await ticketChannel.send({ content: `<@${user.id}>`, embeds: [ticketEmbed], components: [buttons] });

            // Guardar log del ticket
            saveTicketLog(ticketChannel.id, user.id, ticketType);

            await interaction.reply({
                embeds: [new EmbedBuilder().setColor("#00FF00").setTitle("✅ Ticket Created").setDescription(`Your ticket has been created: <#${ticketChannel.id}>.`)],
                ephemeral: true,
            });
        }
    },
};

// Guardar logs de tickets
function saveTicketLog(channelId, userId, ticketType) {
    const logEntry = { channelId, userId, ticketType, createdAt: new Date().toISOString() };

    let logs = [];
    try {
        if (fs.existsSync(logFilePath)) {
            logs = JSON.parse(fs.readFileSync(logFilePath, "utf8"));
        }
    } catch (error) {
        console.error("❌ Error reading ticket logs:", error);
    }

    logs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 4));
}
