const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Delete messages from a channel or a specific user.",
    usage: "<amount> [@user]",
    permissions: ["MANAGE_MESSAGES"],
    async execute(message, args, locale, lang) {
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply(lang[locale].clear_bot_missing_permissions);
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply(lang[locale].clear_missing_permissions);
        }

        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return message.reply(lang[locale].clear_invalid_amount);
        }

        const member = message.mentions.members.first();

        if (member) {
            try {
                const messages = await message.channel.messages.fetch({ limit: 100 });
                const userMessages = messages.filter((m) => m.author.id === member.id).toJSON();
                const messagesToDelete = userMessages.slice(0, amount);

                await message.channel.bulkDelete(messagesToDelete, true);
                message.channel.send(
                    lang[locale].clear_success_user
                        .replace("{count}", messagesToDelete.length)
                        .replace("{userTag}", member.user.tag)
                ).then((msg) => setTimeout(() => msg.delete(), 5000));
            } catch (err) {
                console.error(err);
                return message.reply(lang[locale].error_executing_command);
            }
        } else {
            try {
                await message.channel.bulkDelete(amount, true);
                message.channel.send(
                    lang[locale].clear_success_channel.replace("{count}", amount)
                ).then((msg) => setTimeout(() => msg.delete(), 5000));
            } catch (err) {
                console.error(err);
                return message.reply(lang[locale].error_executing_command);
            }
        }
    },
};