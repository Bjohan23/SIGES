// Script para aplicar el tema antes de que se renderice la página
// Esto evita el flash de contenido

export function ThemeScript() {
  const themeScript = `
    (function() {
      function getInitialTheme() {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
      }

      function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }

      // Prevenir FOUC (Flash of Unstyled Content)
      // Aplicar tema inmediatamente antes de que el body se renderice
      try {
        const theme = getInitialTheme();
        applyTheme(theme);

        // Guardar en localStorage para referencia futura
        localStorage.setItem('initial-theme', theme);
      } catch (e) {
        // Si hay error con localStorage, solo aplicar el tema
        applyTheme(getInitialTheme());
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
