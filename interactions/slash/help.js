const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands of the bot or get detailed info about a specific command.")
    .addStringOption(option =>
      option.setName("command")
        .setDescription("The command to get details about.")
        .setRequired(false)
    ),
  async execute(interaction, locale, lang) {
    const { commands } = interaction.client;

    const commandName = interaction.options.getString("command");
    if (commandName) {
      const command =
        commands.get(commandName) ||
        commands.find((c) => c.aliases && c.aliases.includes(commandName));

      if (!command) {
        return interaction.reply({
          content: lang[locale].help_command_not_found,
          ephemeral: true,
        });
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
                  value: `\`/${command.name} ${command.usage}\``,
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
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [commandEmbed], ephemeral: true });
    }

    const prefixCommands = commands.filter(cmd => !cmd.data);
    const slashCommands = interaction.client.slashCommands;

    const helpEmbed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle(lang[locale].help_title)
      .setDescription(lang[locale].help_description)
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
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
};