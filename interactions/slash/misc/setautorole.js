const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setautorole")
        .setDescription("Configura los roles automáticos para usuarios y bots.")
        .addRoleOption((option) =>
            option
                .setName("userrole")
                .setDescription("Rol que se asignará automáticamente a los usuarios.")
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName("botrole")
                .setDescription("Rol que se asignará automáticamente a los bots.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const userRole = interaction.options.getRole("userrole");
        const botRole = interaction.options.getRole("botrole");

        // Guarda las configuraciones en algún lugar, como una base de datos.
        const db = interaction.client.db; // Simula tu acceso a la base de datos
        await db.set(interaction.guild.id, { userRole: userRole.id, botRole: botRole.id });

        await interaction.reply({
            content: `✅ Configuración completada:\n- Rol para usuarios: ${userRole}\n- Rol para bots: ${botRole}`,
            ephemeral: true,
        });
    },
};
