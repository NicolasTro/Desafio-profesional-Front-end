import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Cargar variables de entorno desde .env.local

(async function loginTest() {
    const edgeDriverPath = process.env.EDGE_DRIVER_PATH;
    if (!edgeDriverPath) {
        console.error('Error: La variable de entorno EDGE_DRIVER_PATH no está configurada.');
        return;
    }

    const service = new edge.ServiceBuilder(edgeDriverPath); // Usar la variable de entorno para la ruta del WebDriver
    let driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeService(service).build();

    try {
        // Navegar a la página de inicio de sesión
        await driver.get('http://localhost:3000/login'); 

        // Step 1: Ingresar el email y continuar
        const emailField = await driver.wait(until.elementLocated(By.id('email-input')), 5000);
        const continueButton = await driver.wait(until.elementLocated(By.id('continue-button')), 5000);
        await emailField.sendKeys('nikprueba@user.com');
        await continueButton.click();

        // Step 2: Ingresar la contraseña
        const passwordField = await driver.wait(until.elementLocated(By.id('password-input')), 5000);
        const loginButton = await driver.wait(until.elementLocated(By.id('login-button')), 5000);
        await passwordField.sendKeys('Colmillo27!');
        await loginButton.click();

        // Esperar a que el path sea '/dashboard'
        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();
            return currentUrl.includes('/home');
        }, 10000); // 10 segundos

        console.log('Prueba de inicio de sesión exitosa');
    } catch (error) {
        console.error('Error en la prueba de inicio de sesión:', error);
    } finally {
        // Cerrar el navegador
        await driver.quit();
    }
})();
