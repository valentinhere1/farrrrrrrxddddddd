module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { client, guild, user } = member;

        // Obtén la configuración de roles desde la base de datos
        const db = client.db; // Simula tu acceso a la base de datos
        const config = await db.get(guild.id);

        if (!config) return;

        const roleToAssign = user.bot ? config.botRole : config.userRole;

        // Asegúrate de que el rol existe y asigna el rol
        const role = guild.roles.cache.get(roleToAssign);
        if (!role) {
            console.error(`El rol ${roleToAssign} no existe en el servidor ${guild.name}.`);
            return;
        }

        try {
            await member.roles.add(role);
            console.log(`Rol ${role.name} asignado a ${user.tag} en ${guild.name}.`);
        } catch (error) {
            console.error(`No se pudo asignar el rol a ${user.tag}:`, error);
        }
    },
};
