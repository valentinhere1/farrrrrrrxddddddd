const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "List all commands of the bot or get detailed info about a specific command.",
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,

  execute(message, args, locale, lang) {
    const { commands } = message.client;

    // Si no se proporcionan argumentos, mostrar la lista de todos los comandos
    if (!args.length) {
      const prefixCommands = commands.filter(cmd => !cmd.data);
      const slashCommands = message.client.slashCommands;

      const helpEmbed = new EmbedBuilder()
        .setColor("#2ECC71")
        .setTitle(lang[locale].help_title)
        .setDescription(lang[locale].help_description.replace("{prefix}", message.client.prefix))
        .addFields([
          {
            name: "🔹 Prefix Commands",
            value: prefixCommands.map(cmd => `\`${cmd.name}\``).join(", ") || "No prefix commands available.",
          },
          {
            name: "🔹 Slash Commands",
            value: slashCommands.map(cmd => `\`/${cmd.data.name}\``).join(", ") || "No slash commands available.",
          },
        ])
        .setFooter({
          text: "Farlands Network",
          iconURL: message.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return message.channel.send({ embeds: [helpEmbed] });
    }

    // Si se proporciona un argumento, buscar el comando específico
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply(lang[locale].help_command_not_found);
    }

    const commandEmbed = new EmbedBuilder()
      .setColor("#2ECC71")
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
                value: `\`${message.client.prefix}${command.name} ${command.usage}\``,
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

    message.channel.send({ embeds: [commandEmbed] });
  },
};