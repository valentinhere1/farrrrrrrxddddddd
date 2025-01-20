const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a member from the server.",
    usage: "<@user> [reason]",
    async execute(message, args) {
        // Verificar si el autor tiene permisos para expulsar
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("❌ You don't have permission to kick members.");
        }

        // Verificar si el bot tiene permisos para expulsar
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("❌ I don't have permission to kick members.");
        }

        // Obtener el usuario mencionado
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(" ") || "No reason provided.";

        // Verificar si se mencionó un usuario
        if (!member) {
            return message.reply("❌ Please mention a user to kick.");
        }

        // Verificar si el usuario puede ser expulsado
        if (!member.kickable) {
            return message.reply("❌ I cannot kick this user. They might have a higher role or special permissions.");
        }

        try {
            // Intentar expulsar al usuario
            await member.kick(reason);

            // Crear un embed para confirmar la expulsión
            const kickEmbed = new EmbedBuilder()
                 .setColor("#FFD700")
                .setTitle("👢 User Kicked")
                .addFields(
                    { name: "Kicked User", value: `${member.user.tag}`, inline: true },
                    { name: "Kicked By", value: `${message.author.tag}`, inline: true },
                    { name: "Reason", value: reason, inline: true }
                )
                .setFooter({
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp();

            // Enviar el embed al canal
            message.channel.send({ embeds: [kickEmbed] });
        } catch (error) {
            console.error("Error kicking user:", error);
            message.reply("❌ An error occurred while trying to kick the user. Please try again.");
        }
    },
};
