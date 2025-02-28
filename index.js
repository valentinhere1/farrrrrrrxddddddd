const path = require("path");
const fs = require("fs");
const { Client, Collection, GatewayIntentBits, Partials, REST, Routes, Events } = require("discord.js");
const { token, client_id, prefix } = require("./config.json");

// Cargar mensajes de idioma
const lang = JSON.parse(fs.readFileSync("./lang.json", "utf8"));

// Crear una nueva instancia del cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

// Colecciones para almacenar comandos normales y slash commands
client.commands = new Collection();
client.slashCommands = new Collection();

// Función para obtener el idioma del usuario
function getLocale(interactionOrMessage) {
  return interactionOrMessage.locale?.startsWith("es") ? "es" : "en";
}

// Cargar comandos de prefijo desde la carpeta "commands"
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.name) {
    client.commands.set(command.name, command);
    console.log(`Comando de prefijo cargado: ${command.name}`);
  } else {
    console.error(`El comando en ${filePath} no tiene la propiedad "name".`);
  }
}

// Evento: Cuando el bot se inicia
client.once("ready", () => {
  console.log(`Bot iniciado como ${client.user.tag}`);
  client.user.setStatus("dnd");

  // Obtener actividades desde lang.json
  const locale = "es"; // O puedes usar "en" para inglés
  const activities = lang[locale].activities;

  if (!activities || activities.length === 0) {
    console.error("No se encontraron actividades en lang.json.");
    return;
  }

  let currentIndex = 0;
  setInterval(() => {
    const activity = activities[currentIndex];
    client.user.setActivity(activity.name, { type: activity.type }); // Establece la actividad
    currentIndex = (currentIndex + 1) % activities.length; // Rota las actividades
  }, 10000); // Cambia cada 10 segundos
});

// Evento: Cuando se envía un mensaje
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignorar mensajes de otros bots

  if (!message.content.startsWith(prefix)) return; // Ignorar si no comienza con el prefijo

  // Extraer el nombre del comando y los argumentos
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Obtener el comando de la colección
  const command = client.commands.get(commandName);
  if (!command) return; // Ignorar si el comando no existe

  try {
    const locale = getLocale(message); // Obtener el idioma del usuario
    await command.execute(message, args, locale, lang); // Ejecutar el comando con el idioma
  } catch (error) {
    console.error("Error al ejecutar el comando:", commandName, error);
    const locale = getLocale(message);
    message.reply(lang[locale].error_executing_command); // Notificar al usuario del error
  }
});

// Cargar slash commands desde la carpeta "interactions/slash"
const slashCommandsPath = path.join(__dirname, "interactions/slash");

if (fs.existsSync(slashCommandsPath)) {
  const slashItems = fs.readdirSync(slashCommandsPath);
  for (const item of slashItems) {
    const itemPath = path.join(slashCommandsPath, item);

    // Si es una carpeta, buscar archivos .js dentro
    if (fs.lstatSync(itemPath).isDirectory()) {
      const commandFiles = fs.readdirSync(itemPath).filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        try {
          const command = require(path.join(itemPath, file));
          if (!command.data || !command.data.name) {
            console.error(`Error en slash command ${file}: Falta data.name`);
            continue;
          }
          client.slashCommands.set(command.data.name, command); // Agregar el comando a la colección
          console.log(`Slash command cargado: ${command.data.name}`);
        } catch (error) {
          console.error(`Error al cargar el slash command ${file}: ${error.message}`);
        }
      }
    } else if (item.endsWith(".js")) {
      // Si es un archivo .js, cargarlo directamente
      try {
        const command = require(itemPath);
        if (!command.data || !command.data.name) {
          console.error(`Error en slash command ${item}: Falta data.name`);
          continue;
        }
        client.slashCommands.set(command.data.name, command); // Agregar el comando a la colección
        console.log(`Slash command cargado: ${command.data.name}`);
      } catch (error) {
        console.error(`Error al cargar el slash command ${item}: ${error.message}`);
      }
    }
  }
} else {
  console.warn("No se encontró la carpeta de slash commands. Se omite el registro.");
}

// Evento: Cuando un nuevo miembro se une al servidor
client.on("guildMemberAdd", async (member) => {
  const locale = getLocale(member); // Obtener el idioma del usuario
  const config = JSON.parse(fs.readFileSync("autorole.json", "utf8"));
  const guildConfig = config[member.guild.id];
  if (!guildConfig) return;

  // Asignar roles automáticamente
  if (member.user.bot) {
    if (!member.roles.cache.has(guildConfig.botRole)) {
      await member.roles.add(guildConfig.botRole).catch(console.error); // Asignar rol a bots
    }
  } else {
    if (!member.roles.cache.has(guildConfig.userRole)) {
      await member.roles.add(guildConfig.userRole).catch(console.error); // Asignar rol a usuarios
    }
  }

  // Enviar mensaje de bienvenida
  const welcomeChannel = member.guild.systemChannel;
  if (welcomeChannel) {
    welcomeChannel.send(lang[locale].welcome_message);
  }
});

// Evento: Cuando se usa un slash command
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Ignorar si no es un comando de chat

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return; // Ignorar si el comando no existe

  try {
    const locale = getLocale(interaction); // Obtener el idioma del usuario
    await command.execute(interaction, locale, lang); // Ejecutar el comando con el idioma
  } catch (error) {
    console.error(error);
    const locale = getLocale(interaction);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: lang[locale].error_executing_command, ephemeral: true });
    } else {
      await interaction.reply({ content: lang[locale].error_executing_command, ephemeral: true });
    }
  }
});

// Registrar los slash commands globalmente
const rest = new REST({ version: "10" }).setToken(token);
const commandData = client.slashCommands.map((command) => command.data.toJSON());

(async () => {
  try {
    console.log("Registrando slash commands globales...");
    await rest.put(Routes.applicationCommands(client_id), { body: commandData });
    console.log("Slash commands globales registrados correctamente.");
  } catch (error) {
    console.error("Error al registrar slash commands:", error);
  }
})();

// Iniciar sesión del bot
client.login(token)
  .then(() => console.log("Bot logueado correctamente."))
  .catch((error) => console.error(`Error al iniciar sesión: ${error.message}`));