const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "mute",
    description: "Mute a member and prevent them from speaking.",
    usage: "<@user>",
    permissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    async execute(message, args, locale, lang) {
        const member = message.mentions.members.first();
        if (!member) return message.reply(lang[locale].mute_missing_user);

        let mutedRole = message.guild.roles.cache.find((role) => role.name === "Muted");
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.roles.create({
                    name: "Muted",
                    color: "#808080",
                    permissions: [],
                });

                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(mutedRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                    });
                });

                message.channel.send(lang[locale].mute_role_created);
            } catch (error) {
                console.error(error);
                return message.reply(lang[locale].error_executing_command);
            }
        }

        try {
            const rolesToRemove = member.roles.cache.filter((role) => role.id !== mutedRole.id && role.name !== "@everyone");
            await member.roles.remove(rolesToRemove);

            await member.roles.add(mutedRole);

            const muteEmbed = new EmbedBuilder()
                .setColor("#2ECC71")
                .setTitle(lang[locale].mute_success.replace("{userTag}", member.user.tag))
                .setFooter({
                    text: "Farlands Network",
                    iconURL: message.client.user.displayAvatarURL(),
                })
                .setTimestamp();

            message.channel.send({ embeds: [muteEmbed] });
        } catch (error) {
            console.error(error);
            return message.reply(lang[locale].error_executing_command);
        }
    },
};