const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Displays the avatar of a user.",
    usage: "[mention a user or leave blank for your avatar]",
    execute(message, args, locale, lang) {
        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle(lang[locale].avatar_title.replace("{username}", user.username))
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: "Avatar requested", iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};