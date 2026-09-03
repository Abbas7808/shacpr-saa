const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'img');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const qrList = [
    {
        filename: 'qr_shacpr_saa_bls.png',
        url: 'https://shacpr-saa.vercel.app/',
        title: 'SHA BLS Provider (shacpr-saa.vercel.app)'
    },
    {
        filename: 'qr_shacpr_orrg_hsfa.png',
        url: 'https://shacpr-orrg.vercel.app/',
        title: 'SHA HSFA CPR AED (shacpr-orrg.vercel.app)'
    },
    {
        filename: 'qr_kashif_bls_local.png',
        url: 'http://localhost:3000/?course=bls&id=311214170424',
        title: 'Kashif Ali BLS Local'
    },
    {
        filename: 'qr_kashif_hsfa_local.png',
        url: 'http://localhost:3000/?course=hsfa&id=311213170329',
        title: 'Kashif Ali HSFA Local'
    },
    {
        filename: 'qr_code_card.png',
        url: 'https://shacpr-saa.vercel.app/',
        title: 'Card QR Code'
    },
    {
        filename: 'qr_code_diploma.png',
        url: 'https://shacpr-orrg.vercel.app/',
        title: 'Diploma QR Code'
    }
];

async function generateAll() {
    console.log('Generating QR Codes...');
    for (const item of qrList) {
        const filePath = path.join(outputDir, item.filename);
        await QRCode.toFile(filePath, item.url, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 500,
            margin: 2,
            color: {
                dark: '#00232d', // Official SHA dark navy
                light: '#ffffff'
            }
        });
        console.log(`Generated: ${item.filename} -> ${item.url}`);
    }
    console.log('All QR codes generated successfully!');
}

generateAll().catch(err => {
    console.error(err);
    process.exit(1);
});
