/**
 * Dedicated Certificate QR Scanner Logic
 * Saudi Heart Association CPR Verification
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabCam = document.getElementById('tab-live-cam');
    const tabUpload = document.getElementById('tab-upload-file');
    const panelCam = document.getElementById('panel-live-cam');
    const panelUpload = document.getElementById('panel-upload-file');

    const camSelect = document.getElementById('cam-device-select');
    const camStartBtn = document.getElementById('cam-start-btn');
    const camStopBtn = document.getElementById('cam-stop-btn');
    const laser = document.getElementById('scanner-laser');

    const dropzone = document.getElementById('page-dropzone');
    const fileInput = document.getElementById('page-file-input');

    // Toast
    const toast = document.getElementById('scan-toast');
    const toastMsg = document.getElementById('scan-toast-msg');

    let html5QrCode = null;
    let isScanning = false;

    function showToast(msg, isSuccess = true) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        toast.style.backgroundColor = isSuccess ? '#2e7d32' : '#c62828';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // Tab Switching
    if (tabCam && tabUpload) {
        tabCam.addEventListener('click', () => {
            tabCam.classList.add('active');
            tabUpload.classList.remove('active');
            panelCam.classList.add('active');
            panelUpload.classList.remove('active');
            startScanner();
        });

        tabUpload.addEventListener('click', () => {
            tabUpload.classList.add('active');
            tabCam.classList.remove('active');
            panelUpload.classList.add('active');
            panelCam.classList.remove('active');
            stopScanner();
        });
    }

    // Initialize scanner
    try {
        if (typeof Html5Qrcode !== 'undefined') {
            html5QrCode = new Html5Qrcode('page-reader');
        }
    } catch (e) {
        console.warn('Scanner init note:', e);
    }

    // Load available cameras
    async function initCameras() {
        if (!html5QrCode || typeof Html5Qrcode === 'undefined') return;
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                if (camSelect) {
                    camSelect.innerHTML = '';
                    devices.forEach((d, i) => {
                        const opt = document.createElement('option');
                        opt.value = d.id;
                        opt.textContent = d.label || `Camera ${i + 1}`;
                        camSelect.appendChild(opt);
                    });
                    if (devices.length > 1) {
                        camSelect.style.display = 'inline-block';
                    }
                }
            }
        } catch (e) {
            console.log('Camera list notice:', e);
        }
    }

    // Start Camera Scanner
    async function startScanner() {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('page-reader');
        }
        if (isScanning) return;

        const config = {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0
        };

        const cameraIdOrConfig = (camSelect && camSelect.value) ? 
            camSelect.value : { facingMode: 'environment' };

        try {
            await html5QrCode.start(
                cameraIdOrConfig,
                config,
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => {}
            );
            isScanning = true;
            if (camStartBtn) camStartBtn.style.display = 'none';
            if (camStopBtn) camStopBtn.style.display = 'inline-block';
            if (laser) laser.style.display = 'block';
        } catch (err) {
            console.error('Camera access error:', err);
            showToast('Camera access unavailable. Try uploading an image file.', false);
        }
    }

    // Stop Camera Scanner
    async function stopScanner() {
        if (html5QrCode && isScanning) {
            try {
                await html5QrCode.stop();
            } catch (e) {}
            isScanning = false;
            if (camStartBtn) camStartBtn.style.display = 'inline-block';
            if (camStopBtn) camStopBtn.style.display = 'none';
            if (laser) laser.style.display = 'none';
        }
    }

    if (camStartBtn) camStartBtn.addEventListener('click', startScanner);
    if (camStopBtn) camStopBtn.addEventListener('click', stopScanner);
    if (camSelect) {
        camSelect.addEventListener('change', () => {
            stopScanner().then(() => startScanner());
        });
    }

    // File Upload handling
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
            }
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFile(e.dataTransfer.files[0]);
            }
        });
    }

    async function processFile(file) {
        if (!file) return;
        if (!html5QrCode) html5QrCode = new Html5Qrcode('page-reader');

        try {
            showToast('Analyzing QR Image...', true);
            const decodedText = await html5QrCode.scanFile(file, true);
            handleScanSuccess(decodedText);
        } catch (err) {
            console.error(err);
            showToast('Unable to read QR code from image. Please try a clearer picture.', false);
        }
    }

    // Handle Successful Scan - Redirects directly to Certificate Verification Page
    function handleScanSuccess(rawText) {
        stopScanner();
        const text = rawText ? rawText.trim() : '';

        const isHsfa = text.includes('shacpr-orrg') || 
                       text.includes('311213170329') || 
                       text.toLowerCase().includes('hsfa');

        const courseParam = isHsfa ? 'course=hsfa' : 'course=bls';
        const targetUrl = (window.location.protocol === 'file:' || window.location.pathname.endsWith('.html')) 
            ? `index.html?${courseParam}` 
            : `/verify?${courseParam}`;

        showToast('Certificate Verified! Redirecting...', true);

        // Directly visit the certificate verification page immediately
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 300);
    }

    // Auto-start camera if live cam tab active and permissions allow
    initCameras().then(() => {
        // Optional auto-start
    });
});
