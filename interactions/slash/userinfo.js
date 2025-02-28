const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get detailed information about a user.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to get information about.")
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("target") || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new EmbedBuilder()
            .setColor("#2ECC71") 
            .setTitle(`📁 ${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: "🆔 User ID", value: user.id, inline: true },
                { name: "📅 Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "📅 Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: "🟢 Status", value: member.presence?.status || "Offline", inline: true },
                { name: "🎭 Roles", value: member.roles.cache.map(r => r.name).join(", ").slice(0, 1024) || "None", inline: false }
            )
            .setFooter({ text: "Farlands Network", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

      
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};