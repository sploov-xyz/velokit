# Advanced Configuration

Learn how to leverage VeloKit's advanced features for automated and customized project scaffolding.

## Plugin System (v1.0.3+)

VeloKit now supports a powerful plugin system that allows you to extend functionality with custom modules and templates.

### Creating a Plugin

Create a new plugin scaffold:

```bash
npx @sploov/velokit plugin create my-awesome-plugin
```

This creates a plugin structure in `.velokit/plugins/my-awesome-plugin/`:

```
.velokit/plugins/my-awesome-plugin/
├── index.js           # Plugin entry point
├── package.json       # Plugin metadata
└── README.md          # Documentation
```

### Plugin Structure

**index.js:**
```javascript
module.exports = {
    name: 'my-awesome-plugin',
    version: '1.0.0',
    description: 'My custom VeloKit plugin',
    hooks: {
        // Called before project generation
        beforeGenerate: async (config) => {
            console.log('🔌 Plugin: Before generate');
            // Modify config or perform setup
        },
        
        // Called after project generation
        afterGenerate: async (config, targetDir) => {
            console.log('🔌 Plugin: After generate');
            // Add custom files or post-processing
        },
        
        // Provide custom templates
        customTemplates: () => {
            return [{
                name: 'custom-discord-bot',
                type: 'discord',
                path: './templates/custom-bot',
                description: 'My custom Discord bot template'
            }];
        },
        
        // Provide custom modules
        customModules: () => {
            return [{
                name: 'premium',
                displayName: 'Premium Features',
                type: 'discord',
                language: 'ts',
                path: './modules/premium',
                dependencies: ['stripe']
            }];
        }
    }
};
```

### Plugin Hooks

#### `beforeGenerate(config)`
Called before project files are generated. Use this to:
- Validate configuration
- Fetch remote data
- Set up prerequisites
- Modify project configuration

#### `afterGenerate(config, targetDir)`
Called after project files are generated. Use this to:
- Add custom files
- Modify generated files
- Run post-processing scripts
- Initialize additional services

#### `customTemplates()`
Return an array of custom project templates. Use this to:
- Provide alternative project structures
- Add specialized bot types
- Create framework-specific templates

#### `customModules()`
Return an array of custom modules. Use this to:
- Add feature modules
- Provide integration modules
- Create reusable command sets

### Using Plugins

Plugins are automatically loaded from `.velokit/plugins/` when you run VeloKit. No additional configuration needed!

```bash
# Plugins are loaded automatically
npx @sploov/velokit

# List installed plugins
npx @sploov/velokit plugin list
```

---

## Testing Framework Setup (v1.0.3+)

VeloKit can automatically set up testing frameworks for your projects.

### During Project Creation

When creating a new project, you'll be prompted to select a testing framework:
- **Jest** - Popular, full-featured testing framework
- **Vitest** - Fast, modern testing framework
- **None** - Skip testing setup

### Adding Tests to Existing Projects

```bash
# Add Jest
npx @sploov/velokit add-tests -f jest -l ts

# Add Vitest
npx @sploov/velokit add-tests -f vitest -l js
```

### What Gets Configured

**Jest Setup:**
- `jest.config.ts/js` configuration file
- Sample test files in `src/__tests__/`
- TypeScript support via `ts-jest`
- Test scripts in `package.json`

**Vitest Setup:**
- `vitest.config.ts` configuration file
- Sample test files in `src/__tests__/`
- Native TypeScript support
- Coverage configuration
- Test scripts in `package.json`

### Running Tests

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## CI/CD Integration (v1.0.3+)

VeloKit provides production-ready CI/CD templates.

### During Project Creation

Select a CI/CD template when creating your project:
- **GitHub Actions** - For GitHub repositories
- **GitLab CI** - For GitLab repositories
- **None** - Skip CI/CD setup

### GitHub Actions Template

Creates `.github/workflows/ci.yml` with:
- Multi-version Node.js testing (18.x, 20.x)
- Automated linting and testing
- Build verification
- Optional deployment stage

**Generated workflow includes:**
```yaml
- Checkout code
- Setup Node.js (multiple versions)
- Install dependencies
- Run linter (if present)
- Run tests (if present)
- Build project
- Deploy (on main branch)
```

### GitLab CI Template

Creates `.gitlab-ci.yml` with:
- Test, build, and deploy stages
- Node.js 20 environment
- Caching for faster builds
- Artifact management

**Pipeline stages:**
```yaml
- test: Run linter and tests
- build: Compile and package
- deploy: Deploy to production (manual)
```

---

## Git Integration (v1.0.3+)

VeloKit automatically initializes git repositories with best practices.

### Automatic Git Setup

By default, VeloKit:
- Initializes a git repository
- Creates `.gitignore` with smart rules
- Creates `.gitattributes` for line endings
- Makes an initial commit
- Sets default branch to `main`

### Disable Git Initialization

```bash
npx @sploov/velokit --no-git
```

### Add Git to Existing Projects

```bash
# Basic initialization
npx @sploov/velokit init-git

# With remote
npx @sploov/velokit init-git -r https://github.com/user/repo.git

# With custom branch
npx @sploov/velokit init-git -b develop
```

### Generated .gitignore

VeloKit generates context-aware `.gitignore` files based on:
- Project type (Discord/API)
- Language (TypeScript/JavaScript)
- Features (Docker, databases)
- Testing frameworks

**Includes:**
- Node.js dependencies
- Environment files
- Build outputs
- IDE files
- OS files
- Project-specific files

---

## Project Health & Analytics (v1.0.3+)

Monitor and maintain your VeloKit projects with built-in health checks.

### Running Health Checks

```bash
npx @sploov/velokit health
```

### Health Report Includes

**Code Statistics:**
- Total files
- Lines of code
- Commands count (Discord bots)
- Events count (Discord bots)

**Dependencies:**
- Production dependencies
- Development dependencies

**Configuration:**
- Project type
- Language
- Last modified date

**Health Score (0-100):**
- File structure completeness
- Code volume
- Dependency presence
- Essential files (.env, README, etc.)

**Recommendations:**
- Missing essential files
- Configuration improvements
- Best practice suggestions
- Common issue detection

---

## Migration System (v1.0.3+)

Upgrade existing VeloKit projects to the latest version.

### Migrating Projects

```bash
npx @sploov/velokit migrate
```

### Migration Process

1. **Version Detection** - Automatically detects current project version
2. **Backup Creation** - Creates a timestamped backup (optional)
3. **Migration Path** - Applies sequential migrations
4. **Version Update** - Updates project metadata

### Safe Migration

VeloKit creates backups before migration:
```
../my-project-backup-2026-01-15T10-30-00/
```

The backup excludes:
- `node_modules/`
- `dist/` build output

---

## Configuration Files

Configuration files allow you to automate project creation and maintain consistency across multiple projects.

### Creating a Configuration File

You can create a config file manually or save one after running VeloKit:

```bash
# Save configuration interactively
npx @sploov/velokit --save-config my-config.json

# Or create manually
```

**Example Configuration:**
```json
{
  "project": {
    "type": "discord",
    "name": "advanced-bot",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_mod", "extra_util", "extra_owner"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": true
    }
  }
}
```

### Using Configuration Files

```bash
# Standard usage
npx @sploov/velokit --config ./configs/music-bot.json

# Preview without creating files
npx @sploov/velokit --config ./configs/music-bot.json --dry-run

# Use config and save updated version
npx @sploov/velokit --config base-config.json --save-config updated-config.json
```

---

## Configuration Templates

### Music Bot with Full Stack
```json
{
  "project": {
    "type": "discord",
    "name": "music-bot-pro",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_mod", "extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": true
    }
  }
}
```

### AI Bot Minimal
```json
{
  "project": {
    "type": "discord",
    "name": "ai-assistant",
    "packageManager": "npm"
  },
  "discord": {
    "language": "ts",
    "soul": "ai",
    "extras": [],
    "infrastructure": {
      "db": "None",
      "docker": false,
      "webBridge": false
    }
  }
}
```

### Moderation Bot
```json
{
  "project": {
    "type": "discord",
    "name": "mod-bot",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "mod",
    "extras": ["extra_owner", "extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": false
    }
  }
}
```

### JavaScript Economy Bot
```json
{
  "project": {
    "type": "discord",
    "name": "economy-bot",
    "packageManager": "yarn"
  },
  "discord": {
    "language": "js",
    "soul": "economy",
    "extras": ["extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": false,
      "webBridge": false
    }
  }
}
```

---

## Automation & CI/CD

### GitHub Actions Workflow

Create `.github/workflows/scaffold.yml`:

```yaml
name: Scaffold Bot Project

on:
  workflow_dispatch:
    inputs:
      bot_name:
        description: 'Bot project name'
        required: true
        default: 'my-bot'

jobs:
  scaffold:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Create config file
        run: |
          cat > config.json << EOF
          {
            "project": {
              "type": "discord",
              "name": "${{ github.event.inputs.bot_name }}",
              "packageManager": "pnpm"
            },
            "discord": {
              "language": "ts",
              "soul": "music",
              "extras": ["extra_mod"],
              "infrastructure": {
                "db": "MongoDB (Mongoose)",
                "docker": true,
                "webBridge": false
              }
            }
          }
          EOF
      
      - name: Scaffold with VeloKit
        run: npx @sploov/velokit --config config.json
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: bot-project
          path: ${{ github.event.inputs.bot_name }}/
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - scaffold

scaffold_bot:
  stage: scaffold
  image: node:18
  script:
    - npm install -g @sploov/velokit
    - velokit --config ./configs/production-bot.json
  artifacts:
    paths:
      - production-bot/
  only:
    - main
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Scaffold') {
            steps {
                sh 'npx @sploov/velokit --config bot-config.json'
            }
        }
        
        stage('Validate') {
            steps {
                dir('my-bot') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
    }
}
```

---

## Multi-Project Management

### Organization Structure

```
organization/
├── configs/
│   ├── music-bot.json
│   ├── mod-bot.json
│   ├── ai-bot.json
│   └── base-config.json
├── scripts/
│   └── create-bot.sh
└── bots/
    ├── music-bot-1/
    ├── music-bot-2/
    └── mod-bot-1/
```

### Batch Creation Script

Create `scripts/create-bot.sh`:

```bash
#!/bin/bash

CONFIG_DIR="./configs"
OUTPUT_DIR="./bots"

# Create multiple bots from configs
for config in $CONFIG_DIR/*.json; do
    echo "Creating project from $config..."
    npx @sploov/velokit --config "$config"
done

echo "All projects created!"
```

---

## Environment-Specific Configs

### Development Config
```json
{
  "project": {
    "type": "discord",
    "name": "bot-dev",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_owner"],
    "infrastructure": {
      "db": "None",
      "docker": false,
      "webBridge": true
    }
  }
}
```

### Production Config
```json
{
  "project": {
    "type": "discord",
    "name": "bot-prod",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_mod", "extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": true
    }
  }
}
```

---

## Dynamic Configuration

### Using Environment Variables

```bash
#!/bin/bash

BOT_NAME=${BOT_NAME:-"default-bot"}
BOT_LANGUAGE=${BOT_LANGUAGE:-"ts"}

cat > dynamic-config.json << EOF
{
  "project": {
    "type": "discord",
    "name": "$BOT_NAME",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "$BOT_LANGUAGE",
    "soul": "music",
    "extras": [],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": false
    }
  }
}
EOF

npx @sploov/velokit --config dynamic-config.json
```

Usage:
```bash
BOT_NAME="my-music-bot" BOT_LANGUAGE="js" ./create-bot.sh
```

---

## Best Practices

### 1. Version Control
- ✅ **DO** commit config files to version control
- ❌ **DON'T** commit generated projects
- ✅ **DO** use `.gitignore` to exclude generated folders

### 2. Configuration Management
- Use descriptive names for config files
- Organize configs by purpose or environment
- Document custom configurations
- Keep a base template for common settings

### 3. Team Collaboration
- Share config files via Git
- Use consistent naming conventions
- Document project structure choices
- Maintain a config library

### 4. Security
- Never include tokens in config files
- Use environment variables for secrets
- Add sensitive configs to `.gitignore`
- Use separate configs for different environments

---

## Troubleshooting

### Config Validation Errors
```bash
# Preview config before running
npx @sploov/velokit --config my-config.json --dry-run
```

### Debugging Config Issues
```json
{
  "project": {
    "type": "discord",
    "name": "test-bot",
    "packageManager": "pnpm"
  }
}
```
Start minimal and add features incrementally.

---

## Next Steps

- [CLI Reference](./cli-reference.md) - Complete CLI documentation
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Getting Started](./getting-started.md) - Basic usage guide
