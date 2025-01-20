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
                                                                                                    // Get the user from the interaction or default to the author
                                                                                                            const user = interaction.options.getUser("target") || interaction.user;
                                                                                                                    const member = await interaction.guild.members.fetch(user.id);

                                                                                                                            // Build the embed
                                                                                                                                    const embed = new EmbedBuilder()
                                                                                                                                                .setColor("#FFD700")
                                                                                                                                                            .setTitle(`${user.tag}'s Information`)
                                                                                                                                                                        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                                                                                                                                                                                    .addFields(
                                                                                                                                                                                                        { name: "Username", value: user.username, inline: true },
                                                                                                                                                                                                                        { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
                                                                                                                                                                                                                                        { name: "ID", value: user.id, inline: false },
                                                                                                                                                                                                                                                        { name: "Status", value: member.presence?.status || "Offline", inline: true },
                                                                                                                                                                                                                                                                        { name: "Roles", value: member.roles.cache.map(r => r.name).join(", ").slice(0, 1024) || "None", inline: false },
                                                                                                                                                                                                                                                                                        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                                                                                                                                                                                                                                                                                                        { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
                                                                                                                                                                                    )
                                                                                                                                                                                                .setFooter({ text: "Beyond Blocks Studios", iconURL: interaction.client.user.displayAvatarURL() })
                                                                                                                                                                                                            .setTimestamp();

                                                                                                                                                                                                                    // Reply with the embed
                                                                                                                                                                                                                            await interaction.reply({ embeds: [embed], ephemeral: false });
                                                                                                                            }}