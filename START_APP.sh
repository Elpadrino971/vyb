#!/bin/bash

echo "🎵 Démarrage de Vybzzz..."
echo ""
echo "📂 Navigation vers le répertoire..."
cd /home/user/vyb

echo "✅ Installation des dépendances..."
npm install

echo ""
echo "🚀 Lancement du serveur Expo..."
echo ""
echo "Une fois lancé, appuyez sur :"
echo "  - 'i' pour iOS Simulator"
echo "  - 'a' pour Android Emulator"
echo "  - 'w' pour Web Browser"
echo "  - Scannez le QR code avec Expo Go pour un appareil physique"
echo ""

npm start
