import fs from 'fs-extra';
import path from 'path';
import { printInfo, printWarning, printError } from './utils/branding.js';

export interface VeloKitPlugin {
    name: string;
    version: string;
    description?: string;
    hooks: {
        beforeGenerate?: (config: any) => Promise<void> | void;
        afterGenerate?: (config: any, targetDir: string) => Promise<void> | void;
        customTemplates?: () => Promise<PluginTemplate[]> | PluginTemplate[];
        customModules?: () => Promise<PluginModule[]> | PluginModule[];
    };
}

export interface PluginTemplate {
    name: string;
    type: 'discord' | 'api' | 'custom';
    path: string;
    description?: string;
}

export interface PluginModule {
    name: string;
    displayName: string;
    type: 'discord' | 'api';
    language?: 'ts' | 'js';
    path: string;
    dependencies?: string[];
}

export class PluginManager {
    private plugins: VeloKitPlugin[] = [];
    private pluginsDir: string;

    constructor(pluginsDir?: string) {
        this.pluginsDir = pluginsDir || path.join(process.cwd(), '.velokit', 'plugins');
    }

    async loadPlugins(): Promise<void> {
        try {
            await fs.ensureDir(this.pluginsDir);
            const pluginDirs = await fs.readdir(this.pluginsDir);

            for (const dir of pluginDirs) {
                const pluginPath = path.join(this.pluginsDir, dir);
                const stat = await fs.stat(pluginPath);
                
                if (stat.isDirectory()) {
                    await this.loadPlugin(pluginPath);
                }
            }

            if (this.plugins.length > 0) {
                printInfo(`Loaded ${this.plugins.length} plugin(s)`);
            }
        } catch (error) {
            printWarning('Could not load plugins directory');
        }
    }

    private async loadPlugin(pluginPath: string): Promise<void> {
        try {
            const indexPath = path.join(pluginPath, 'index.js');
            if (!await fs.pathExists(indexPath)) {
                return;
            }

            const plugin = require(indexPath) as VeloKitPlugin;
            
            if (!plugin.name || !plugin.version) {
                printWarning(`Invalid plugin at ${pluginPath}: missing name or version`);
                return;
            }

            this.plugins.push(plugin);
            printInfo(`Plugin loaded: ${plugin.name} v${plugin.version}`);
        } catch (error) {
            printError(`Failed to load plugin at ${pluginPath}: ${error}`);
        }
    }

    async executeHook(hookName: 'beforeGenerate' | 'afterGenerate', ...args: any[]): Promise<void> {
        for (const plugin of this.plugins) {
            const hook = plugin.hooks[hookName];
            if (hook) {
                try {
                    await (hook as any)(...args);
                } catch (error) {
                    printError(`Plugin ${plugin.name} hook ${hookName} failed: ${error}`);
                }
            }
        }
    }

    async getCustomTemplates(): Promise<PluginTemplate[]> {
        const templates: PluginTemplate[] = [];
        
        for (const plugin of this.plugins) {
            const hook = plugin.hooks.customTemplates;
            if (hook) {
                try {
                    const pluginTemplates = await hook.call(plugin);
                    templates.push(...pluginTemplates);
                } catch (error) {
                    printError(`Plugin ${plugin.name} customTemplates failed: ${error}`);
                }
            }
        }

        return templates;
    }

    async getCustomModules(): Promise<PluginModule[]> {
        const modules: PluginModule[] = [];
        
        for (const plugin of this.plugins) {
            const hook = plugin.hooks.customModules;
            if (hook) {
                try {
                    const pluginModules = await hook.call(plugin);
                    modules.push(...pluginModules);
                } catch (error) {
                    printError(`Plugin ${plugin.name} customModules failed: ${error}`);
                }
            }
        }

        return modules;
    }

    getPlugins(): VeloKitPlugin[] {
        return this.plugins;
    }
}

// Plugin creation helper
export async function createPluginScaffold(pluginName: string, targetDir: string): Promise<void> {
    const pluginDir = path.join(targetDir, pluginName);
    await fs.ensureDir(pluginDir);

    const packageJson = {
        name: `velokit-plugin-${pluginName}`,
        version: '1.0.0',
        description: `VeloKit plugin: ${pluginName}`,
        main: 'index.js'
    };

    const indexJs = `module.exports = {
    name: '${pluginName}',
    version: '1.0.0',
    description: 'My VeloKit plugin',
    hooks: {
        // beforeGenerate: async (config) => {
        //     console.log('Before generate hook');
        // },
        // afterGenerate: async (config, targetDir) => {
        //     console.log('After generate hook');
        // },
        // customTemplates: () => {
        //     return [];
        // },
        // customModules: () => {
        //     return [];
        // }
    }
};`;

    await fs.writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    await fs.writeFile(path.join(pluginDir, 'index.js'), indexJs);
    
    const readme = `# VeloKit Plugin: ${pluginName}

## Installation

Place this plugin in your \`.velokit/plugins/${pluginName}\` directory.

## Hooks

- \`beforeGenerate\`: Called before project generation
- \`afterGenerate\`: Called after project generation
- \`customTemplates\`: Provide custom project templates
- \`customModules\`: Provide custom modules for Discord/API projects
`;

    await fs.writeFile(path.join(pluginDir, 'README.md'), readme);
    
    printInfo(`Plugin scaffold created at ${pluginDir}`);
}
