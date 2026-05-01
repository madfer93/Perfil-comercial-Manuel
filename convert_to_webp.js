const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Carpeta de imágenes
const assetsDir = path.join(__dirname, 'assets');

// Verificar si cwebp está instalado (o sugerir instalación)
exec('cwebp -version', (err) => {
    if (err) {
        console.error('❌ Error: No se encontró "cwebp" instalado.');
        console.log('Por favor instala libwebp o usa: npm install -g webp-converter');
        return;
    }

    fs.readdirSync(assetsDir).forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const input = path.join(assetsDir, file);
            const output = path.join(assetsDir, file.replace(ext, '.webp'));
            
            exec(`cwebp -q 80 "${input}" -o "${output}"`, (error) => {
                if (error) {
                    console.error(`Error convirtiendo ${file}:`, error);
                } else {
                    console.log(`✅ Convertido: ${file} -> ${path.basename(output)}`);
                }
            });
        }
    });
});
