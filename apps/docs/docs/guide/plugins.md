# Plugin Development Guide

Learn how to create powerful VeloKit plugins to extend functionality and add custom features.

## What are VeloKit Plugins?

VeloKit plugins are JavaScript modules that hook into the project generation lifecycle, allowing you to:
- Add custom templates
- Provide additional modules
- Modify project configuration
- Execute pre/post-generation tasks
- Integrate with external services

## Creating Your First Plugin

### Step 1: Generate Plugin Scaffold

```bash
npx @sploov/velokit plugin create my-first-plugin
```

This creates the following structure:

```
.velokit/plugins/my-first-plugin/
├── index.js           # Plugin entry point
├── package.json       # Plugin metadata
└── README.md          # Plugin documentation
```

### Step 2: Understanding Plugin Structure

**index.js:**
```javascript
module.exports = {
    name: 'my-first-plugin',
    version: '1.0.0',
    description: 'My first VeloKit plugin',
    hooks: {
        beforeGenerate: async (config) => {
            // Called before project generation
        },
        afterGenerate: async (config, targetDir) => {
            // Called after project generation
        },
        customTemplates: () => {
            // Return custom templates
            return [];
        },
        customModules: () => {
            // Return custom modules
            return [];
        }
    }
};
```

## Plugin Hooks Reference

### beforeGenerate(config)

Called before any files are generated. Perfect for:
- Validating configuration
- Fetching remote resources
- Setting up prerequisites
- Modifying project configuration

**Example:**
```javascript
beforeGenerate: async (config) => {
    console.log('🔌 Preparing project...');
    
    // Validate configuration
    if (config.project.type === 'discord' && !config.discord.token) {
        throw new Error('Discord token is required');
    }
    
    // Fetch external data
    const templates = await fetch('https://api.example.com/templates');
    config.customData = await templates.json();
    
    // Modify configuration
    if (config.project.name.includes('premium')) {
        config.discord.extras.push('premium_features');
    }
}
```

### afterGenerate(config, targetDir)

Called after all files have been generated. Perfect for:
- Adding custom files
- Modifying generated files
- Running post-processing scripts
- Initializing external services

**Example:**
```javascript
afterGenerate: async (config, targetDir) => {
    const fs = require('fs-extra');
    const path = require('path');
    
    console.log('🔌 Post-processing project...');
    
    // Add custom file
    const customFile = path.join(targetDir, 'src', 'plugins', 'custom.ts');
    await fs.ensureDir(path.dirname(customFile));
    await fs.writeFile(customFile, `
        export class CustomPlugin {
            constructor() {
                console.log('Custom plugin loaded!');
            }
        }
    `);
    
    // Modify package.json
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.scripts['custom'] = 'echo "Custom command"';
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    
    // Create additional directories
    await fs.ensureDir(path.join(targetDir, 'src', 'plugins'));
    await fs.ensureDir(path.join(targetDir, 'data'));
}
```

### customTemplates()

Return an array of custom project templates. Templates provide alternative project structures.

**Example:**
```javascript
customTemplates: () => {
    return [
        {
            name: 'premium-bot',
            type: 'discord',
            path: './templates/premium-bot',
            description: 'Premium Discord bot with advanced features'
        },
        {
            name: 'microservice-api',
            type: 'api',
            path: './templates/microservice',
            description: 'Microservice-ready API template'
        }
    ];
}
```

**Template Structure:**
```
.velokit/plugins/my-plugin/templates/premium-bot/
├── src/
│   ├── index.ts
│   ├── commands/
│   └── events/
├── package.json
└── README.md
```

### customModules()

Return an array of custom modules that can be added to projects.

**Example:**
```javascript
customModules: () => {
    return [
        {
            name: 'analytics',
            displayName: 'Analytics & Metrics',
            type: 'discord',
            language: 'ts',
            path: './modules/analytics',
            dependencies: ['@sentry/node', 'prom-client']
        },
        {
            name: 'premium',
            displayName: 'Premium Features',
            type: 'discord',
            language: 'ts',
            path: './modules/premium',
            dependencies: ['stripe']
        }
    ];
}
```

**Module Structure:**
```
.velokit/plugins/my-plugin/modules/analytics/
├── commands/
│   ├── stats.ts
│   └── metrics.ts
├── events/
│   └── analyticsTracker.ts
└── utils/
    └── analytics.ts
```

## Real-World Plugin Examples

### Example 1: Database Auto-Setup Plugin

```javascript
module.exports = {
    name: 'database-setup',
    version: '1.0.0',
    description: 'Automatically sets up database connections',
    hooks: {
        afterGenerate: async (config, targetDir) => {
            const fs = require('fs-extra');
            const path = require('path');
            
            if (config.discord?.infrastructure?.db === 'MongoDB (Mongoose)') {
                // Create database utility
                const dbFile = path.join(targetDir, 'src', 'database', 'connection.ts');
                await fs.ensureDir(path.dirname(dbFile));
                await fs.writeFile(dbFile, `
import mongoose from 'mongoose';

export async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Database connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
                `);
                
                console.log('✅ Database setup complete');
            }
        }
    }
};
```

### Example 2: Custom Commands Plugin

```javascript
module.exports = {
    name: 'custom-commands',
    version: '1.0.0',
    description: 'Adds custom command templates',
    hooks: {
        customModules: () => {
            return [
                {
                    name: 'fun',
                    displayName: 'Fun Commands',
                    type: 'discord',
                    language: 'ts',
                    path: './modules/fun',
                    dependencies: ['axios', 'canvas']
                }
            ];
        }
    }
};
```

### Example 3: Deployment Plugin

```javascript
module.exports = {
    name: 'auto-deploy',
    version: '1.0.0',
    description: 'Sets up automatic deployment',
    hooks: {
        afterGenerate: async (config, targetDir) => {
            const fs = require('fs-extra');
            const path = require('path');
            
            // Create deployment script
            const deployScript = path.join(targetDir, 'scripts', 'deploy.sh');
            await fs.ensureDir(path.dirname(deployScript));
            await fs.writeFile(deployScript, `#!/bin/bash
echo "🚀 Deploying ${config.project.name}..."
npm run build
pm2 restart ${config.project.name}
echo "✅ Deployment complete!"
            `);
            
            await fs.chmod(deployScript, '755');
            console.log('✅ Deployment script created');
        }
    }
};
```

## Plugin Best Practices

### 1. Error Handling
Always wrap your plugin code in try-catch blocks:

```javascript
beforeGenerate: async (config) => {
    try {
        // Your code here
    } catch (error) {
        console.error('Plugin error:', error);
        // Don't throw - let VeloKit continue
    }
}
```

### 2. Logging
Provide clear feedback to users:

```javascript
afterGenerate: async (config, targetDir) => {
    console.log('🔌 My Plugin: Starting post-processing...');
    // Do work
    console.log('✅ My Plugin: Complete!');
}
```

### 3. Non-Destructive
Don't modify existing files unless necessary. Create new files instead.

### 4. Dependencies
List all dependencies in your plugin's README:

```markdown
## Dependencies
This plugin requires:
- Node.js 18+
- External API access
- Environment variables: API_KEY
```

### 5. Documentation
Document what your plugin does and how to configure it.

## Testing Your Plugin

### Manual Testing

1. Create a test project:
```bash
npx @sploov/velokit
```

2. Check that your plugin was loaded:
```bash
npx @sploov/velokit plugin list
```

3. Verify plugin behavior in generated projects

### Plugin Development Tips

- Use relative paths for templates and modules
- Test with different project configurations
- Handle missing configuration gracefully
- Provide clear error messages
- Keep plugins focused on one responsibility

## Publishing Plugins

While VeloKit doesn't have a plugin registry yet, you can share plugins by:

1. **GitHub Repository**
   ```bash
   git clone https://github.com/user/velokit-plugin-example
   cp -r velokit-plugin-example ~/.velokit/plugins/
   ```

2. **npm Package**
   ```bash
   npm install -g velokit-plugin-example
   velokit-plugin-example install
   ```

3. **Direct Sharing**
   Share the plugin folder directly with other developers

## Plugin Ideas

Here are some ideas for useful plugins:

- **Database Migrations**: Auto-generate migration files
- **API Documentation**: Generate OpenAPI/Swagger docs
- **Monitoring**: Integrate Sentry, Datadog, or similar
- **Testing**: Add E2E test setups
- **Deployment**: Docker, Kubernetes, or cloud provider configs
- **Security**: Add security scanning and best practices
- **Performance**: Add profiling and optimization tools
- **Internationalization**: Add i18n support
- **Webhooks**: Integration with external services
- **Custom Commands**: Domain-specific command templates

## Need Help?

- Check existing plugins for examples
- Join the [VeloKit Discord](https://discord.gg/sploov)
- Open an issue on [GitHub](https://github.com/sploov-xyz/velokit)

---

**Happy Plugin Development! 🔌**
