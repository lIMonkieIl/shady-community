// @ts-nocheck

export const script = (theme) => {
	function getSystemThemeMode() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	try {
		const el = document.documentElement;
		let storedTheme = theme;

		try {
			const storedUserPreference = localStorage.getItem("theme-preferences");
			storedTheme = storedUserPreference
				? JSON.parse(storedUserPreference).value
				: JSON.stringify(theme);
		} catch (_error) {
			storedTheme = theme;
		}

		if (theme.mode === "system") {
			const systemMode = getSystemThemeMode();
			el.setAttribute("data-mode", systemMode);
			el.style.colorScheme = systemMode;
		} else {
			el.setAttribute("data-mode", storedTheme.mode);
			el.style.colorScheme = storedTheme.mode;
		}

		el.setAttribute("data-theme", storedTheme.name);
		el.setAttribute("data-decoration", storedTheme.decoration);
	} catch (_error) {
		const d = document.documentElement;
		d.setAttribute("data-mode", theme.mode);
		d.setAttribute("data-theme", theme.name);
		d.setAttribute("data-decoration", theme.decoration);
	}
};
