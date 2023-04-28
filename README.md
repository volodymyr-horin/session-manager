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

## Testing
For testing you can do next steps.

Update session timeouts:
```bash
SESSION_ACTIVITY_TTL=60000 # 1 minute
SESSION_BLOCK_TTL=5000 # 5 seconds
```

Go to http://localhost:3000/docs and use next requests:
 - Create user with `POST /v1/user/sign-up`.
 - Login with `POST /v1/auth/login`.
 - Set token from login response in swagger Authorize.
 - Play with `GET /v1/user/me` to check block session functionality.