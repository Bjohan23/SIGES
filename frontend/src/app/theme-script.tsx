// Script para aplicar el tema antes de que se renderice la página
// Esto evita el flash de contenido

export function ThemeScript() {
  const themeScript = `
    (function() {
      function getAutoTheme() {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
      }

      function applyTheme(theme) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      try {
        const savedTheme = localStorage.getItem('theme');
        const savedIsAuto = localStorage.getItem('themeAuto');

        if (savedIsAuto === 'false' && savedTheme) {
          applyTheme(savedTheme);
        } else {
          applyTheme(getAutoTheme());
        }
      } catch (e) {
        // Si hay error, aplicar tema por defecto según hora
        applyTheme(getAutoTheme());
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
