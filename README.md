## Development Running (Locally)

Setup `.env` file with these parameters:
```
MONGODB_URI=mongodb+srv://...
CLIENT_URL=http://localhost:3000
PORT=5000
```

After that, run several commands:

`npm run setup`

`npm run dev`

Open [http://localhost:3000](http://localhost:3000) and check result.

###

## Production Running (Renderer)

**Environment:** Node

**Build Command:** `npm install && npm run build`

**Start Command:** `npm start`

**Environment Variables:**
- `MONGODB_URI=mongodb+srv://...`
- `CLIENT_URL=`<your service URL (for ex.: https://your-app.onrender.com)>

## Commands
| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run setup`  | Install dependencies for server + client |
| `npm run dev`    | Run server + client                      |
| `npm run server` | Only server (with `nodemon`)             |
| `npm run client` | Only client (React dev server)           |
| `npm run build`  | Build React (for production)             |
| `npm start`      | Run production server (Express + build)  |
