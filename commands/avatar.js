const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Displays the avatar of a user.",
    usage: "[mention a user or leave blank for your avatar]",
    execute(message) {
        // Fetch the mentioned user or default to the message author
        const user = message.mentions.users.first() || message.author;

        // Create an embed to display the avatar
        const embed = new EmbedBuilder()
            .setColor("#FFD700") // Gold color for a polished look
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: "Avatar requested", iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};
