 module.exports = {
    name: "ip",
    description: "Get the IP address of the Partner server.",
    execute(message) {
        const ip = "mc.borkland.es"; // Cambia esto por tu IP
        message.channel.send(`🌐 **Partner Server IP:** \`${ip}\``);
    },
};
