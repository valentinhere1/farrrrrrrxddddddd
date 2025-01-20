module.exports = {
    name: "ping",
    description: "Check the bot's latency.",
    execute(message) {
        message.channel.send(`🏓 Pong! Latency is ${Date.now() - message.createdTimestamp}ms.`);
    },
};
