import { Hono } from 'hono';
import { StatusCode } from 'https://deno.land/x/hono@v4.0.8/utils/http-status.ts';

const app = new Hono();

app.get('/', async (c) => {
	try {
		const url = `https://api.ipify.org?format=json`;
		const jsonResponse = await fetch(url);
		const data = await jsonResponse.json();
		if (!data.ip) throw Error;
		return c.json(
			{
				status: true,
				data: data.ip,
			},
			200,
		);
	} catch (error) {
		console.log(error);
		const response = {
			message: 'Could not retrieve IP Address',
			status_code: 500 as StatusCode,
		};
		return c.json(
			{
				status: false,
				message: response.message,
			},
			response.status_code,
		);
	}
});

export default app;
