import { pixelBasedPreset } from '@react-email/tailwind'

/**
 * Tailwind config for React Email templates.
 * Uses pixelBasedPreset so styles are in px (not rem) for email client compatibility.
 */
export const emailTailwindConfig = {
	presets: [pixelBasedPreset],
}
