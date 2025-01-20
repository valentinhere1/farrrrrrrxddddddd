const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Delete messages from a channel or a specific user.",
    usage: "<amount> [@user]",
    permissions: ["MANAGE_MESSAGES"],
    async execute(message, args) {
        // Verificar permisos del bot
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ I do not have permission to manage messages in this server.");
        }

        // Verificar permisos del usuario
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        // Validar cantidad de mensajes
        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return message.reply("❌ Please specify an amount between 1 and 100 messages to delete.");
        }

        // Verificar si hay un usuario especificado
        const member = message.mentions.members.first();

        if (member) {
            let deletedMessagesCount = 0;

            // Buscar mensajes del usuario en el canal actual
            try {
                const messages = await message.channel.messages.fetch({ limit: 100 });
                const userMessages = messages.filter((m) => m.author.id === member.id).toJSON(); // Convertir a un array
                const messagesToDelete = userMessages.slice(0, amount); // Limitar al número solicitado

                // Eliminar mensajes
                await message.channel.bulkDelete(messagesToDelete, true);
                deletedMessagesCount = messagesToDelete.length;

                // Confirmación
                message.channel.send(
                    `✅ Successfully deleted **${deletedMessagesCount} messages** from ${member.user.tag}.`
                ).then((msg) => setTimeout(() => msg.delete(), 5000));
            } catch (err) {
                console.error(err);
                return message.reply("❌ There was an error trying to delete messages from the user.");
            }
        } else {
            // Si no hay un usuario, eliminar mensajes del canal
            try {
                await message.channel.bulkDelete(amount, true);
                message.channel.send(
                    `✅ Successfully deleted **${amount} messages** from this channel.`
                ).then((msg) => setTimeout(() => msg.delete(), 5000));
            } catch (err) {
                console.error(err);
                return message.reply("❌ There was an error trying to delete messages in this channel.");
            }
        }
    },
};
