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
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
        title: 'SHA BLS Provider (shacpr-saa-sable.vercel.app)'
    },
    {
        filename: 'qr_shacpr_orrg_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=311213170329',
        title: 'SHA HSFA CPR AED (shacpr-saa-sable.vercel.app)'
    },
    {
        filename: 'qr_kashif_bls_local.png',
        url: 'http://localhost:3000/verify?course=bls&id=311214170424',
        title: 'Kashif Ali BLS Local'
    },
    {
        filename: 'qr_kashif_hsfa_local.png',
        url: 'http://localhost:3000/verify?course=hsfa&id=311213170329',
        title: 'Kashif Ali HSFA Local'
    },
    {
        filename: 'qr_code_card.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
        title: 'Card QR Code'
    },
    {
        filename: 'qr_code_diploma.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=311213170329',
        title: 'Diploma QR Code'
    },
    {
        filename: 'qr_static_hsfa_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'Static QR HSFA Course (shacpr-saa-sable.vercel.app/verify?course=hsfa)'
    },
    {
        filename: 'qr_static_bls_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls',
        title: 'Static QR BLS Course (shacpr-saa-sable.vercel.app/verify?course=bls)'
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
