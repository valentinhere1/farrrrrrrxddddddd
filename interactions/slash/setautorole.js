const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(process.cwd(), "autorole.json");

function readAutoroleConfig() {
  if (!fs.existsSync(configFilePath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
  } catch (error) {
    console.error("Error al leer autorole.json:", error);
    return {};
  }
}

function writeAutoroleConfig(config) {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setautorole")
    .setDescription("Configura los roles automáticos para usuarios y bots.")
    .addRoleOption((option) =>
      option
        .setName("userrole")
        .setDescription("Rol que se asignará automáticamente a los usuarios.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("botrole")
        .setDescription("Rol que se asignará automáticamente a los bots.")
        .setRequired(true)
    ),
  async execute(interaction, locale, lang) {
    const userRole = interaction.options.getRole("userrole");
    const botRole = interaction.options.getRole("botrole");

    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (
      userRole.position >= botHighestRole.position ||
      botRole.position >= botHighestRole.position
    ) {
      return interaction.reply({
        content: lang[locale].setautorole_hierarchy_error,
        ephemeral: true,
      });
    }

    const config = readAutoroleConfig();

    if (config[interaction.guild.id]) {
      const currentConfig = config[interaction.guild.id];
      if (
        currentConfig.userRole === userRole.id &&
        currentConfig.botRole === botRole.id
      ) {
        return interaction.reply({
          content: lang[locale].setautorole_no_changes,
          ephemeral: true,
        });
      }
    }

    config[interaction.guild.id] = {
      userRole: userRole.id,
      botRole: botRole.id,
    };
    try {
      writeAutoroleConfig(config);
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      return interaction.reply({
        content: lang[locale].error_executing_command,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: lang[locale].setautorole_success
        .replace("{userRole}", userRole.toString())
        .replace("{botRole}", botRole.toString()),
      ephemeral: true,
    });
  },
};