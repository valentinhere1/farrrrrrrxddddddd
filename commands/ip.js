const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ip",
    description: "Get the IP address of the Partner server.",
    execute(message, args, locale, lang) {
        const ips = [
            "🌐 **Survival IP:** `play.farlands.club`",
            "🌐 **Medieval IP:** `medieval.farlands.club`",
        ];

        const ipEmbed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle(lang[locale].ip_title)
            .setDescription(lang[locale].ip_description + "\n" + ips.join("\n"))
            .setFooter({
                text: "Farlands Network",
                iconURL: message.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        message.channel.send({ embeds: [ipEmbed] });
    },
};