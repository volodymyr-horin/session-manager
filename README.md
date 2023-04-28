# Session manager

## Local Start

Install dependencies:
```bash
npm i
```

Setup local env variables:
```bash
cp example.env .env
```

Run postgres and redis with docker-compose:
```bash
docker-compose up -d
```

Run application:
```bash
npm start
```

Visit http://localhost:3000/docs