# Advanced Configuration

Learn how to leverage VeloKit's advanced features for automated and customized project scaffolding.

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
