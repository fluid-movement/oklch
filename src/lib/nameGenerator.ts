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
