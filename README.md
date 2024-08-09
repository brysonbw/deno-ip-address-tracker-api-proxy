# IP Address Tracker API Proxy

Utilizing the [IPinfo API](https://ipinfo.io/) to track and analyze IP addresses through an API proxy

## Visit:
https://ip-address-tracker-io.vercel.app/

## Usage

```bash
git clone git@github.com:brysonbw/deno-ip-address-tracker-api-proxy.git
```

```bash
cd deno-ip-address-tracker-api-proxy
```

```bash
rm -rf .git
```

### .env

```text
PORT=""
ALLOWED_ORIGIN=""
IP_INFO_ACCESS_TOKEN=""
HOST=""
```

- **Port**: Port for server to run
- **Allowed Origin**: List (array) of allowed origins. **Note**: comma seperator in string
- **[IPinfo](https://ipinfo.io/signup)**: Signup or login to see your token
- **Host**: Hostname for server to run. For example, (when developing) `localhost` or `127.0.0.1`

### Start dev server

```bash
deno task dev
```

## API Endpoints

| Path                                   | Method | Description                                               | Fetch URL                                                    |
|----------------------------------------|--------|-----------------------------------------------------------|--------------------------------------------------------------|
| `/country,city?ipAddress=<IP_ADDRESS>` | GET    | Gets IP information data (i.e location, timezone, ect...) | https://ipinfo.io/`ipAddress`/json?token=`ipInfoAccessToken` |