# Reveraki

Minimalistic simple-looking Anime website created using Next.js 14 and Tailwind CSS.

## Features

- Fast
- Mobile/Tablet friendly
- Easy to navigate
- Trending/Popular/Seasonal anime
- No Ads

## Screenshots

### Home Page

![home](https://media.discordapp.net/attachments/1233827110171185313/1236138770407886899/image.png?ex=6636eb71&is=663599f1&hm=de3ad764ac67dd72ad23228ad25f6cca07b0afb56b194bf92c7eecdb5ee10bd8&=&format=webp&quality=lossless&width=1163&height=662)

### Trending/Popular Page

![popularOrTrending](https://media.discordapp.net/attachments/1233827110171185313/1236139073341489322/image.png?ex=6636ebb9&is=66359a39&hm=480dc41b686f3be0fe7d976434c799dc8c43b393735424568b9eb746fc5a95f0&=&format=webp&quality=lossless&width=687&height=395)

### Information Page

![info](https://media.discordapp.net/attachments/1233827110171185313/1236139305525837854/image.png?ex=6636ebf0&is=66359a70&hm=dbd7ec627c236b0c3ab952471fe6b47392b551c8fb5ce9cdbebdaf7230ffb417&=&format=webp&quality=lossless&width=687&height=391)

### Watch Page

![watch](https://media.discordapp.net/attachments/1233827110171185313/1236291819399286824/image.png?ex=663779fa&is=6636287a&hm=f4ce0ba6102aeef6743ca51307e117143f58a99bac9814587e3e947630e1ebda&=&format=webp&quality=lossless&width=1397&height=662)

## Self-Host

### Clone and install packages

First, clone the repository:

```sh
git clone https://github.com/codeblitz97/reveraki.git
```

Then navigate to the folder and install packages with your preferred package manager.

```sh
npm install # or yarn install or bun install
```

### Editing environment variables

Rename the `.env.example` file to `.env.local` and fill in these:

```env
REDIS_URI = ""  # Your Redis URI. Not required. Remove this if you don't need Redis for caching. It will use node-cache by default.

CONSUMET_API = ""  # Consumet API. Host from: https://github.com/consumet/api.consumet.org/
NEXT_PUBLIC_DOMAIN = "http://localhost:3000"  # Your website URL (required for info and episode), replace it with your website URL
```

### Starting in development mode

To start the application in development mode, run any of these commands:

```sh
bun dev
# or yarn
yarn dev
# or npm
npm dev
```

## Note

If you like this project, consider giving it a star <3
