const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "anuncio",
    description: "Crea un anuncio interactivo en el canal.",
    usage: "o!anuncio",
    async execute(message) {
        if (!message.member.permissions.has("Administrator")) {
            const errorEmbed = new EmbedBuilder()
                 .setColor("#FFD700")
                .setTitle("Permiso Denegado")
                .setDescription("❌ No tienes permisos para usar este comando.");
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            let title = "";
            let body = "";
            let imageUrl = "";
            let selectedChannel = null;
            const color = "#FFD700"; // Dorado fijo

            const announcementEmbed = new EmbedBuilder()
                .setColor(color)
                .setFooter({ text: "Beyond Blocks Studios", iconURL: interaction.client.user.displayAvatarURL() })
                                                                                                                                                                                                            .setTimestamp();

            const updatePreview = async () => {
                const embedPreview = new EmbedBuilder()
                    .setTitle("Vista Previa del Anuncio")
                    .setDescription(body || "Sin descripción")
                    .setColor(color)
                     .setFooter({ text: "Beyond Blocks Studios", iconURL: interaction.client.user.displayAvatarURL() })
                                                                                                                                                                                                            .setTimestamp();

                if (imageUrl) {
                    embedPreview.setImage(imageUrl);
                }

                await interactiveMessage.edit({ embeds: [embedPreview] });
            };

            let interactiveMessage = await message.channel.send({
                content: "📢 **Vamos a crear un anuncio!**",
                embeds: [],
            });

            // Paso 1: Preguntar por el título
            const titleMessage = await message.channel.send("📢 ¿Cuál es el título del anuncio?");
            const titleCollector = await message.channel.awaitMessages({
                filter: (response) => response.author.id === message.author.id,
                max: 1,
                time: 180000,
            });

            const titleResponse = titleCollector.first();
            title = titleResponse.content;
            await titleMessage.delete();
            await titleResponse.delete();

            announcementEmbed.setTitle(title);
            await updatePreview();

            // Paso 2: Preguntar por la descripción
            const bodyMessage = await message.channel.send("📝 ¿Cuál es la descripción del anuncio?");
            const bodyCollector = await message.channel.awaitMessages({
                filter: (response) => response.author.id === message.author.id,
                max: 1,
                time: 180000,
            });

            const bodyResponse = bodyCollector.first();
            body = bodyResponse.content;
            await bodyMessage.delete();
            await bodyResponse.delete();

            announcementEmbed.setDescription(body);
            await updatePreview();

            // Paso 3: Preguntar por el canal
            const channelMessage = await message.channel.send("📢 ¿A qué canal quieres enviar el anuncio? Menciona el canal (#nombre).");
            const channelCollector = await message.channel.awaitMessages({
                filter: (response) => response.author.id === message.author.id,
                max: 1,
                time: 180000,
            });

            const channelResponse = channelCollector.first();
            selectedChannel = channelResponse.mentions.channels.first();
            await channelMessage.delete();
            await channelResponse.delete();

            if (!selectedChannel) {
                return message.reply("❌ No mencionaste un canal válido. Comando cancelado.");
            }

            // Paso 4: Preguntar por la imagen
            const imageMessage = await message.channel.send(
                "📷 ¿Quieres añadir una imagen? Escribe 'No', proporciona un enlace válido o sube una imagen directamente."
            );
            const imageCollector = await message.channel.awaitMessages({
                filter: (response) => response.author.id === message.author.id,
                max: 1,
                time: 180000,
            });

            const imageResponse = imageCollector.first();
            const reply = imageResponse.content.toLowerCase();
            const attachment = imageResponse.attachments.first();

            if (reply === "no") {
                imageUrl = ""; // No hay imagen
            } else if (isValidImageURL(reply)) {
                imageUrl = reply; // Enlace válido
            } else if (attachment) {
                imageUrl = attachment.url; // Archivo adjunto
            } else {
                await message.reply("❌ No proporcionaste un enlace válido ni un archivo de imagen. Continuaré sin imagen.");
            }
            await imageMessage.delete();
            await imageResponse.delete();
            announcementEmbed.setImage(imageUrl);
            await updatePreview();

            // Paso 5: Preguntar si enviar
            const sendMessage = await message.channel.send("✅ ¿Quieres enviar este anuncio? Responde con 'Sí' o 'No'.");
            const sendCollector = await message.channel.awaitMessages({
                filter: (response) => response.author.id === message.author.id,
                max: 1,
                time: 180000,
            });

            const sendResponse = sendCollector.first();
            const sendReply = sendResponse.content.toLowerCase();
            await sendMessage.delete();
            await sendResponse.delete();

            if (sendReply === "sí" || sendReply === "si") {
                await selectedChannel.send({ embeds: [announcementEmbed] });
                return message.reply("✅ ¡El anuncio ha sido enviado correctamente!");
            } else {
                return message.reply("❌ El anuncio ha sido cancelado.");
            }
        } catch (error) {
            console.error("Error en el comando de anuncio:", error);
            return message.reply("❌ Ocurrió un error al crear el anuncio. Por favor, intenta nuevamente.");
        }
    },
};

// Validar enlaces de imagen
const isValidImageURL = (url) => {
    const regex = /\.(jpeg|jpg|png|gif|webp|bmp|svg|tiff|jfif)$/i; // Extensiones válidas
    try {
        const parsedUrl = new URL(url); // Verifica que sea una URL válida
        return regex.test(parsedUrl.pathname); // Verifica la extensión del archivo
    } catch (error) {
        return false; // No es un enlace válido
    }
};
