@echo off
choice /c YN /d "Do you have NODEJS installed ?"
if "%errorlevel%" == "2" (winget install nodejs)
npm install sharp
npm install argparse
start https://fonts.google.com/specimen/Russo+One
