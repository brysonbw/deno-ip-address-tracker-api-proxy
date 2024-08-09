import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts';

const ipv4Regex =
	/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex =
	/^((([0-9A-Fa-f]{1,4}:){1,6}:)|(([0-9A-Fa-f]{1,4}:){7}))([0-9A-Fa-f]{1,4})$/;

export const ipAddressSchema = z.object({
	ipAddress: z.string().refine((value) => {
		return ipv4Regex.test(value) || ipv6Regex.test(value);
	}, {
		message: 'IP Address invalid. Must be v4 or v6',
	}),
});

export type IpAddress = z.infer<typeof ipAddressSchema>;
