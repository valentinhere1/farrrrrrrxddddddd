const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stars")
        .setDescription("Submit feedback or a review with a star rating.")
        .addIntegerOption(option =>
            option
                .setName("rating")
                .setDescription("Your star rating (1-5)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("feedback")
                .setDescription("Your feedback or review")
                .setRequired(false)
        ),
    async execute(interaction) {
        // ID of the allowed category
        const allowedCategoryId = "1324497179972206704"; // Replace with your category ID
        const feedbackChannelId = "1304885033957327042"; // Replace with your feedback channel ID

        // Check if the command is being used in a text channel under the allowed category
        const channel = interaction.channel;

        if (!channel || channel.parentId !== allowedCategoryId) {
            return interaction.reply({
                content: "❌ You can only use this command in channels under the allowed category.",
                ephemeral: true,
            });
        }

        // Fetch the feedback channel
        const feedbackChannel = interaction.guild.channels.cache.get(feedbackChannelId);

        // Validate if the feedback channel exists
        if (!feedbackChannel) {
            console.error(`Channel with ID ${feedbackChannelId} not found in guild ${interaction.guild.id}.`);
            return interaction.reply({
                content: "❌ Feedback channel not found. Please contact an admin.",
                ephemeral: true,
            });
        }

        // Validate if the channel is a text channel
        if (feedbackChannel.type !== ChannelType.GuildText) {
            console.error(`Channel with ID ${feedbackChannelId} is not a text channel.`);
            return interaction.reply({
                content: "❌ Feedback channel is not a text channel. Please contact an admin.",
                ephemeral: true,
            });
        }

        // Get rating and feedback from the interaction options
        const starRating = interaction.options.getInteger("rating");
        const reviewDescription = interaction.options.getString("feedback") || "No feedback provided.";

        // Validate the star rating
        if (starRating < 1 || starRating > 5) {
            return interaction.reply({
                content: "❌ Please provide a valid star rating (1-5).",
                ephemeral: true,
            });
        }

        // Generate the stars (⭐ and ☆)
        const stars = "⭐".repeat(starRating) + "☆".repeat(5 - starRating);

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor("#FFD700") // Gold color
            .setTitle("🌟 Feedback and Reviews")
            .setDescription("Thank you for sharing your feedback!")
            .addFields(
                { name: "⭐ Stars", value: stars, inline: true },
                { name: "📝 Review", value: reviewDescription, inline: false },
                { name: "👤 Reviewer", value: `<@${interaction.user.id}>`, inline: true }
            )
            .setFooter({
                text: "Feedback received",
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp();

        try {
            // Send the embed to the feedback channel
            await feedbackChannel.send({ embeds: [embed] });

            // Confirm to the user that their feedback was submitted
            interaction.reply({
                content: "✅ Your feedback has been submitted successfully!",
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error sending feedback:", error);
            interaction.reply({
                content: "❌ There was an error submitting your feedback. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
