import { SploovClient } from '../index';
import { Interaction } from 'discord.js';
import { Logger } from '../utils/logger';

export default async (client: SploovClient, interaction: Interaction) => {
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
