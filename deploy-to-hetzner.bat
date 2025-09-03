@echo off
echo ========================================
echo 🚀 Деплой PocketBase на Hetzner VPS
echo IP: 91.98.74.36
echo ========================================

echo.
echo 📤 Копіюємо setup скрипт на сервер...

scp hetzner-setup-optimized.sh root@91.98.74.36:/root/pocketbase-setup.sh

echo.
echo ✅ Файл скопійовано!
echo.
echo 📝 Наступні кроки:
echo   1. Підключіться до сервера: ssh root@91.98.74.36
echo   2. Надайте права: chmod +x pocketbase-setup.sh
echo   3. Запустіть setup: ./pocketbase-setup.sh
echo.
echo 🎯 Або виконайте все одразу:
echo   ssh root@91.98.74.36 "chmod +x pocketbase-setup.sh && ./pocketbase-setup.sh"
echo.
pause

