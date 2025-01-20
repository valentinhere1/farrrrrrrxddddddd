const { EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

const logFilePath = path.join(__dirname, "../logs/ticket_logs.json");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isButton()) {
            const { customId, channel, user } = interaction;

            if (customId === "claim-ticket") {
                await interaction.reply({ content: `This ticket has been claimed by <@${user.id}>.`, ephemeral: false });
            }

            if (customId === "delete-ticket") {
                // Eliminar canal y log del ticket
                removeTicketLog(channel.id);
                await interaction.reply({ content: "This ticket will be deleted in 5 seconds.", ephemeral: true });

                setTimeout(() => {
                    channel.delete().catch(console.error);
                }, 5000);
            }
        }
    },
};

// Eliminar log del ticket
function removeTicketLog(channelId) {
    let logs = [];
    try {
        if (fs.existsSync(logFilePath)) {
            logs = JSON.parse(fs.readFileSync(logFilePath, "utf8"));
        }
    } catch (error) {
        console.error("❌ Error reading ticket logs:", error);
    }

    logs = logs.filter((log) => log.channelId !== channelId);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 4));
}
