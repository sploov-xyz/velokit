export default {
    name: 'stats',
    description: 'Show bot statistics',
    execute: async (client: any, message: any) => {
        const uptime = Math.floor(client.uptime / 1000);
        message.reply(`**VeloKit Bot Stats**\n- Uptime: ${uptime}s\n- Guilds: ${client.guilds.cache.size}\n- Latency: ${client.ws.ping}ms`);
    }
};
