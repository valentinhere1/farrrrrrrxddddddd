/**
 * @file Handles default errors for button interactions.
 * @since 3.0.0
 */

module.exports = {
	/**
	 * @description Executes when the button interaction could not be fetched.
	 * @param {import('discord.js').ButtonInteraction} interaction The Interaction Object of the command.
	 */

	async execute(interaction) {
		try {
			if (interaction.replied || interaction.deferred) {
				// Si ya se respondió o diferió, simplemente termina.
				console.log("La interacción ya fue respondida o diferida.");
				return;
			}

			await interaction.reply({
				content: "❌ Hubo un problema al procesar este botón. Por favor, intenta nuevamente.",
				ephemeral: true,
			});
		} catch (error) {
			// Loguear el error para depuración.
			console.error("Error manejando el botón:", error);
		}
	},
};
