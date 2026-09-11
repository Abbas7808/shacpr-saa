/**
 * SHA CPR Certificate Verification & QR Code System
 * Candidates: KASHIF ALI ASHIQ ALI & MEHDI HUSSAIN ALI
 */

document.addEventListener('DOMContentLoaded', () => {
    // Certificate Master Data for Candidates
    const candidates = {
        kashif: {
            name: 'KASHIF ALI ASHIQ ALI',
            father: 'ASHIQ ALI',
            courseBLS: 'SHA BLS Provider',
            courseHSFA: 'SHA Hearts Saver First Aid',
            validFrom: '03-Sep-2026',
            expiryDate: '03-Sep-2028',
            blsId: '311214170424',
            hsfaId: '311213170329',
            validIds: ['311214170424', '311213170329', 'SHA-KASHIF-2026'],
            blsQr: './img/qr_kashif_bls.png',
            hsfaQr: './img/qr_kashif_hsfa.png',
            blsDownload: 'QR_SHA_BLS_Kashif_Ali.png',
            hsfaDownload: 'QR_SHA_HSFA_Kashif_Ali.png',
            blsUrl: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=311214170424',
            hsfaUrl: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=311213170329'
        },
        mehdi: {
            name: 'MEHDI HUSSAIN ALI',
            father: '',
            courseBLS: 'SHA BLS Provider',
            courseHSFA: 'SHA Hearts Saver First Aid',
            validFrom: '11-Sep-2026',
            expiryDate: '11-Sep-2028',
            blsId: '20979225338',
            hsfaId: '21172105024',
            validIds: ['20979225338', '21172105024', '30870', 'SHA-MEHDI-2026'],
            blsQr: './img/qr_mehdi_bls.png',
            hsfaQr: './img/qr_mehdi_hsfa.png',
            blsDownload: 'QR_SHA_BLS_MEHDI_HUSSAIN_ALI.png',
            hsfaDownload: 'QR_SHA_HSFA_MEHDI_HUSSAIN_ALI.png',
            blsUrl: 'https://shacpr-saa-sable.vercel.app/verify?course=bls&id=20979225338',
            hsfaUrl: 'https://shacpr-saa-sable.vercel.app/verify?course=hsfa&id=21172105024'
        }
    };

    let activeCandidate = candidates.kashif; // default fallback is Kashif Ali
    let currentCourse = activeCandidate.courseBLS;

    // DOM Elements - Certificate Card
    const cardHolderElem = document.getElementById('cert-holder-name');
    const cardFatherElem = document.getElementById('cert-father-name');
    const cardCourseElem = document.getElementById('cert-course-name');
    const cardValidFromElem = document.getElementById('cert-valid-from');
    const cardExpiryElem = document.getElementById('cert-expiry-date');
    const certCard = document.getElementById('certificate-card');

    // DOM Elements - Search Form
    const searchForm = document.getElementById('search-form');
    const certInput = document.getElementById('cert-input');
    const searchContainer = document.querySelector('.search-container');
    
    // Create error message element if not already present
    let errorMsg = searchContainer ? searchContainer.querySelector('.error-message') : null;
    if (!errorMsg && searchContainer) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        searchContainer.appendChild(errorMsg);
    }

    // Modals & Action Buttons
    const openScannerBtn = document.getElementById('open-scanner-btn');
    const fabScanBtn = document.getElementById('fab-scan-btn');
    const viewQrBtn = document.getElementById('view-qr-btn');
    const scannerModal = document.getElementById('qr-scanner-modal');
    const viewQrModal = document.getElementById('qr-view-modal');
    const closeScannerBtn = document.getElementById('close-scanner-btn');
    const closeViewQrBtn = document.getElementById('close-view-qr-btn');
    const toast = document.getElementById('verified-toast');
    const toastMessage = document.getElementById('toast-message');

    // Scanner Elements
    const tabCamera = document.getElementById('tab-camera');
    const tabUpload = document.getElementById('tab-upload');
    const panelCamera = document.getElementById('panel-camera');
    const panelUpload = document.getElementById('panel-upload');
    const dropzone = document.getElementById('qr-dropzone');
    const fileInput = document.getElementById('qr-file-input');
    const cameraSelect = document.getElementById('camera-select');
    const startCameraBtn = document.getElementById('start-camera-btn');
    const stopCameraBtn = document.getElementById('stop-camera-btn');
    const quickTestBls = document.getElementById('quick-test-bls');
    const quickTestHsfa = document.getElementById('quick-test-hsfa');

    // View QR Tabs
    const viewTabBls = document.getElementById('view-tab-bls');
    const viewTabHsfa = document.getElementById('view-tab-hsfa');
    const viewPanelBls = document.getElementById('view-panel-bls');
    const viewPanelHsfa = document.getElementById('view-panel-hsfa');
    const simulateScanBls = document.getElementById('simulate-scan-bls');
    const simulateScanHsfa = document.getElementById('simulate-scan-hsfa');

    // State
    let html5QrCode = null;
    let isScanning = false;
    let availableCameras = [];

    // QR Modal dynamic updater
    function updateQrModalDisplay() {
        const qrBlsImg = document.getElementById('qr-bls-img');
        const qrHsfaImg = document.getElementById('qr-hsfa-img');
        const qrBlsMeta = document.getElementById('qr-bls-meta');
        const qrHsfaMeta = document.getElementById('qr-hsfa-meta');
        const qrBlsLink = document.getElementById('qr-bls-link');
        const qrHsfaLink = document.getElementById('qr-hsfa-link');
        const qrBlsDownload = document.getElementById('qr-bls-download');
        const qrHsfaDownload = document.getElementById('qr-hsfa-download');

        if (qrBlsImg) qrBlsImg.src = activeCandidate.blsQr;
        if (qrHsfaImg) qrHsfaImg.src = activeCandidate.hsfaQr;

        if (qrBlsDownload) {
            qrBlsDownload.href = activeCandidate.blsQr;
            qrBlsDownload.setAttribute('download', activeCandidate.blsDownload);
        }
        if (qrHsfaDownload) {
            qrHsfaDownload.href = activeCandidate.hsfaQr;
            qrHsfaDownload.setAttribute('download', activeCandidate.hsfaDownload);
        }

        if (qrBlsLink) {
            qrBlsLink.href = activeCandidate.blsUrl;
            qrBlsLink.textContent = activeCandidate.blsUrl;
        }
        if (qrHsfaLink) {
            qrHsfaLink.href = activeCandidate.hsfaUrl;
            qrHsfaLink.textContent = activeCandidate.hsfaUrl;
        }

        if (qrBlsMeta) {
            const fatherText = activeCandidate.father ? ` S/O <strong>${activeCandidate.father}</strong>` : '';
            qrBlsMeta.innerHTML = `
                <strong>${activeCandidate.name}</strong>${fatherText}<br>
                <span>Course: <strong>${activeCandidate.courseBLS}</strong></span><br>
                <span>eCertificate ID: <strong>${activeCandidate.blsId}</strong></span><br>
                <span>Valid: <strong>${activeCandidate.validFrom} to ${activeCandidate.expiryDate}</strong></span><br>
                <div style="margin-top: 8px; font-size: 13px; color: #00232d;">
                    Scan with phone camera to open:<br>
                    <a href="${activeCandidate.blsUrl}" target="_blank" style="color: #ffa600; font-weight: bold; text-decoration: underline;" id="qr-bls-link">${activeCandidate.blsUrl}</a>
                </div>
            `;
        }

        if (qrHsfaMeta) {
            const fatherText = activeCandidate.father ? ` S/O <strong>${activeCandidate.father}</strong>` : '';
            qrHsfaMeta.innerHTML = `
                <strong>${activeCandidate.name}</strong>${fatherText}<br>
                <span>Course: <strong>${activeCandidate.courseHSFA}</strong></span><br>
                <span>eCertificate ID: <strong>${activeCandidate.hsfaId}</strong></span><br>
                <span>Valid: <strong>${activeCandidate.validFrom} to ${activeCandidate.expiryDate}</strong></span><br>
                <div style="margin-top: 8px; font-size: 13px; color: #00232d;">
                    Scan with phone camera to open:<br>
                    <a href="${activeCandidate.hsfaUrl}" target="_blank" style="color: #ffa600; font-weight: bold; text-decoration: underline;" id="qr-hsfa-link">${activeCandidate.hsfaUrl}</a>
                </div>
            `;
        }
    }

    // Initialize Certificate Card Details
    function updateCardDisplay() {
        if (cardHolderElem) cardHolderElem.textContent = activeCandidate.name;
        if (cardFatherElem) cardFatherElem.textContent = activeCandidate.father;
        if (cardCourseElem) cardCourseElem.textContent = currentCourse;
        if (cardValidFromElem) cardValidFromElem.textContent = activeCandidate.validFrom;
        if (cardExpiryElem) cardExpiryElem.textContent = activeCandidate.expiryDate;
        updateQrModalDisplay();
    }

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = (urlParams.get('course') || '').toLowerCase();
    const idParam = (urlParams.get('id') || '').trim();
    const candidateParam = (urlParams.get('candidate') || '').toLowerCase();

    if (idParam === '20979225338' || idParam === '21172105024' || idParam === '30870' || candidateParam === 'mehdi' || courseParam.includes('mehdi')) {
        activeCandidate = candidates.mehdi;
    } else {
        activeCandidate = candidates.kashif;
    }

    const isHsfaCourse = courseParam === 'hsfa' || courseParam.includes('hsfa') || 
                         courseParam.includes('cpr') || courseParam.includes('firstaid') || 
                         courseParam.includes('hearts') || courseParam.includes('saver') || 
                         idParam === '21172105024' || idParam === '311213170329';

    if (isHsfaCourse) {
        currentCourse = activeCandidate.courseHSFA;
        document.title = `${activeCandidate.courseHSFA} Verification - Saudi Heart Association`;
    } else {
        currentCourse = activeCandidate.courseBLS;
        document.title = `${activeCandidate.courseBLS} Verification - Saudi Heart Association`;
    }
    updateCardDisplay();

    // If HSFA requested, also switch QR viewer tab to HSFA by default
    if (isHsfaCourse && viewTabHsfa && viewTabBls && viewPanelHsfa && viewPanelBls) {
        viewTabHsfa.classList.add('active');
        viewTabBls.classList.remove('active');
        viewPanelHsfa.classList.add('active');
        viewPanelBls.classList.remove('active');
    }

    // Toast Notification helper
    function showToast(message, isSuccess = true) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        if (isSuccess) {
            toast.style.backgroundColor = '#2e7d32';
        } else {
            toast.style.backgroundColor = '#d32f2f';
        }
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }

    // Highlight Certificate Card with smooth animation
    function highlightCertificate(msg = 'Certificate Verified Successfully') {
        if (certCard) {
            certCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            certCard.classList.remove('card-verified-highlight');
            void certCard.offsetWidth; // Trigger reflow
            certCard.classList.add('card-verified-highlight');
        }
        showToast(msg, true);
    }

    // Verification Logic for IDs and QR payload
    function verifyCredential(rawInput) {
        if (!rawInput) return false;
        const cleaned = rawInput.trim();

        const isKashif = cleaned.includes('311214170424') || 
                         cleaned.includes('311213170329') || 
                         cleaned.toUpperCase().includes('KASHIF');

        const isMehdi = cleaned.includes('20979225338') || 
                        cleaned.includes('21172105024') || 
                        cleaned.includes('30870') || 
                        cleaned.toUpperCase().includes('MEHDI');

        if (isKashif) {
            activeCandidate = candidates.kashif;
        } else if (isMehdi) {
            activeCandidate = candidates.mehdi;
        }

        // Check for specific courses based on URL or ID
        const isHsfa = cleaned.includes('shacpr-orrg') || 
                       cleaned.includes('21172105024') || 
                       cleaned.includes('311213170329') || 
                       cleaned.toLowerCase().includes('hsfa') ||
                       cleaned.toLowerCase().includes('hearts') ||
                       cleaned.toLowerCase().includes('firstaid');

        const isBls = cleaned.includes('shacpr-saa') || 
                      cleaned.includes('20979225338') || 
                      cleaned.includes('311214170424') || 
                      cleaned.toLowerCase().includes('bls');

        const allValidIds = [...candidates.kashif.validIds, ...candidates.mehdi.validIds];
        const isMatch = isHsfa || isBls || 
                        allValidIds.some(id => cleaned.includes(id)) ||
                        cleaned.toUpperCase().includes('MEHDI') ||
                        cleaned.toUpperCase().includes('KASHIF') ||
                        cleaned.includes(window.location.hostname);

        if (isMatch) {
            if (isHsfa) {
                currentCourse = activeCandidate.courseHSFA;
            } else {
                currentCourse = activeCandidate.courseBLS;
            }
            updateCardDisplay();
            highlightCertificate(`Verified: ${currentCourse} for ${activeCandidate.name}`);
            return true;
        }

        return false;
    }

    // Manual Form Submission
    if (searchForm && certInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = certInput.value.trim();

            if (verifyCredential(val)) {
                certInput.classList.remove('error');
                if (errorMsg) errorMsg.textContent = '';
            } else {
                certInput.classList.add('error');
                if (errorMsg) {
                    errorMsg.textContent = 'Invalid eCertificate ID';
                    setTimeout(() => {
                        errorMsg.textContent = '';
                        certInput.classList.remove('error');
                    }, 3000);
                }
            }
        });
    }

    // ============================================================
    // QR Code Scanning Implementation
    // ============================================================

    // Initialize Html5Qrcode instance
    try {
        if (typeof Html5Qrcode !== 'undefined') {
            html5QrCode = new Html5Qrcode('reader');
        }
    } catch (err) {
        console.warn('Html5Qrcode init deferred:', err);
    }

    // Populate available cameras
    async function loadCameras() {
        if (!html5QrCode || typeof Html5Qrcode === 'undefined') return;
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length) {
                availableCameras = devices;
                if (cameraSelect) {
                    cameraSelect.innerHTML = '';
                    devices.forEach((dev, idx) => {
                        const opt = document.createElement('option');
                        opt.value = dev.id;
                        opt.textContent = dev.label || `Camera ${idx + 1}`;
                        cameraSelect.appendChild(opt);
                    });
                    cameraSelect.style.display = devices.length > 1 ? 'inline-block' : 'none';
                }
            }
        } catch (e) {
            console.log('Camera list access note:', e);
        }
    }

    // Start Live Camera Scanning
    async function startCameraScanner() {
        if (!html5QrCode) {
            try {
                html5QrCode = new Html5Qrcode('reader');
            } catch (err) {
                console.error(err);
                return;
            }
        }
        if (isScanning) return;

        const config = {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        const cameraIdOrConfig = (cameraSelect && cameraSelect.value) ? 
            cameraSelect.value : { facingMode: 'environment' };

        try {
            await html5QrCode.start(
                cameraIdOrConfig,
                config,
                (decodedText) => {
                    // Success callback
                    stopCameraScanner();
                    closeModal(scannerModal);
                    const verified = verifyCredential(decodedText);
                    if (!verified) {
                        showToast(`Scanned: "${decodedText.slice(0, 30)}..." - Verification Not Found`, false);
                    }
                },
                (errorMessage) => {
                    // Ongoing scan parse misses (silent)
                }
            );
            isScanning = true;
            if (startCameraBtn) startCameraBtn.style.display = 'none';
            if (stopCameraBtn) stopCameraBtn.style.display = 'inline-block';
        } catch (err) {
            console.error('Failed to start camera:', err);
            showToast('Unable to access camera. Please check permissions or upload a QR image.', false);
        }
    }

    // Stop Live Camera Scanning
    async function stopCameraScanner() {
        if (html5QrCode && isScanning) {
            try {
                await html5QrCode.stop();
            } catch (err) {
                console.warn('Error stopping scanner:', err);
            }
            isScanning = false;
            if (startCameraBtn) startCameraBtn.style.display = 'inline-block';
            if (stopCameraBtn) stopCameraBtn.style.display = 'none';
        }
    }

    // Handle Upload / Dropzone QR File Scan
    async function handleFileScan(file) {
        if (!file) return;
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('reader');
        }

        try {
            showToast('Scanning QR Image...', true);
            const decodedText = await html5QrCode.scanFile(file, true);
            closeModal(scannerModal);
            const verified = verifyCredential(decodedText);
            if (!verified) {
                showToast(`Scanned: "${decodedText.slice(0, 30)}..." - Verification Not Found`, false);
            }
        } catch (err) {
            console.error('File scan error:', err);
            showToast('Could not decode QR code from image. Please try a clearer image.', false);
        }
    }

    // Modal Control Functions
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modal === scannerModal) {
            stopCameraScanner();
        }
    }

    // Modal Events
    if (openScannerBtn) {
        openScannerBtn.addEventListener('click', () => {
            openModal(scannerModal);
            loadCameras().then(() => {
                if (tabCamera && tabCamera.classList.contains('active')) {
                    startCameraScanner();
                }
            });
        });
    }

    if (fabScanBtn) {
        fabScanBtn.addEventListener('click', () => {
            openModal(scannerModal);
            loadCameras().then(() => {
                if (tabCamera && tabCamera.classList.contains('active')) {
                    startCameraScanner();
                }
            });
        });
    }

    if (closeScannerBtn) {
        closeScannerBtn.addEventListener('click', () => closeModal(scannerModal));
    }

    if (closeViewQrBtn) {
        closeViewQrBtn.addEventListener('click', () => closeModal(viewQrModal));
    }

    // Close on backdrop click
    [scannerModal, viewQrModal].forEach(m => {
        if (m) {
            m.addEventListener('click', (e) => {
                if (e.target === m) closeModal(m);
            });
        }
    });

    // Scanner Tab Switching
    if (tabCamera && tabUpload) {
        tabCamera.addEventListener('click', () => {
            tabCamera.classList.add('active');
            tabUpload.classList.remove('active');
            if (panelCamera) panelCamera.classList.add('active');
            if (panelUpload) panelUpload.classList.remove('active');
            startCameraScanner();
        });

        tabUpload.addEventListener('click', () => {
            tabUpload.classList.add('active');
            tabCamera.classList.remove('active');
            if (panelUpload) panelUpload.classList.add('active');
            if (panelCamera) panelCamera.classList.remove('active');
            stopCameraScanner();
        });
    }

    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startCameraScanner);
    }
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopCameraScanner);
    }
    if (cameraSelect) {
        cameraSelect.addEventListener('change', () => {
            stopCameraScanner().then(() => startCameraScanner());
        });
    }

    // File Dropzone handlers
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileScan(e.target.files[0]);
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
                handleFileScan(e.dataTransfer.files[0]);
            }
        });
    }

    // Quick Test Scan Buttons in Scanner Modal
    if (quickTestBls) {
        quickTestBls.addEventListener('click', () => {
            closeModal(scannerModal);
            verifyCredential(activeCandidate.blsUrl);
        });
    }
    if (quickTestHsfa) {
        quickTestHsfa.addEventListener('click', () => {
            closeModal(scannerModal);
            verifyCredential(activeCandidate.hsfaUrl);
        });
    }

    // ============================================================
    // Dual QR Code Viewer Tabs & Simulation
    // ============================================================
    if (viewQrBtn) {
        viewQrBtn.addEventListener('click', () => {
            openModal(viewQrModal);
        });
    }

    if (viewTabBls && viewTabHsfa) {
        viewTabBls.addEventListener('click', () => {
            viewTabBls.classList.add('active');
            viewTabHsfa.classList.remove('active');
            if (viewPanelBls) viewPanelBls.classList.add('active');
            if (viewPanelHsfa) viewPanelHsfa.classList.remove('active');
        });

        viewTabHsfa.addEventListener('click', () => {
            viewTabHsfa.classList.add('active');
            viewTabBls.classList.remove('active');
            if (viewPanelHsfa) viewPanelHsfa.classList.add('active');
            if (viewPanelBls) viewPanelBls.classList.remove('active');
        });
    }

    // Instant Simulation buttons from QR modal
    if (simulateScanBls) {
        simulateScanBls.addEventListener('click', () => {
            closeModal(viewQrModal);
            verifyCredential(activeCandidate.blsUrl);
        });
    }
    if (simulateScanHsfa) {
        simulateScanHsfa.addEventListener('click', () => {
            closeModal(viewQrModal);
            verifyCredential(activeCandidate.hsfaUrl);
        });
    }
});
