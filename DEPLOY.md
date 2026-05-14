# Deploying automationhub.ph to Railway

## Prerequisites

- Railway account at railway.app
- Domain `www.automationhub.ph` with DNS access
- GoHighLevel Private Integration Token + Location ID
- Node.js 20+ locally for setup

---

## 1. Generate admin password hash

```bash
cd server
node src/db/hashpw.js yourSecurePassword
# Copy the output hash — you'll need it in step 3
```

---

## 2. Push repo to GitHub

```bash
git add .
git commit -m "feat: initial automationhub.ph site"
git remote add origin https://github.com/youruser/automationhub
git push -u origin main
```

---

## 3. Create Railway project

1. Go to railway.app → New Project → Deploy from GitHub repo
2. Select this repository

### Add PostgreSQL

- Click **+ New** → **Database** → **PostgreSQL**
- Railway auto-injects `DATABASE_URL` into all services

### Configure the Server service

Set these environment variables in Railway dashboard:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | random 64-char string (`openssl rand -hex 32`) |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD_HASH` | hash from step 1 |
| `GHL_API_KEY` | GoHighLevel Private Integration Token |
| `GHL_LOCATION_ID` | Your GHL sub-account location ID |
| `CLIENT_URL` | `https://www.automationhub.ph` |
| `PORT` | `3001` |

Set root directory to `server/`, start command: `node src/index.js`

### Configure the Client service

- Add a second service from the same repo
- Set root directory to `client/`
- Build command: `npm install && npm run build`
- Start command: `npx serve dist -l $PORT`

---

## 4. Seed the database

After the server service is deployed and healthy:

```bash
# In Railway → server service → Shell tab
node src/db/seed.js
```

---

## 5. Set up custom domain

- Railway → client service → Settings → Domains → Add Custom Domain
- Enter `www.automationhub.ph`
- Add the CNAME record Railway provides to your DNS registrar
- Railway handles SSL automatically

For the API, either:
- Same service (Express serves React build) — single domain, no CORS
- Or add `api.automationhub.ph` pointing to the server service

---

## 6. Verify

- `https://www.automationhub.ph` → public site loads
- Submit contact form → check Railway server logs + GHL contacts
- `https://www.automationhub.ph/admin` → login with seeded credentials
- Add/edit a project → appears on home page immediately

---

## Local development

```bash
# Install all deps
npm install

# Copy env files
cp server/.env.example server/.env
# Fill in server/.env values

# Start both client (port 5173) and server (port 3001)
npm run dev

# Run DB migrations (requires local Postgres or Railway tunnel)
npm run migrate --workspace=server

# Seed content
npm run seed --workspace=server
```
