/**
 * @file Message Based Commands Handler
 */

const { Collection, ChannelType, Events } = require("discord.js");
const { prefix, owner } = require("../config.json");

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        const { client, content, author, channel } = message;

        if (author.bot || !content) return; // Ignorar mensajes de bots o vacíos.

        if (
            content === `<@${client.user.id}>` ||
            content === `<@!${client.user.id}>`
        ) {
            return require("../messages/onMention").execute(message);
        }

        const prefixRegex = new RegExp(
            `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
        );

        if (!prefixRegex.test(content.toLowerCase())) return;

        const [matchedPrefix] = content.toLowerCase().match(prefixRegex);
        const args = content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        if (!command) return;

        if (command.ownerOnly && author.id !== owner) {
            return message.reply("¡Este comando es solo para el dueño del bot!");
        }

        if (command.guildOnly && channel.type === ChannelType.DM) {
            return message.reply("¡Este comando no funciona en DMs!");
        }

        if (command.permissions && channel.type !== ChannelType.DM) {
            const authorPerms = channel.permissionsFor(author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply("¡No tienes permisos para ejecutar este comando!");
            }
        }

        if (command.args && !args.length) {
            let reply = `No proporcionaste argumentos, ${author}!`;
            if (command.usage) {
                reply += `\nEl uso correcto sería: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.reply(reply);
        }

        const { cooldowns } = client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(author.id)) {
            const expirationTime = timestamps.get(author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    `Espera ${timeLeft.toFixed(1)} segundo(s) antes de usar \`${command.name}\` nuevamente.`
                );
            }
        }

        timestamps.set(author.id, now);
        setTimeout(() => timestamps.delete(author.id), cooldownAmount);

        // Verificar si el comando tiene una función `execute` antes de ejecutarlo
        if (command.execute) {
            try {
                await command.execute(message, args, client);
            } catch (error) {
                console.error(error);
                message.reply("❌ Hubo un error al ejecutar ese comando.");
            }
        }
    },
};
