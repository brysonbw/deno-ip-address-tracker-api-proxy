# IP Address Tracker API Proxy</h1>

Track and analyze IP addresses. Utilize the app to view the location of any IP address on a [Cesium](https://cesium.com/platform/cesiumjs/) map and retrieve detailed information through the [IPinfo API](https://ipinfo.io/) via an API proxy.

IP Address Tracker (web) api proxy. Track and analyze IP addresses. Using [IPinfo API](https://ipinfo.io/) and [Ipify API](https://geo.ipify.org/docs).

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

```bash
cp .env.example .env.development
```

```text
PORT=""
ALLOWED_ORIGIN=""
IP_INFO_ACCESS_TOKEN=""
HOST=""
```

- **Port**: Port for server to run
- **Allowed Origin**: List (array) of allowed origins. **Note**: comma seperator in string
- **[IPinfo](https://ipinfo.io/signup)**: Signup or login to see your token
- **Host**: Hostname for server to run. For example, `localhost` or `127.0.0.1`

### Start dev server

```bash
deno task dev
```

## API Endpoints

| Path                                   | Method | Description                                               | Fetch URL                                                    |
|----------------------------------------|--------|-----------------------------------------------------------|--------------------------------------------------------------|
| `/country,city?ipAddress=<IP_ADDRESS>` | GET    | Gets IP information data (i.e location, timezone, ect...) | https://ipinfo.io/`ipAddress`/json?token=`ipInfoAccessToken` |
| `/uip`                                 | GET    | Gets user IP                                              | https://api.ipify.org?format=json                            |