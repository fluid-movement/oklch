const ADJECTIVES = [
	'Velvet', 'Ember', 'Dusty', 'Nordic', 'Cosmic', 'Electric',
	'Muted', 'Warm', 'Amber', 'Misty', 'Deep', 'Pale',
	'Frosted', 'Golden', 'Crimson', 'Azure', 'Tawny', 'Ashen',
	'Lucent', 'Dim', 'Vivid', 'Hushed', 'Bold', 'Soft',
	'Smoky', 'Neon', 'Antique', 'Wild', 'Gentle', 'Sharp'
];

const NOUNS = [
	'Dawn', 'Dusk', 'Coast', 'Grove', 'Storm', 'Mesa',
	'Frost', 'Tide', 'Ember', 'Haze', 'Ridge', 'Bloom',
	'Flare', 'Shore', 'Veil', 'Glow', 'Shade', 'Drift',
	'Crest', 'Hollow', 'Petal', 'Mist', 'Flint', 'Cove',
	'Peak', 'Lagoon', 'Ash', 'Rift', 'Glade', 'Nova'
];

export function randomName(): string {
	const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
	return `${adj} ${noun}`;
}

export function randomColorName(used: Set<string> = new Set()): string {
	const available = NOUNS.filter((n) => !used.has(n));
	if (available.length === 0) {
		// All nouns taken — append a number
		const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
		let i = 2;
		while (used.has(`${noun}${i}`)) i++;
		return `${noun}${i}`;
	}
	return available[Math.floor(Math.random() * available.length)];
}
