import { Hono } from 'hono';
import { cors, logger, prettyJSON, secureHeaders } from 'hono/middleware';
import { loadEnv } from './config/loadEnv.ts';
import countryCity from './routes/countryCity.ts';
import UserIp from './routes/userIp.ts';

await loadEnv();

const app = new Hono();
const kv = await Deno.openKv();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Limit each IP to 100 requests per `window` (here, per 15 minutes).

// Rate limiting middleware
app.use('*', async (ctx, next) => {
	if (Deno.env.get('DENO_ENV') != 'production') {
		return next();
	}
	const ip = ctx.req.header('X-Forwarded-For');
	const now = Date.now();
	const windowStart = now - RATE_LIMIT_WINDOW;
	const key: string = `rate_limit:${ip}`;

	// Get the current data from KV store
	const record = await kv.get(['ips', key]);
	const data = record.value as { count: number; timestamp: any };
	let count = 0;
	let timestamp = now;

	if (data) {
		count = data.count;
		timestamp = data.timestamp;
	}

	if (timestamp < windowStart) {
		// Reset count and timestamp if outside the window
		count = 1;
		timestamp = now;
	} else {
		count++;
	}

	// Store the updated count and timestamp
	await kv.set(['ips', key], { count, timestamp });

	// Check if the request count exceeds the limit
	if (count > MAX_REQUESTS) {
		return ctx.json({ status: false, error: 'Too many requests' }, 429);
	}

	return next();
});

// middleware
app.use('*', secureHeaders());
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
	'*',
	cors({
		origin: Deno.env.get('ALLOWED_ORIGIN')?.split(', ') as string[],
		allowMethods: ['GET'],
	}),
);

//? health check/route
app.get(
	'/',
	(c) => c.json({ status: true }, 200),
);

// routes
app.route('/api/v1/country,city', countryCity);
app.route('/api/v1/uip', UserIp);

//! not found
app.notFound((c) =>
	c.json(
		{ status: false, error: 'Not Found', messgae: 'Invalid Request' },
		404,
	)
);

Deno.serve(
	{ port: Number(Deno.env.get('PORT')), hostname: Deno.env.get('HOST') },
	app.fetch,
);
