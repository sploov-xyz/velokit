import { Logger } from '../utils/logger.js';

export default async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        Logger.error(`Error executing slash command ${interaction.commandName}:`, error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
};
