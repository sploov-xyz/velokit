# CLI Reference

Complete reference for VeloKit command-line interface.

## Basic Usage

```bash
npx @sploov/velokit [options]
```

## Command Options

### `--version`
Display the current VeloKit version.

```bash
npx @sploov/velokit --version
```

### `--help`
Show help information and available options.

```bash
npx @sploov/velokit --help
```

---

## Advanced Options

### `--config <path>`
Use a configuration file to automate project creation.

```bash
npx @sploov/velokit --config ./my-config.json
```

**Example config file:**
```json
{
  "project": {
    "type": "discord",
    "name": "my-awesome-bot",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_mod", "extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": false
    }
  }
}
```

### `--quick`
Quick mode with smart defaults. Minimizes questions for faster scaffolding.

```bash
npx @sploov/velokit --quick
```

**Default selections:**
- Project Type: Discord Bot
- Language: TypeScript
- Package Manager: pnpm
- Soul: Music
- No extra modules
- MongoDB database
- No Docker

### `--dry-run`
Preview the configuration without creating any files. Useful for testing config files.

```bash
npx @sploov/velokit --dry-run
```

### `--save-config <path>`
Save your configuration to a JSON file for reuse.

```bash
npx @sploov/velokit --save-config ./bot-config.json
```

This creates a reusable configuration file based on your selections during the build process.

### `--no-git`
Skip automatic git initialization. By default, VeloKit initializes a git repository.

```bash
npx @sploov/velokit --no-git
```

### `--no-install`
Skip automatic dependency installation. You'll need to run `npm install` manually.

```bash
npx @sploov/velokit --no-install
```

---

## Commands (v1.0.3+)

### `migrate [project-dir]`
Migrate an existing VeloKit project to the latest version.

```bash
npx @sploov/velokit migrate
npx @sploov/velokit migrate ./my-bot
```

**Features:**
- Automatic version detection
- Safe backups before migration
- Sequential migration paths
- Configuration updates

### `health [project-dir]`
Run a comprehensive health check on your VeloKit project.

```bash
npx @sploov/velokit health
npx @sploov/velokit health ./my-bot
```

**Analyzes:**
- File count and lines of code
- Command and event count
- Dependency statistics
- Project configuration
- Common issues
- Health score (0-100)

### `plugin <action> [name]`
Manage VeloKit plugins.

**List installed plugins:**
```bash
npx @sploov/velokit plugin list
```

**Create a new plugin:**
```bash
npx @sploov/velokit plugin create my-custom-plugin
```

Creates a plugin scaffold in `.velokit/plugins/my-custom-plugin/`.

**Plugin Structure:**
```
.velokit/plugins/my-plugin/
├── index.js           # Plugin entry point
├── package.json       # Plugin metadata
└── README.md          # Plugin documentation
```

### `init-git [project-dir]`
Initialize a git repository in an existing project.

```bash
npx @sploov/velokit init-git
npx @sploov/velokit init-git ./my-project
```

**Options:**
- `-r, --remote <url>` - Set git remote URL
- `-b, --branch <name>` - Set default branch name (default: `main`)

**Example with options:**
```bash
npx @sploov/velokit init-git -r https://github.com/user/repo.git -b main
```

### `add-tests [project-dir]`
Add a testing framework to an existing project.

```bash
npx @sploov/velokit add-tests
npx @sploov/velokit add-tests ./my-project
```

**Options:**
- `-f, --framework <framework>` - Testing framework: `jest` or `vitest` (default: `jest`)
- `-l, --language <language>` - Language: `ts` or `js` (default: `ts`)

**Example:**
```bash
npx @sploov/velokit add-tests -f vitest -l ts
```

**What it does:**
- Installs testing framework configuration
- Creates sample test files
- Updates package.json with test scripts
- Sets up TypeScript/JavaScript support

---

## Configuration File Schema

### Project Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project.type` | `string` | Yes | Project type: `discord` or `express` |
| `project.name` | `string` | Yes | Project name (alphanumeric, hyphens, underscores) |
| `project.packageManager` | `string` | Yes | Package manager: `npm`, `pnpm`, or `yarn` |

### Discord Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `discord.language` | `string` | Yes | Language: `ts` or `js` |
| `discord.soul` | `string` | No | Bot focus: `music`, `ai`, `mod`, or `economy` |
| `discord.extras` | `array` | No | Extra modules: `extra_mod`, `extra_util`, `extra_owner` |
| `discord.infrastructure.db` | `string` | No | Database: `MongoDB (Mongoose)`, `PostgreSQL (Prisma)`, or `None` |
| `discord.infrastructure.docker` | `boolean` | No | Include Docker files |
| `discord.infrastructure.webBridge` | `boolean` | No | Include Express web bridge |

### Express Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api.framework` | `string` | Yes | API framework (currently only `express`) |

---

## Examples

### Example 1: Basic Discord Bot
```bash
npx @sploov/velokit
# Follow interactive prompts
```

### Example 2: Quick Music Bot
```bash
npx @sploov/velokit --quick
```

### Example 3: Using Config File
Create `music-bot.json`:
```json
{
  "project": {
    "type": "discord",
    "name": "music-bot",
    "packageManager": "pnpm"
  },
  "discord": {
    "language": "ts",
    "soul": "music",
    "extras": ["extra_util"],
    "infrastructure": {
      "db": "MongoDB (Mongoose)",
      "docker": true,
      "webBridge": true
    }
  }
}
```

Then run:
```bash
npx @sploov/velokit --config music-bot.json
```

### Example 4: Preview Configuration
```bash
npx @sploov/velokit --config my-config.json --dry-run
```

### Example 5: Save Configuration for Later
```bash
npx @sploov/velokit --save-config my-setup.json
# Complete the interactive setup
# Configuration is saved to my-setup.json
```

---

## Environment Variables

VeloKit respects the following environment variables:

- `NO_UPDATE_CHECK` - Set to `1` to skip version update checks
- `NODE_ENV` - Used for environment detection

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error during build or configuration |

---

## CI/CD Integration

VeloKit can be used in CI/CD pipelines with config files:

### GitHub Actions Example
```yaml
name: Create Bot
on: workflow_dispatch

jobs:
  scaffold:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Scaffold Project
        run: npx @sploov/velokit --config bot-config.json
```

### GitLab CI Example
```yaml
scaffold:
  image: node:18
  script:
    - npx @sploov/velokit --config bot-config.json
  only:
    - main
```

---

## Tips & Best Practices

1. **Use Config Files for Teams**: Share configuration files with your team for consistent project structures
2. **Version Control Configs**: Commit config files to Git (but not generated projects)
3. **Test with `--dry-run`**: Always preview changes before committing to configuration
4. **Save Successful Configs**: Use `--save-config` to document working configurations
5. **Quick Mode for Demos**: Use `--quick` when you need a project fast for testing

---

## Troubleshooting

### Config File Not Found
```bash
Error: Could not load config file: ./config.json
```
**Solution**: Ensure the path is correct and the file exists.

### Invalid Project Name
```bash
Error: Project name can only contain letters, numbers, hyphens, and underscores
```
**Solution**: Use only alphanumeric characters, hyphens, and underscores in project names.

### Node Version Error
```bash
Error: Node.js >=16.0.0 is required
```
**Solution**: Update Node.js to version 16 or higher.

---

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [Advanced Configuration](./advanced-config.md)
- [Troubleshooting Guide](./troubleshooting.md)
