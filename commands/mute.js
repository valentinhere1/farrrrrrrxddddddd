const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "mute",
    description: "Mute a member and prevent them from speaking.",
    usage: "<@user>",
    permissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    async execute(message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ You need to mention a user to mute.");

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

                message.channel.send("Created the 'Muted' role and configured channel permissions.");
            } catch (error) {
                console.error(error);
                return message.reply("There was an error creating the 'Muted' role.");
            }
        }

        // Crear el canal para muteados si no existe
        let mutedChannel = message.guild.channels.cache.find((channel) => channel.name === "muted-chat");
        if (!mutedChannel) {
            try {
                mutedChannel = await message.guild.channels.create({
                    name: "muted-chat",
                    type: 0, // Guild Text Channel
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: mutedRole.id,
                            allow: [PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });

                message.channel.send("✅ Created the 'muted-chat' channel for muted members.");
            } catch (error) {
                console.error(error);
                return message.reply("❌ There was an error creating the 'muted-chat' channel.");
            }
        }

        // Quitar todos los roles del miembro excepto el rol Muted
        try {
            const rolesToRemove = member.roles.cache.filter((role) => role.id !== mutedRole.id && role.name !== "@everyone");
            await member.roles.remove(rolesToRemove);

            // Asignar el rol de mute
            await member.roles.add(mutedRole);
            message.channel.send(`✅ ${member.user.tag} has been muted. All other roles have been removed.`);
        } catch (error) {
            console.error(error);
            return message.reply("❌ There was an error muting the user and removing roles.");
        }
    },
};
