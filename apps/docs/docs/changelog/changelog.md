# Changelog

All notable changes to **VeloKit** will be documented in this file.

## [1.0.3] - 2026-01-15

### ✨ New Features

#### Plugin System
- **Plugin Manager**: Load and manage custom VeloKit plugins
- **Plugin Hooks**: `beforeGenerate`, `afterGenerate`, `customTemplates`, `customModules`
- **Plugin Command**: Create plugin scaffolds with `velokit plugin create <name>`
- **Plugin Discovery**: Automatic loading from `.velokit/plugins/` directory

#### Git Integration
- **Auto-Initialize Git**: Automatic git repository initialization with `--no-git` to disable
- **Smart .gitignore**: Enhanced gitignore generation with project-specific rules
- **Git Attributes**: Automatic `.gitattributes` file for consistent line endings
- **Init Git Command**: `velokit init-git` to add git to existing projects
- **Remote Support**: Configure git remotes and default branches

#### Testing Framework Setup
- **Jest Support**: Full Jest configuration with TypeScript/JavaScript
- **Vitest Support**: Modern Vitest setup for faster testing
- **Sample Tests**: Auto-generated test files to get started
- **Add Tests Command**: `velokit add-tests` to add testing to existing projects
- **Package.json Scripts**: Automatic test script configuration

#### CI/CD Templates
- **GitHub Actions**: Production-ready workflow templates
- **GitLab CI**: Complete CI/CD pipeline configuration
- **Multi-Node Testing**: Test against multiple Node.js versions
- **Auto-Deploy**: Optional deployment stage configuration

#### Migration & Upgrade System
- **Project Migration**: Upgrade existing projects with `velokit migrate`
- **Version Detection**: Automatic detection of current project version
- **Backup Creation**: Safe migration with automatic backups
- **Migration Paths**: Sequential migration support for version jumps

#### Project Analytics & Health Checks
- **Health Command**: Run comprehensive project health checks with `velokit health`
- **Code Statistics**: File count, lines of code, and complexity metrics
- **Dependency Analysis**: Track production and development dependencies
- **Health Score**: 0-100 score with actionable recommendations
- **Issue Detection**: Identify common problems and suggest fixes

#### Environment Variable Management
- **EnvManager Class**: Programmatic .env file management
- **Smart Generation**: Context-aware environment variable templates
- **Validation System**: Required variable checking and validation
- **Example Files**: Automatic `.env.example` generation
- **Merge Support**: Combine environment configurations safely

### 🎯 CLI Enhancements

#### New Commands
- `velokit migrate [project-dir]` - Migrate projects to latest version
- `velokit health [project-dir]` - Run health checks and generate reports
- `velokit plugin <action> [name]` - Manage plugins (create, list)
- `velokit init-git [project-dir]` - Initialize git repository
- `velokit add-tests [project-dir]` - Add testing framework

#### New Options
- `--no-git` - Skip automatic git initialization
- `--no-install` - Skip automatic dependency installation
- `-f, --framework <framework>` - Specify testing framework (add-tests)
- `-r, --remote <url>` - Set git remote URL (init-git)
- `-b, --branch <name>` - Set default branch name (init-git)

#### Interactive Prompts
- **Testing Framework Selection**: Choose Jest, Vitest, or None during setup
- **CI/CD Template Selection**: Choose GitHub Actions, GitLab CI, or None
- **Setup Options**: Additional configuration step for advanced features

### 📚 New Modules

#### Core Modules Added
- `plugin-system.ts` - Plugin loading and management
- `git-integration.ts` - Git initialization and configuration
- `migration-system.ts` - Project migration and versioning
- `testing-setup.ts` - Test framework configuration
- `env-manager.ts` - Environment variable management
- `analytics.ts` - Project analysis and health reporting

#### Template Files Added
- `templates/ci/github-actions.yml` - GitHub Actions workflow
- `templates/ci/gitlab-ci.yml` - GitLab CI pipeline

### 🔧 Technical Improvements

#### Code Quality
- Modular architecture with separated concerns
- TypeScript interfaces for all new features
- Improved error handling and user feedback
- Plugin hook system for extensibility

#### Build Process
- Enhanced project generation pipeline
- Plugin hook execution (before/after generate)
- Better template processing and file management
- Improved dependency installation flow

#### User Experience
- More granular control over project setup
- Skip options for faster workflows
- Better progress indicators and feedback
- Context-aware help messages

### 🛠️ Breaking Changes
None - fully backward compatible with v1.0.2 projects

### 📖 Documentation Updates
- Added plugin system documentation
- Updated CLI reference with new commands
- Migration guide for existing projects
- Testing framework setup guide
- CI/CD configuration examples

---

## [1.0.2] - 2026-01-15

### ✨ New Features

#### CLI Enhancements
- **Config File Support**: Use JSON configuration files to automate project creation
  - `--config <path>` flag to load configuration from file
  - `--save-config <path>` flag to save current configuration for reuse
- **Quick Mode**: New `--quick` flag for rapid scaffolding with smart defaults
- **Dry Run Mode**: New `--dry-run` flag to preview configuration without creating files
- **Version Checker**: Automatic check for updates on CLI startup (non-blocking)

#### UI/UX Improvements
- **Step Counter System**: Each configuration phase now shows progress (Step X/Y)
- **Configuration Preview**: Interactive tree view of your configuration before building
- **Enhanced Validation**: Better input validation with helpful error messages
- **Directory Check**: Warns if project directory already exists with overwrite option
- **Node Version Check**: Validates Node.js version before starting

#### Enhanced Branding Utilities
- New `printWarning()` function for warning messages
- New `printInfo()` function for informational messages
- New `printError()` function for error messages
- New `printList()` function for formatted lists
- New `printTree()` function for hierarchical data display
- New `printProgressBar()` function for progress visualization
- Updated `printSection()` to support step counters

#### Post-Build Experience
- **Comprehensive Success Screen**: Context-aware next steps and tips
- **Resource Links**: Relevant documentation links based on project configuration
- **Random Tips**: Helpful tips displayed during dependency installation
- **Copy-Pastable Commands**: Easy-to-copy commands for getting started
- **Project Summary Box**: Clear overview of created project

#### Auto-Generated Project Files
- **README.md Generation**: Every project gets a comprehensive, customized README
  - Installation instructions
  - Environment variable documentation
  - Project structure overview
  - Feature list
  - Usage examples
  - Resource links
- **Smart .gitignore**: Context-aware gitignore files based on project type and configuration

### 📚 Documentation

#### New Documentation Pages
- **CLI Reference**: Complete command-line interface documentation with examples
- **Advanced Configuration**: In-depth guide for config files and automation
- **Troubleshooting Guide**: Comprehensive troubleshooting resource

#### Updated Documentation
- **Getting Started**: Added quick start options and new CLI flags
- **VitePress Config**: Added new "CLI Reference" section to sidebar
- **README.md**: Updated with v1.0.2 features

### 🛠️ Code Quality

#### New Modules
- `validators.ts`: Input validation utilities
- `config.ts`: Configuration file handling with TypeScript interfaces
- `version-checker.ts`: Version management and update checking
- `generators.ts`: File generation utilities (README, .gitignore)

#### Technical Improvements
- Updated all imports to use `.js` extensions for ESM compatibility
- Better TypeScript type safety with new interfaces
- Modular code organization for maintainability
- Improved error handling with actionable messages

### 🎯 User Experience
- More intuitive configuration flow
- Better feedback during build process
- Context-aware help and tips
- Clearer next steps after project creation
- Professional post-build experience

---

## [1.0.1] - 2026-01-15

### Added
- **Multi-Project Engine:** Support for scaffolding **Express API** projects alongside Discord bots.
- **JavaScript (ESM) Support:** Full native JavaScript templates for all modules, including Music and AI.
- **TUI Overhaul:** Redesigned interactive CLI with modern borders, better headers, and improved UX.
- **Build Terminology:** Rebranded "Forge" to "Build/Construct" for broader project compatibility.
- **New Feature Badges:** Visual `[NEW]` indicators in CLI for recently added options.

### Changed
- Refactored CLI architecture to support branching templates (Language -> Type -> Feature).
- Updated internal `branding.ts` with enhanced TUI utilities and versioned banners.
- Renamed "The Forge" guide to "The Build Process".

## [1.0.0] - 2026-01-14

### Added
- **Initial Release:** The 7-Phase interactive CLI scaffolding engine.
- **Modular Souls:** Dynamic injection for Music, AI, and Moderation modules.
- **Smart Intents:** Automatic Gateway Intent calculation.
- **Sploov Logger:** Premium terminal logging for all forged projects.
- **Docker Support:** Automated generation of `Dockerfile` and `docker-compose.yml`.
- **Slash Commands:** Integrated auto-registration for discord.js v14 commands.
- **Validation:** Built-in environment variable verification (`config.ts`).

### Fixed
- ESM build resolution in VitePress documentation.
- Asset path rendering in monorepo root README.
- GitHub Actions workflow for automated docs deployment.

---
*Built with Velocity by Sploov Team*
