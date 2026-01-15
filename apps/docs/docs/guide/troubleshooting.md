# Troubleshooting Guide

Common issues and solutions when using VeloKit.

## Installation Issues

### npm/npx Not Found

**Problem:**
```bash
bash: npx: command not found
```

**Solution:**
Install or update Node.js to version 16 or higher from [nodejs.org](https://nodejs.org).

```bash
# Check Node.js version
node --version

# Should be v16.0.0 or higher
```

---

### Permission Errors (EACCES)

**Problem:**
```bash
Error: EACCES: permission denied
```

**Solution:**

**On Linux/macOS:**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER /usr/local/lib/node_modules
```

**Or use a version manager:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18
```

---

## Project Creation Issues

### Directory Already Exists

**Problem:**
```bash
Directory "my-bot" already exists
```

**Solution:**
VeloKit will now prompt you to overwrite. Choose wisely:
- Select "Yes" to overwrite (⚠️ destroys existing files)
- Select "No" to cancel and use a different name

```bash
# Or manually remove the directory
rm -rf my-bot
npx @sploov/velokit
```

---

### Invalid Project Name

**Problem:**
```bash
Error: Project name can only contain letters, numbers, hyphens, and underscores
```

**Solution:**
Use only alphanumeric characters, hyphens, and underscores:

✅ **Valid:**
- `my-bot`
- `awesome_bot`
- `musicbot123`
- `ModBot-2024`

❌ **Invalid:**
- `my bot` (spaces)
- `my@bot` (special characters)
- `my.bot` (dots)

---

### Node Version Error

**Problem:**
```bash
Error: Node.js >=16.0.0 is required. Current: v14.17.0
```

**Solution:**
Update Node.js to version 16 or higher:

```bash
# Using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

---

## Configuration File Issues

### Config File Not Found

**Problem:**
```bash
Error: Could not load config file: ./config.json
```

**Solution:**
1. Verify the file exists:
```bash
ls -la config.json
```

2. Check the path is correct:
```bash
# Use absolute path
npx @sploov/velokit --config /full/path/to/config.json

# Or relative from current directory
npx @sploov/velokit --config ./configs/bot-config.json
```

---

### Invalid JSON Syntax

**Problem:**
```bash
Error loading config file: Unexpected token
```

**Solution:**
Validate your JSON syntax:

❌ **Invalid JSON:**
```json
{
  "project": {
    "type": "discord"
    "name": "my-bot"  // Missing comma
  }
}
```

✅ **Valid JSON:**
```json
{
  "project": {
    "type": "discord",
    "name": "my-bot"
  }
}
```

Use a JSON validator: [jsonlint.com](https://jsonlint.com)

---

## Build Failures

### Template Copy Error

**Problem:**
```bash
Error: Template directory not found
```

**Solution:**
1. Update VeloKit to the latest version:
```bash
npm install -g @sploov/velokit@latest
```

2. Clear npm cache:
```bash
npm cache clean --force
```

3. Try again:
```bash
npx @sploov/velokit
```

---

### Dependency Installation Failed

**Problem:**
```bash
Dependency installation skipped. Run manually.
```

**Solution:**
This is a warning, not an error. Install dependencies manually:

```bash
cd your-project
npm install  # or pnpm install / yarn install
```

**Common causes:**
- Network issues
- Package manager not installed
- Package registry unavailable

---

## Discord Bot Issues

### Bot Token Invalid

**Problem:**
```bash
Error: An invalid token was provided
```

**Solution:**
1. Get a valid bot token:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create or select your application
   - Go to "Bot" section
   - Click "Reset Token" and copy the new token

2. Update your `.env` file:
```env
DISCORD_TOKEN=your_actual_bot_token_here
```

3. **Never share your token!**

---

### Missing Intents

**Problem:**
```bash
Error: Missing Access - GUILD_MEMBERS intent required
```

**Solution:**
Enable required intents in Discord Developer Portal:

1. Go to your bot in [Developer Portal](https://discord.com/developers/applications)
2. Navigate to "Bot" section
3. Scroll to "Privileged Gateway Intents"
4. Enable required intents:
   - ✅ Presence Intent (for member status)
   - ✅ Server Members Intent (for moderation)
   - ✅ Message Content Intent (for prefix commands)

---

### Bot Not Responding

**Problem:**
Bot is online but doesn't respond to commands.

**Solution:**

1. **Check if commands are registered:**
```bash
# Commands auto-register on startup
# Check console for registration logs
```

2. **Verify bot permissions:**
   - Bot needs "applications.commands" scope
   - Reinvite bot with proper permissions

3. **Check for errors:**
```bash
# Look at console output
# Check for error messages
```

4. **Verify command files:**
```bash
# Commands should be in src/commands/
ls src/commands/
```

---

## Music Bot Issues

### Lavalink Connection Failed

**Problem:**
```bash
Error: Could not connect to Lavalink
```

**Solution:**

1. **Ensure Lavalink is running:**
```bash
# Start Lavalink
java -jar Lavalink.jar
```

2. **Check configuration:**
```env
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASS=youshallnotpass
```

3. **Verify Lavalink requirements:**
   - Java 17 or higher installed
   - Port 2333 not in use
   - Proper application.yml configuration

4. **Test connection:**
```bash
# Check if Lavalink is accessible
curl http://localhost:2333
```

---

### Java Version Error

**Problem:**
```bash
Error: Unsupported class file major version
```

**Solution:**
Install Java 17 or higher:

```bash
# Check Java version
java -version

# Install Java 17
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Windows
# Download from adoptium.net
```

---

### Audio Quality Issues

**Problem:**
Choppy or poor quality audio playback.

**Solution:**

1. **Check Lavalink resources:**
   - Ensure adequate RAM (2GB+ recommended)
   - Check CPU usage

2. **Optimize Lavalink configuration:**
```yaml
# In application.yml
server:
  bufferDurationMs: 400
  frameBufferDurationMs: 5000
```

3. **Check network latency:**
   - Use Lavalink server closer to your bot
   - Consider hosting Lavalink on same machine

---

## AI Bot Issues

### API Key Invalid

**Problem:**
```bash
Error: Invalid API key
```

**Solution:**

1. **Verify API key format:**
```env
# Gemini
AI_API_KEY=AIzaSy...

# OpenAI
AI_API_KEY=sk-...

# Groq
AI_API_KEY=gsk_...
```

2. **Check API key is active:**
   - Visit provider dashboard
   - Verify key hasn't expired
   - Check usage limits

3. **Set correct provider:**
```env
AI_PROVIDER=Gemini  # or OpenAI, Groq
```

---

### Rate Limit Exceeded

**Problem:**
```bash
Error: Rate limit exceeded
```

**Solution:**

1. **Implement cooldowns:**
   - Add command cooldowns
   - Queue requests
   - Use caching where possible

2. **Upgrade API tier:**
   - Check provider pricing
   - Consider paid tier for higher limits

3. **Optimize requests:**
   - Reduce token usage
   - Batch similar requests
   - Cache common responses

---

## Database Issues

### MongoDB Connection Failed

**Problem:**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

1. **Start MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

2. **Check connection string:**
```env
MONGODB_URI=mongodb://localhost:27017/your-db-name
```

3. **Verify MongoDB is running:**
```bash
# Check if MongoDB is accessible
mongosh
```

---

### Database Authentication Failed

**Problem:**
```bash
Error: Authentication failed
```

**Solution:**

Update `.env` with proper credentials:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/dbname
```

---

## Docker Issues

### Docker Not Found

**Problem:**
```bash
docker: command not found
```

**Solution:**
Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

---

### Container Won't Start

**Problem:**
```bash
Error: Container exited with code 1
```

**Solution:**

1. **Check logs:**
```bash
docker-compose logs
```

2. **Verify environment variables:**
```bash
# Ensure .env file exists
ls -la .env
```

3. **Rebuild containers:**
```bash
docker-compose down
docker-compose up --build
```

---

## TypeScript Issues

### Type Errors

**Problem:**
```bash
error TS2304: Cannot find name 'xyz'
```

**Solution:**

1. **Install type definitions:**
```bash
npm install --save-dev @types/node @types/express
```

2. **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

---

### Build Errors

**Problem:**
```bash
npm run build fails
```

**Solution:**

1. **Clean build directory:**
```bash
rm -rf dist/
npm run build
```

2. **Update dependencies:**
```bash
npm update
```

---

## General Tips

### Getting Help

1. **Check Documentation:**
   - [VeloKit Docs](https://velokit.sploov.xyz)
   - [Discord.js Guide](https://discordjs.guide)

2. **Search Issues:**
   - [GitHub Issues](https://github.com/sploov-xyz/velokit/issues)

3. **Ask Community:**
   - [Discord Support Server](https://discord.gg/sploov)

4. **Enable Debug Logging:**
```env
DEBUG=true
LOG_LEVEL=debug
```

---

### Reporting Bugs

When reporting issues, include:

1. **VeloKit version:**
```bash
npx @sploov/velokit --version
```

2. **Node.js version:**
```bash
node --version
```

3. **Operating system:**
```bash
uname -a  # Linux/macOS
systeminfo  # Windows
```

4. **Error message:**
```
Copy the full error message
```

5. **Steps to reproduce:**
```
1. Run command X
2. Select option Y
3. Error occurs
```

---

## Still Having Issues?

Can't find your issue here? We're here to help!

- 💬 [Join Discord Support Server](https://discord.gg/sploov)
- 🐛 [Report Bug on GitHub](https://github.com/sploov-xyz/velokit/issues)
- 📧 Email: support@sploov.xyz

---

## Next Steps

- [Getting Started](./getting-started.md)
- [CLI Reference](./cli-reference.md)
- [Advanced Configuration](./advanced-config.md)
