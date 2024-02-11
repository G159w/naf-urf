
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "var(--color-secondary-900)",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "4px",
		"--theme-rounded-container": "4px",
		"--theme-border-base": "0px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "255 255 255",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #e9a735 
		"--color-primary-50": "252 242 225", // #fcf2e1
		"--color-primary-100": "251 237 215", // #fbedd7
		"--color-primary-200": "250 233 205", // #fae9cd
		"--color-primary-300": "246 220 174", // #f6dcae
		"--color-primary-400": "240 193 114", // #f0c172
		"--color-primary-500": "233 167 53", // #e9a735
		"--color-primary-600": "210 150 48", // #d29630
		"--color-primary-700": "175 125 40", // #af7d28
		"--color-primary-800": "140 100 32", // #8c6420
		"--color-primary-900": "114 82 26", // #72521a
		// secondary | #ee463a 
		"--color-secondary-50": "252 227 225", // #fce3e1
		"--color-secondary-100": "252 218 216", // #fcdad8
		"--color-secondary-200": "251 209 206", // #fbd1ce
		"--color-secondary-300": "248 181 176", // #f8b5b0
		"--color-secondary-400": "243 126 117", // #f37e75
		"--color-secondary-500": "238 70 58", // #ee463a
		"--color-secondary-600": "214 63 52", // #d63f34
		"--color-secondary-700": "179 53 44", // #b3352c
		"--color-secondary-800": "143 42 35", // #8f2a23
		"--color-secondary-900": "117 34 28", // #75221c
		// tertiary | #db1363 
		"--color-tertiary-50": "250 220 232", // #fadce8
		"--color-tertiary-100": "248 208 224", // #f8d0e0
		"--color-tertiary-200": "246 196 216", // #f6c4d8
		"--color-tertiary-300": "241 161 193", // #f1a1c1
		"--color-tertiary-400": "230 90 146", // #e65a92
		"--color-tertiary-500": "219 19 99", // #db1363
		"--color-tertiary-600": "197 17 89", // #c51159
		"--color-tertiary-700": "164 14 74", // #a40e4a
		"--color-tertiary-800": "131 11 59", // #830b3b
		"--color-tertiary-900": "107 9 49", // #6b0931
		// success | #aa341e 
		"--color-success-50": "242 225 221", // #f2e1dd
		"--color-success-100": "238 214 210", // #eed6d2
		"--color-success-200": "234 204 199", // #eaccc7
		"--color-success-300": "221 174 165", // #ddaea5
		"--color-success-400": "196 113 98", // #c47162
		"--color-success-500": "170 52 30", // #aa341e
		"--color-success-600": "153 47 27", // #992f1b
		"--color-success-700": "128 39 23", // #802717
		"--color-success-800": "102 31 18", // #661f12
		"--color-success-900": "83 25 15", // #53190f
		// warning | #d6e006 
		"--color-warning-50": "249 250 218", // #f9fada
		"--color-warning-100": "247 249 205", // #f7f9cd
		"--color-warning-200": "245 247 193", // #f5f7c1
		"--color-warning-300": "239 243 155", // #eff39b
		"--color-warning-400": "226 233 81", // #e2e951
		"--color-warning-500": "214 224 6", // #d6e006
		"--color-warning-600": "193 202 5", // #c1ca05
		"--color-warning-700": "161 168 5", // #a1a805
		"--color-warning-800": "128 134 4", // #808604
		"--color-warning-900": "105 110 3", // #696e03
		// error | #1cabde 
		"--color-error-50": "221 242 250", // #ddf2fa
		"--color-error-100": "210 238 248", // #d2eef8
		"--color-error-200": "198 234 247", // #c6eaf7
		"--color-error-300": "164 221 242", // #a4ddf2
		"--color-error-400": "96 196 232", // #60c4e8
		"--color-error-500": "28 171 222", // #1cabde
		"--color-error-600": "25 154 200", // #199ac8
		"--color-error-700": "21 128 167", // #1580a7
		"--color-error-800": "17 103 133", // #116785
		"--color-error-900": "14 84 109", // #0e546d
		// surface | #363e53 
		"--color-surface-50": "225 226 229", // #e1e2e5
		"--color-surface-100": "215 216 221", // #d7d8dd
		"--color-surface-200": "205 207 212", // #cdcfd4
		"--color-surface-300": "175 178 186", // #afb2ba
		"--color-surface-400": "114 120 135", // #727887
		"--color-surface-500": "54 62 83", // #363e53
		"--color-surface-600": "49 56 75", // #31384b
		"--color-surface-700": "41 47 62", // #292f3e
		"--color-surface-800": "32 37 50", // #202532
		"--color-surface-900": "26 30 41", // #1a1e29
		
	}
}