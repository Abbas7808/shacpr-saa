const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'img');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Comprehensive QR Code generation list for SHA Heart Saver First Aid and SHA BLS Provider
const qrList = [
    // 1. Primary SHA Heart Saver First Aid QR Codes
    {
        filename: 'SHA_Heart_Saver_First_Aid_QR.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'SHA Heart Saver First Aid QR (shacpr-saa-sable.vercel.app/verify?course=hsfa)'
    },
    {
        filename: 'qr_sha_heart_saver_first_aid.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'QR SHA Heart Saver First Aid (shacpr-saa-sable.vercel.app/verify?course=hsfa)'
    },
    {
        filename: 'qr_static_hsfa_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa',
        title: 'Static QR HSFA Course (shacpr-saa-sable.vercel.app/verify?course=hsfa)'
    },
    {
        filename: 'qr_mehdi_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'Mehdi Hussain Ali - SHA Hearts Saver First Aid with ID'
    },
    {
        filename: 'qr_code_diploma.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'Diploma QR Code (HSFA)'
    },
    {
        filename: 'qr_shacpr_orrg_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024',
        title: 'SHA HSFA CPR AED'
    },
    {
        filename: 'qr_mehdi_hsfa_local.png',
        url: 'http://localhost:3000/verify?course=hsfa&id=21172105024',
        title: 'Mehdi Hussain Ali HSFA Local'
    },

    // 2. Primary SHA BLS Provider QR Codes
    {
        filename: 'SHA_BLS_Provider_QR.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls',
        title: 'SHA BLS Provider QR (shacpr-saa-sable.vercel.app/verify?course=bls)'
    },
    {
        filename: 'qr_sha_bls_provider.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls',
        title: 'QR SHA BLS Provider (shacpr-saa-sable.vercel.app/verify?course=bls)'
    },
    {
        filename: 'qr_static_bls_course.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls',
        title: 'Static QR BLS Course (shacpr-saa-sable.vercel.app/verify?course=bls)'
    },
    {
        filename: 'qr_mehdi_bls.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'Mehdi Hussain Ali - SHA BLS Provider with ID'
    },
    {
        filename: 'qr_code_card.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'Card QR Code (BLS)'
    },
    {
        filename: 'qr_shacpr_saa_bls.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
        title: 'SHA BLS Provider'
    },
    {
        filename: 'qr_mehdi_bls_local.png',
        url: 'http://localhost:3000/verify?course=bls&id=20979225338',
        title: 'Mehdi Hussain Ali BLS Local'
    },

    // 3. Kashif Ali QR Codes - BLS Provider & Heart Saver First Aid
    {
        filename: 'qr_kashif_bls.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
        title: 'Kashif Ali - SHA BLS Provider'
    },
    {
        filename: 'QR_SHA_BLS_Kashif_Ali.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
        title: 'QR SHA BLS Kashif Ali'
    },
    {
        filename: 'qr_kashif_bls_local.png',
        url: 'http://localhost:3000/verify?course=bls&id=311214170424',
        title: 'Kashif Ali BLS Local'
    },
    {
        filename: 'qr_kashif_hsfa.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=311213170329',
        title: 'Kashif Ali - SHA Hearts Saver First Aid'
    },
    {
        filename: 'QR_SHA_HSFA_Kashif_Ali.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=311213170329',
        title: 'QR SHA HSFA Kashif Ali'
    },
    {
        filename: 'qr_kashif_hsfa_local.png',
        url: 'http://localhost:3000/verify?course=hsfa&id=311213170329',
        title: 'Kashif Ali HSFA Local'
    },
    {
        filename: 'kashif_qr_code.png',
        url: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
        title: 'Kashif Ali QR Code'
    }
];

// Files to also copy directly into the workspace root directory for easy access
const rootCopies = [
    'SHA_Heart_Saver_First_Aid_QR.png',
    'SHA_BLS_Provider_QR.png',
    'qr_sha_heart_saver_first_aid.png',
    'qr_sha_bls_provider.png',
    'qr_static_hsfa_course.png',
    'qr_static_bls_course.png',
    'qr_mehdi_hsfa.png',
    'qr_mehdi_bls.png',
    'qr_kashif_bls.png',
    'qr_kashif_hsfa.png',
    'QR_SHA_BLS_Kashif_Ali.png',
    'QR_SHA_HSFA_Kashif_Ali.png',
    'kashif_qr_code.png'
];

async function generateAll() {
    console.log('Generating QR Codes for SHA Heart Saver First Aid & SHA BLS Provider...');
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

    // Copy essential QR codes to root directory
    for (const file of rootCopies) {
        const src = path.join(outputDir, file);
        const dest = path.join(__dirname, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${file} to root directory.`);
        }
    }

    console.log('All QR codes generated and synchronized successfully!');
}

generateAll().catch(err => {
    console.error(err);
    process.exit(1);
});
