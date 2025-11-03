@echo off
TITLE Iniciando Draftosaurus

:: --- CONFIGURACIÓN ---
:: Edita estas dos líneas si tus carpetas son diferentes

:: 1. Define la ruta donde instalaste XAMPP
SET XAMPP_PATH=C:\xampp

:: 2. Define la ruta COMPLETA a tu proyecto (la carpeta que está dentro de htdocs)
SET PROJECT_PATH=C:\xampp\htdocs\draftosaurus

:: --- NO EDITES DEBAJO DE ESTA LÍNEA ---

ECHO.
ECHO ==================================================
ECHO     Iniciando Servidor Draftosaurus
ECHO ==================================================
ECHO.

:: Inicia Apache
ECHO [1/4] Iniciando Apache...
CALL "%XAMPP_PATH%\apache_start.bat"

:: Inicia MySQL
ECHO [2/4] Iniciando MySQL...
CALL "%XAMPP_PATH%\mysql_start.bat"

ECHO.
ECHO       Esperando 10 segundos a que los servicios arranquen...
TIMEOUT /T 10 /NOBREAK > NUL

ECHO.
ECHO [3/4] Importando la base de datos (draftosaurus.sql)...
ECHO       (Si ves un error aquí, revisa el usuario/contraseña de MySQL)
ECHO.

:: Ejecuta el archivo .sql
:: Asume que el usuario es 'root' y no tiene contraseña (default en XAMPP)
"%XAMPP_PATH%\mysql\bin\mysql.exe" -u root < "%PROJECT_PATH%\database\draftosaurus.sql"

ECHO.
ECHO [4/4] ¡Listo! Abriendo el juego en el navegador...
ECHO.

:: Abre el navegador
start http://localhost/draftosaurus/Frontend/index.html

PAUSE