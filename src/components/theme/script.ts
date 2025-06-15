// @ts-ignore

// script.js - Export this function and use it in your ThemeManager
export const script = (localStorageKey, userStorageKey, defaultTheme) => {
	const el = document.documentElement;
	const MEDIA = "(prefers-color-scheme: dark)";

	function getSystemTheme() {
		return window.matchMedia(MEDIA).matches ? "dark" : "light";
	}

	function updateDOM(theme) {
		// Resolve system theme if needed
		let resolvedMode = theme.mode;
		if (resolvedMode === "system") {
			resolvedMode = getSystemTheme();
		}

		// Apply data attributes
		el.setAttribute("data-mode", resolvedMode);
		el.setAttribute("data-theme", theme.name);
		el.setAttribute("data-decoration", theme.decoration);

		// Apply color scheme
		el.style.colorScheme = resolvedMode;
	}

	function getStoredTheme() {
		try {
			// Try to get user theme preferences
			const userTheme = localStorage.getItem(userStorageKey);
			if (userTheme) {
				try {
					const parsed = JSON.parse(userTheme);
					// Handle nested structure - adjust based on your storage format
					return parsed.value || parsed;
				} catch (_e) {
					// Fall through to local storage
				}
			}

			// Fall back to local theme preferences
			const localTheme = localStorage.getItem(localStorageKey);
			if (localTheme) {
				try {
					const parsed = JSON.parse(localTheme);
					return parsed.value || parsed;
				} catch (_e) {
					// Fall through to default
				}
			}

			return defaultTheme;
		} catch (_e) {
			return defaultTheme;
		}
	}

	// Apply the theme
	const theme = getStoredTheme();
	updateDOM(theme);
};
