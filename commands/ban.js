const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban a user from the server.",
    usage: "ban [@user] [reason]",
    async execute(message, args, locale, lang) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply(lang[locale].ban_missing_permissions);
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply(lang[locale].ban_bot_missing_permissions);
        }

        const userToBan = message.mentions.members.first();
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!userToBan) {
            return message.reply(lang[locale].ban_missing_user);
        }

        if (!userToBan.bannable) {
            return message.reply(lang[locale].ban_not_bannable);
        }

        try {
            await userToBan.ban({ reason });

            const banEmbed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle(lang[locale].ban_success.replace("{userTag}", userToBan.user.tag))
                .addFields(
                    { name: "Banned By", value: `${message.author.tag}`, inline: true },
                    { name: "Reason", value: reason, inline: true }
                )
                .setFooter({
                    text: "Farlands Network",
                    iconURL: message.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            message.channel.send({ embeds: [banEmbed] });
        } catch (error) {
            console.error("Error banning user:", error);
            message.reply(lang[locale].error_executing_command);
        }
    },
};