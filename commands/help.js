const { EmbedBuilder } = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {
	name: "help",
	description: "List all commands of the bot or get detailed info about a specific command.",
	aliases: ["commands"],
	usage: "[command name]",
	cooldown: 5,

	execute(message, args) {
		const { commands } = message.client;

		// Si no se proporcionan argumentos, mostrar la lista de todos los comandos
		if (!args.length) {
			/**
			 * Embed para mostrar todos los comandos
			 */
			const helpEmbed = new EmbedBuilder()
				.setColor("#FFD700")
				.setTitle("📜 List of Commands")
				.setDescription(
					"`" + commands.map((command) => command.name).join("`, `") + "`"
				)
				.addFields([
					{
						name: "Usage",
						value: `Use \`${prefix}help [command name]\` to get details about a specific command.`,
					},
				])
				.setFooter({
					text: "Beyond Blocks Studios",
					iconURL: message.client.user.displayAvatarURL(),
				})
				.setTimestamp();

			// Enviar el embed al mismo canal
			return message.channel.send({ embeds: [helpEmbed] });
		}

		// Si se proporciona un argumento, buscar el comando específico
		const name = args[0].toLowerCase();
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		// Si no se encuentra el comando, enviar un mensaje de error
		if (!command) {
			return message.reply({
				content: "❌ That's not a valid command!",
			});
		}

		/**
		 * Embed para mostrar detalles de un comando específico
		 */
		const commandEmbed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`📖 Command: \`${command.name}\``)
			.setDescription(command.description || "No description provided.")
			.addFields([
				...(command.aliases
					? [
							{
								name: "Aliases",
								value: `\`${command.aliases.join(", ")}\``,
								inline: true,
							},
					  ]
					: []),
				...(command.usage
					? [
							{
								name: "Usage",
								value: `\`${prefix}${command.name} ${command.usage}\``,
								inline: true,
							},
					  ]
					: []),
				{
					name: "Cooldown",
					value: `${command.cooldown || 3} second(s)`,
					inline: true,
				},
			])
			.setFooter({
				text: `Requested by ${message.author.tag}`,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTimestamp();

		// Enviar el embed al mismo canal
		message.channel.send({ embeds: [commandEmbed] });
	},
};
