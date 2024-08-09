import { load } from 'std/dotenv/mod.ts';

export async function loadEnv() {
	if (Deno.env.get('DENO_ENV') != 'production') {
		if (
			Deno.env.get('DENO_ENV') != 'development' ||
			Deno.env.get('DENO_ENV') == undefined
		) {
			Deno.env.set('DENO_ENV', 'development');
		}
	}

	await load({
		envPath: Deno.env.get('DENO_ENV') === 'production'
			? '.env.production'
			: '.env.development',
		export: true, // Exports all variables to the environment
	});
}
