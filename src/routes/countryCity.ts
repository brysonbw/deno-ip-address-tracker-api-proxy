import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { getValidationErrors } from '../utils/getValidationErrors.ts';
import { IpAddress, ipAddressSchema } from '../models/IpAddressSchema.ts';
import { StatusCode } from 'https://deno.land/x/hono@v4.0.8/utils/http-status.ts';

const app = new Hono();
const IP_INFO_ACCESS_TOKEN = Deno.env.get('IP_INFO_ACCESS_TOKEN');

app.get(
	'/',
	validator('query', (value, c) => {
		const result = ipAddressSchema.safeParse(value);
		if (!result.success) {
			return c.json(
				{
					status: false,
					errors: getValidationErrors(result.error.issues),
					message: 'Payload invalid',
				},
				400,
			);
		}
		return result.data;
	}),
	async (c) => {
		const paramObj: IpAddress = c.req.valid('query');
		const ipAddress = new URLSearchParams(paramObj).get('ipAddress');
		try {
			const url =
				`https://ipinfo.io/${ipAddress}/json?token=${IP_INFO_ACCESS_TOKEN}`;
			const jsonResponse = await fetch(url);
			const jsonData = await jsonResponse.json();
			if (jsonData.status === 404 || jsonData.error || !jsonData.loc) {
				throw new Error(
					jsonData.error?.message ??
						'Could not retrieve IP Address coordinates',
				);
			}
			// Config props
			// Lat/lon
			const [lat, lon] = jsonData.loc.split(',');
			// Org - ANS and IPS
			if (jsonData.org) {
				const orgSplit = jsonData.org.split(' ');
				jsonData.asn = orgSplit.shift();
				jsonData.isp = orgSplit.join(' ');
			}
			const data = {
				...jsonData,
				lat,
				lon,
			};
			return c.json(
				{
					status: true,
					data,
				},
				200,
			);
		} catch (error) {
			console.log(error);
			const response = {
				message: 'Could retrieve IP Address coordinates',
				status_code: 500 as StatusCode,
			};
			switch (error.message) {
				case 'Please provide a valid IP address':
					response.message = error.message;
					response.status_code = 404;
					break;
				default:
					response.message = error.message;
					response.status_code = 500;
			}
			return c.json(
				{
					status: false,
					message: response.message,
				},
				response.status_code,
			);
		}
	},
);

export default app;
