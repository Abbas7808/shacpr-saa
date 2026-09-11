const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'img');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const qrList = [
    {
        filename: 'qr_mehdi_bls.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'Mehdi Hussain Ali - SHA BLS Provider'
    },
    {
        filename: 'qr_mehdi_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'Mehdi Hussain Ali - SHA Hearts Saver First Aid'
    },
    {
        filename: 'qr_static_bls_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls',
        title: 'Static QR BLS Course (shacpr-saa-sable.vercel.app/verify?course=bls)'
    },
    {
        filename: 'qr_static_hsfa_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'Static QR HSFA Course (shacpr-saa-sable.vercel.app/verify?course=hsfa)'
    },
    {
        filename: 'qr_mehdi_bls_local.png',
        url: 'http://localhost:3000/verify?course=bls&id=20979225338',
        title: 'Mehdi Hussain Ali BLS Local'
    },
    {
        filename: 'qr_mehdi_hsfa_local.png',
        url: 'http://localhost:3000/verify?course=hsfa&id=21172105024',
        title: 'Mehdi Hussain Ali HSFA Local'
    },
    {
        filename: 'qr_code_card.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'Card QR Code (BLS)'
    },
    {
        filename: 'qr_code_diploma.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'Diploma QR Code (HSFA)'
    },
    {
        filename: 'qr_shacpr_saa_bls.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'SHA BLS Provider'
    },
    {
        filename: 'qr_shacpr_orrg_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'SHA HSFA CPR AED'
    },
    {
        filename: 'qr_mehdi_heart_saver_first_aid.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'Mehdi Hussain Ali - SHA Hearts Saver First Aid (https://shacpr-saa-sable.vercel.app/verify?course=hsfa)'
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

    // Also update root static QR code files
    fs.copyFileSync(path.join(outputDir, 'qr_static_bls_course.png'), path.join(__dirname, 'qr_static_bls_course.png'));
    fs.copyFileSync(path.join(outputDir, 'qr_static_hsfa_course.png'), path.join(__dirname, 'qr_static_hsfa_course.png'));
    fs.copyFileSync(path.join(outputDir, 'qr_mehdi_heart_saver_first_aid.png'), path.join(__dirname, 'qr_mehdi_heart_saver_first_aid.png'));
    console.log('Copied static QR codes to root directory.');
    console.log('All QR codes generated successfully!');
}

generateAll().catch(err => {
    console.error(err);
    process.exit(1);
});
