const devices = ['mobile', 'tablet', 'desktop'];
const themes = ['light-mode', 'dark-mode'];

/**
 * Executa um describe para cada combinação de device e theme.
 * @param {string} title - Título base do describe.
 * @param {function} specFn - Função de teste, recebe (device, theme).
 */
export const testOnAllDevicesAndThemes = (title, callback) => {
  devices.forEach((device) => {
    themes.forEach((theme) => {
      describe(`${title} [${device}, ${theme}]`, () => {
        callback(device, theme);
      });
    });
  });
};