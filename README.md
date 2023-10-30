![Header](https://socialify.git.ci/chimpdev/squirrelers-bot/image?description=1&font=Jost&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Light)

## 🔗 Invite

Go to [this link](https://discord.com/api/oauth2/authorize?client_id=1160905184663314532&permissions=34816&scope=bot) and add the bot to your server.

## 🖥️ Hosting

We are hosting Squirrelers bot on our own servers. Bot will be online 24/7. If you want to host the bot on your own server, you can follow the steps below.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18 recommended)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository
```bash
git clone
```

2. Go to the project directory
```bash
cd squirrelers-bot
```

3. Install dependencies
```bash
pnpm i
```

4. Create a mongo uri
**4.1** Create a new cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
**4.2** - Create a new database user
**4.3** - Whitelist your IP address
**4.5** - Copy the connection string
5. Create a new application on [Discord Developer Portal](https://discord.com/developers/applications)
**5.1** - Copy the bot token

6. Edit `.env` file (see below)

7. Start the bot
```bash
pnpm start
```

## `.env` file

This bot uses `.env` file to store sensitive data. You can create `.env` file in the root directory of the project and add the following variables to it.

| Variable | Description | Required
| - | - | -
| `DISCORD_TOKEN` | Discord bot token | ✅
| `MONGO_URI` | MongoDB connection string | ✅