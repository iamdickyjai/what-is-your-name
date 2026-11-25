import csv from '../../translation.csv?raw';
import type { PageServerLoad } from './$types';

const halfOrFullWidthComma = /[,，]/;

function parseTranslations(text: string) {
	return text
		.split(/\r?\n/)
		.flatMap((line) => {
			const [english, ...cantonese] = line
				.split(halfOrFullWidthComma)
				.map((field) => field.trim())
				.filter(Boolean);
			return english ? [{ english, cantonese }] : [];
		})
		.sort((a, b) => a.english.localeCompare(b.english));
}

export const load: PageServerLoad = () => ({ translations: parseTranslations(csv) });
