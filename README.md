# 📈 Trading Dashboard (Go + React + WebSockets + Docker + NGINX)

A real-time trading dashboard built with:

- **Golang** (API + WebSocket price simulator)
- **React + Vite** (frontend)
- **Docker Compose** (orchestration)
- **NGINX** (reverse proxy)
- **AWS EC2** (production deployment)
- **WebSockets** for live stock updates

---

## 🚀 Features

### Backend (Go)
- Real-time stock price simulator  
- REST APIs  
  - `GET /api/prices`  
  - `GET /api/orders`  
  - `POST /api/orders`
- WebSocket Server  
  - `ws://<host>/ws`
- Lightweight Alpine multi-stage Docker build

### Frontend (React + Vite)
- Real-time price chart  
- Send buy/sell orders  
- WebSocket live updates  
- Built using Vite → served as static files via NGINX  
- UI using shadcn/ui + TailwindCSS

### Infra (Docker + NGINX)
- NGINX serves frontend & proxies backend  
- Docker Compose manages all services  
- Production-ready setup

---

## 📂 Project Structure

```

.
├── backend/
│   ├── main.go
│   ├── controller/
│   ├── websocket/
│   ├── model/
│   ├── go.mod
│   ├── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.production
│   ├── package.json
│   ├── Dockerfile
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md

```

---

## ⚙️ Environment Variables

Create `frontend/.env.production`:

```

VITE_API_BASE_URL=http://YOUR_PUBLIC_IP/api
VITE_WS_URL=ws://YOUR_PUBLIC_IP/ws

```

Vite loads `.env.production` automatically during:

```

npm run build

````

---

## 🐳 Docker Commands

### Build & start everything

```sh
docker compose up --build -d
````

### Stop everything

```sh
docker compose down
```

### Rebuild only frontend

```sh
docker compose build frontend
```

### View logs

```sh
docker compose logs -f
```

---

## 🐳 docker-compose.yml (Overview)

* Backend accessible only inside the Docker network
* Frontend build exported via Docker
* NGINX serves static files + proxies `/api` & `/ws`

---

## 🌐 NGINX Reverse Proxy

`nginx/nginx.conf`:

```nginx
server {
    listen 80;

    # Serve frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API
    location /api/ {
        proxy_pass http://backend:8000;
    }

    # Proxy WebSocket
    location /ws/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

---

## 🧪 Local Development

### Backend

```sh
cd backend
go run main.go
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

---

## 🚀 Deploying on AWS EC2

### 1. Install Docker + Docker Compose

```sh
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker --now
sudo usermod -aG docker ubuntu
sudo apt install docker-compose-plugin -y
```

### 2. Clone the project

```sh
git clone <repo-url>
cd trading-dashboard
```

### 3. Add production env

```
cd frontend
nano .env
```

Add:

```
VITE_API_BASE_URL=http://YOUR_PUBLIC_IP/api
VITE_WS_URL=ws://YOUR_PUBLIC_IP/ws
```

### 4. Build & run

```sh
docker compose down --volumes
docker compose up --build -d
```

App will be available at:

```
http://YOUR_PUBLIC_IP
```

---

## 🛠 Troubleshooting

### Backend works but frontend times out

Your dist still contains old env variables.

Fix:

```sh
docker compose build --no-cache frontend
docker compose up -d
```

### Check which URL frontend is using

```sh
docker compose exec nginx sh -c "grep -R 'http' /usr/share/nginx/html | head"
```

---

## 📄 License

MIT License