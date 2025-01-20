const path = require("path");
const fs = require("fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  Events,
} = require("discord.js");
const { token, client_id, test_guild_id } = require("./config.json");

// Crear cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, // Necesario para GuildMemberAdd
  ],
  partials: [Partials.Channel],
});

// Colecciones para manejar comandos, eventos y otras interacciones
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();

/**********************************************************************/
// 1. Filtrar mensajes con enlaces prohibidos
const forbiddenLinks = ["http://", "https://", "www."]; // Palabras clave para detectar enlaces
const allowedChannelId = "1304886185927245895"; // ID del canal donde se permiten los links

client.on("messageCreate", (message) => {
    // Evitar que el bot procese sus propios mensajes o mensajes de otros bots
        if (message.author.bot) return;

            // Verificar si el canal es el permitido para links
                if (message.channel.id === allowedChannelId) return;

                    // Verificar si el usuario tiene permisos de administrador o puede manejar mensajes
                        if (
                                message.member.permissions.has("ManageMessages") ||
                                        message.member.permissions.has("Administrator")
                                            ) {
                                                    return; // Salir sin hacer nada si el usuario tiene permisos
                                                        }

                                                            // Verificar si el contenido del mensaje incluye un enlace prohibido
                                                                if (forbiddenLinks.some((link) => message.content.includes(link))) {
                                                                        // Eliminar el mensaje
                                                                                message.delete().catch(() => {
                                                                                            console.log("No se pudo eliminar un mensaje con enlace prohibido.");
                                                                                                    });

                                                                                                            // Enviar un aviso y borrarlo después de 5 segundos
                                                                                                                    message.channel.send(" Links are not allowed in this channel!").then((msg) => {
                                                                                                                                setTimeout(() => msg.delete().catch(() => {}), 5000);
                                                                                                                                        });
                                                                                                                                            }
                                                                                                                                            });

/**********************************************************************/
// 2. Cargar eventos dinámicamente
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
client.on("messageCreate", (message) => {
    // Evitar procesar mensajes de bots
      if (message.author.bot) return;

        // Lista de palabras clave para saludar
          const greetings = [
              "hola", "hello", "hi", "saludos", "holi", "buenas", 
                  "buenas tardes", "buenas noches", "buenos días", 
                      "bonjour", "ciao", "hallo", "konichiwa", "nihao", 
                          "que tal", "qué tal", "wena", "holis", "aloha", 
                              "sup", "wassup", "greetings", "howdy"
                                ];

                                  // Convertir el mensaje a minúsculas para buscar palabras clave
                                    const messageContent = message.content.toLowerCase();

                                      // Comprobar si el mensaje incluye alguna palabra clave
                                        if (greetings.some((word) => messageContent.includes(word))) {
                                            // Reaccionar al mensaje con un emoji de saludo
                                                message.react("👋").catch((error) => console.error("No se pudo añadir la reacción:", error));
                                                  }
                                                  });
/**********************************************************************/
// 3. Listener para cuando un nuevo usuario se une
client.on(Events.GuildMemberAdd, async (member) => {
  const roleId = "1305198426950209678"; // Reemplaza con el ID del rol a asignar

  try {
    const role = member.guild.roles.cache.get(roleId);

    if (!role) {
      console.error(`❌ El rol con ID ${roleId} no existe.`);
      return;
    }

    if (!member.guild.members.me.permissions.has("ManageRoles")) {
      console.error("❌ El bot no tiene permisos para manejar roles.");
      return;
    }

    await member.roles.add(role);
    console.log(`✅ Rol asignado automáticamente a ${member.user.tag}`);
  } catch (error) {
    console.error(`❌ Error al asignar el rol a ${member.user.tag}: ${error.message}`);
  }
});

/**********************************************************************/
// 4. Cambiar el estado del bot
client.once("ready", () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
  client.user.setStatus("dnd");

  // Array de actividades con emojis
  const activities = [
    { name: "🚚 Minecraft builders", type: 4 },
    { name: "⚓ b!help", type: 4 },
    { name: "💼 Commissions Open", type: 4 },
  ];

  let currentIndex = 0;

  // Cambiar actividad cada 10 segundos
  setInterval(() => {
    const activity = activities[currentIndex];
    client.user.setActivity(activity.name, { type: activity.type });
    currentIndex = (currentIndex + 1) % activities.length;
  }, 10000);
});

/**********************************************************************/
// 5. Cargar comandos básicos
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.name) {
    client.commands.set(command.name, command);
    console.log(`✅ Loaded basic command: ${command.name}`);
  } else {
    console.error(`❌ Failed to load command file: ${file}`);
  }
}

/**********************************************************************/
// 6. Cargar slash commands
const ticketEventsPath = path.join(__dirname, "tickets/events");
fs.readdirSync(ticketEventsPath).forEach((file) => {
    const event = require(`${ticketEventsPath}/${file}`);
    if (event.name) client.on(event.name, (...args) => event.execute(...args));
});

const ticketCommandsPath = path.join(__dirname, "tickets/cmd");
fs.readdirSync(ticketCommandsPath).forEach((file) => {
    const command = require(`${ticketCommandsPath}/${file}`);
    client.slashCommands.set(command.data.name, command);
});



const slashCommandsPath = path.join(__dirname, "interactions/slash");

if (fs.existsSync(slashCommandsPath)) {
  const slashModules = fs.readdirSync(slashCommandsPath);

  for (const module of slashModules) {
    const commandFiles = fs
      .readdirSync(path.join(slashCommandsPath, module))
      .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
      try {
        const command = require(path.join(slashCommandsPath, module, commandFile));
        if (!command.data || !command.data.name) {
          console.error(`❌ Error loading slash command file ${commandFile}: Missing 'data.name'.`);
          continue;
        }
        client.slashCommands.set(command.data.name, command);
        console.log(`✅ Loaded slash command: ${command.data.name}`);
      } catch (error) {
        console.error(`❌ Error loading slash command file ${commandFile}: ${error.message}`);
      }
    }
  }
} else {
  console.warn("⚠️ No slash commands folder found. Skipping slash command registration.");
}

/**********************************************************************/
// Registrar comandos de select menus
client.selectCommands = new Collection();

const selectCommandsPath = path.join(__dirname, "interactions/slash/misc/ticket");
if (fs.existsSync(selectCommandsPath)) {
  const selectCommandFiles = fs
    .readdirSync(selectCommandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of selectCommandFiles) {
    try {
      const selectCommand = require(path.join(selectCommandsPath, file));
      if (!selectCommand.id) {
        console.error(`❌ Error loading select menu interaction ${file}: Missing 'id'.`);
        continue;
      }
      client.selectCommands.set(selectCommand.id, selectCommand);
      console.log(`✅ Loaded select menu interaction: ${selectCommand.id}`);
    } catch (error) {
      console.error(`❌ Error loading select menu interaction ${file}: ${error.message}`);
    }
  }
}


/**********************************************************************/
// 7. Registrar comandos en la API de Discord
const rest = new REST({ version: "10" }).setToken(token);

const commandJsonData = [
  ...Array.from(client.slashCommands.values())
    .filter((c) => c.data && c.data.name)
    .map((c) => c.data.toJSON()),
];

(async () => {
  try {
    console.log("🚀 Registering application (/) commands...");
    await rest.put(Routes.applicationGuildCommands(client_id, test_guild_id), {
      body: commandJsonData,
    });
    console.log("✅ Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("❌ Error while registering commands:", error);
  }
})();

/**********************************************************************/
// Iniciar sesión en Discord con el token del bot
// require('./utils/ai')(client); IA 


client
  .login(token)
  .then(() => {
    console.log("✅ Bot logged in successfully!");
  })
  .catch((error) => {
    console.error(`❌ Error al iniciar sesión: ${error.message}`);
  });
