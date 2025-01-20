/**
 * @file Sample button interaction
 * @since 3.0.0
 * @version 3.2.2
 */

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
	id: "sample",

	async execute(interaction) {
		try {
			if (interaction.replied || interaction.deferred) {
				// Si ya se respondió o diferió, no hagas nada más.
				return;
			}

			await interaction.reply({
				content: "✅ ¡El botón fue manejado correctamente!",
				ephemeral: true,
			});
		} catch (error) {
			// Loguear cualquier error que ocurra.
			console.error("Error manejando el botón:", error);
		}
	},
};
