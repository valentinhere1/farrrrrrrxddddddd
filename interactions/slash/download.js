const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('Descarga el link subido y lo muestra de forma efímera.'),
  async execute(interaction, locale, lang) {
    const filePath = path.join(process.cwd(), 'link.json');

    if (!fs.existsSync(filePath)) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("❌ Error")
        .setDescription(lang[locale].download_no_file)
        .setFooter({
          text: "Farlands Network",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!data.link) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("❌ Error")
        .setDescription(lang[locale].download_invalid_link)
        .setFooter({
          text: "Farlands Network",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const downloadEmbed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle(lang[locale].download_success)
      .setDescription(`Aquí tienes el link:`)
      .addFields(
        { name: "🔗 Link", value: `[${data.link}](${data.link})`, inline: false }
      )
      .setFooter({
        text: "Farlands Network",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [downloadEmbed], ephemeral: true });
  },
};