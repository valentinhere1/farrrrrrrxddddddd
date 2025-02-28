const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Check the bot's latency.",
    execute(message, args, locale, lang) {
        const latency = Date.now() - message.createdTimestamp;

        const pingEmbed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("🏓 Pong!")
            .setDescription(lang[locale].ping_response.replace("{latency}", latency))
            .setFooter({
                text: "Farlands Network",
                iconURL: message.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        message.channel.send({ embeds: [pingEmbed] });
    },
};