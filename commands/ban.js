const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban a user from the server.",
    usage: "ban [@user] [reason]",
    async execute(message, args) {
        // Verificar si el autor tiene permisos para banear
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ You don't have permission to ban members.");
        }

        // Verificar si el bot tiene permisos para banear
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ I don't have permission to ban members.");
        }

        // Obtener el usuario a banear
        const userToBan = message.mentions.members.first();
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!userToBan) {
            return message.reply("❌ Please mention a user to ban.");
        }

        if (!userToBan.bannable) {
            return message.reply("❌ I cannot ban this user. They might have higher roles or special permissions.");
        }

        try {
            // Intentar banear al usuario
            await userToBan.ban({ reason });

            const banEmbed = new EmbedBuilder()
               .setColor("#FFD700")
                .setTitle("🔨 User Banned")
                .addFields(
                    { name: "Banned User", value: `${userToBan.user.tag}`, inline: true },
                    { name: "Banned By", value: `${message.author.tag}`, inline: true },
                    { name: "Reason", value: reason, inline: true }
                )
                .setTimestamp();

            // Confirmar el baneo en el canal
            message.channel.send({ embeds: [banEmbed] });
        } catch (error) {
            console.error("Error banning user:", error);
            message.reply("❌ An error occurred while trying to ban the user. Please try again.");
        }
    },
};
