const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a member from the server.",
    usage: "<@user> [reason]",
    async execute(message, args, locale, lang) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply(lang[locale].kick_missing_permissions);
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply(lang[locale].kick_bot_missing_permissions);
        }

        const member = message.mentions.members.first();
        const reason = args.slice(1).join(" ") || "No reason provided.";

        if (!member) {
            return message.reply(lang[locale].kick_missing_user);
        }

        if (!member.kickable) {
            return message.reply(lang[locale].kick_not_kickable);
        }

        try {
            await member.kick(reason);

            const kickEmbed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle(lang[locale].kick_success.replace("{userTag}", member.user.tag))
                .addFields(
                    { name: "Kicked By", value: `${message.author.tag}`, inline: true },
                    { name: "Reason", value: reason, inline: true }
                )
                .setFooter({
                    text: "Farlands Network",
                    iconURL: message.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            message.channel.send({ embeds: [kickEmbed] });
        } catch (error) {
            console.error("Error kicking user:", error);
            message.reply(lang[locale].error_executing_command);
        }
    },
};