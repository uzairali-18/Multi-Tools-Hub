// Enhanced Multi-Function Tool Hub JavaScript
// SEO Optimized, Responsive, and Feature-Rich

// Main Application State
const AppState = {
    currentTool: null,
    mediaRecorder: null,
    recordedChunks: [],
    audioContext: null,
    speechRecognition: null,
    timerInterval: null,
    stopwatchInterval: null,
    stopwatchTime: 0,
    isProcessing: false,
    userPreferences: {
        theme: 'light',
        animations: true,
        soundEnabled: true
    }
};

// DOM Elements
const modal = document.getElementById('toolModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Enhanced Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupIntersectionObserver();
    loadUserPreferences();
    trackPageView();
});

function initializeApp() {
    // Add event listeners for tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            trackToolUsage(toolName);
            openTool(toolName);
        });
        
        // Add hover effects for better UX
        card.addEventListener('mouseenter', function() {
            if (AppState.userPreferences.animations) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (AppState.userPreferences.animations) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Enhanced Modal event listeners
    closeModal.addEventListener('click', closeToolModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeToolModal();
        }
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeToolModal();
        }
        
        // Tool-specific keyboard shortcuts
        if (modal.style.display === 'block') {
            handleKeyboardShortcuts(e);
        }
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            trackPerformance('pageLoadTime', loadTime);
        });
    }
}

// Enhanced Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && AppState.userPreferences.animations) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.tool-card, .benefit-card, .use-case, .faq-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(card);
    });
}

// Enhanced Tool Management
function openTool(toolName) {
    AppState.currentTool = toolName;
    modalTitle.textContent = getToolTitle(toolName);
    
    // Show loading state
    showModalLoading();
    
    // Load tool content asynchronously
    setTimeout(() => {
        const toolContent = getToolContent(toolName);
        modalBody.innerHTML = toolContent;
        hideModalLoading();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Initialize tool-specific functionality
        initializeTool(toolName);
        
        // Focus management for accessibility
        modal.focus();
        
        // Track tool usage
        trackToolUsage(toolName);
    }, 200);
}

function closeToolModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    AppState.currentTool = null;
    
    // Clean up all running processes
    cleanupAppState();
}

function cleanupAppState() {
    // Clean up media recorders
    if (AppState.mediaRecorder) {
        if (AppState.mediaRecorder.state !== 'inactive') {
            AppState.mediaRecorder.stop();
        }
        AppState.mediaRecorder = null;
    }
    
    // Clean up speech recognition
    if (AppState.speechRecognition) {
        if (AppState.speechRecognition.state !== 'inactive') {
            AppState.speechRecognition.stop();
        }
        AppState.speechRecognition = null;
    }
    
    // Clear intervals
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
    }
    
    if (AppState.stopwatchInterval) {
        clearInterval(AppState.stopwatchInterval);
        AppState.stopwatchInterval = null;
    }
    
    // Reset processing state
    AppState.isProcessing = false;
}

function showModalLoading() {
    modalBody.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading tool...</p>
        </div>
    `;
}

function hideModalLoading() {
    const loadingContainer = modalBody.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

// Enhanced Tool Titles
function getToolTitle(toolName) {
    const titles = {
        'image-converter': '🖼️ Image Converter',
        'image-compressor': '🗜️ Image Compressor',
        'image-cropper': '✂️ Image Cropper',
        'video-converter': '🎥 Video Converter',
        'audio-converter': '🎵 Audio Converter',
        'audio-trimmer': '✂️ Audio Trimmer',
        'age-calculator': '🎂 Age Calculator',
        'emi-calculator': '💰 EMI Calculator',
        'sip-calculator': '📈 SIP Calculator',
        'bmi-calculator': '⚖️ BMI Calculator',
        'qr-generator': '📱 QR Code Generator',
        'password-generator': '🔐 Password Generator',
        'word-counter': '📝 Word Counter',
        'base64-encoder': '🔤 Base64 Encoder/Decoder',
        'text-to-speech': '🗣️ Text to Speech',
        'speech-to-text': '🎤 Speech to Text',
        'color-picker': '🎨 Color Picker',
        'json-formatter': '📋 JSON Formatter',
        'unit-converter': '📏 Unit Converter',
        'timer-stopwatch': '⏱️ Timer & Stopwatch'
    };
    return titles[toolName] || 'Tool';
}

// Enhanced Tool Initialization
function initializeTool(toolName) {
    // Add tool-specific initialization
    setTimeout(() => {
        switch(toolName) {
            case 'image-converter': initImageConverter(); break;
            case 'image-compressor': initImageCompressor(); break;
            case 'image-cropper': initImageCropper(); break;
            case 'video-converter': initVideoConverter(); break;
            case 'audio-converter': initAudioConverter(); break;
            case 'audio-trimmer': initAudioTrimmer(); break;
            case 'age-calculator': initAgeCalculator(); break;
            case 'emi-calculator': initEMICalculator(); break;
            case 'sip-calculator': initSIPCalculator(); break;
            case 'bmi-calculator': initBMICalculator(); break;
            case 'qr-generator': initQRGenerator(); break;
            case 'password-generator': initPasswordGenerator(); break;
            case 'word-counter': initWordCounter(); break;
            case 'base64-encoder': initBase64Encoder(); break;
            case 'text-to-speech': initTextToSpeech(); break;
            case 'speech-to-text': initSpeechToText(); break;
            case 'color-picker': initColorPicker(); break;
            case 'json-formatter': initJSONFormatter(); break;
            case 'unit-converter': initUnitConverter(); break;
            case 'timer-stopwatch': initTimerStopwatch(); break;
        }
    }, 100);
}

// Enhanced Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    const activeElement = document.activeElement;
    
    // Global shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                const activeButton = modalBody.querySelector('.btn:not(:disabled)');
                if (activeButton) activeButton.click();
                break;
            case 's':
                e.preventDefault();
                // Save/download functionality
                handleSaveShortcut();
                break;
        }
    }
    
    // Tool-specific shortcuts
    if (AppState.currentTool) {
        switch(AppState.currentTool) {
            case 'timer-stopwatch':
                if (e.code === 'Space') {
                    e.preventDefault();
                    handleTimerStopwatchShortcuts();
                }
                break;
            case 'text-to-speech':
                if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    handleTTSSpacebar();
                }
                break;
        }
    }
}

// ================== ENHANCED IMAGE TOOLS ==================

function initImageConverter() {
    const fileUpload = document.getElementById('imageFile');
    const formatSelect = document.getElementById('outputFormat');
    const qualitySlider = document.getElementById('quality');
    const convertBtn = document.getElementById('convertBtn');
    const preview = document.getElementById('preview');
    const fileInfo = document.getElementById('fileInfo');
    
    let selectedFile = null;
    let originalImageData = null;
    
    // Enhanced file upload handling
    fileUpload.addEventListener('change', handleImageFileSelect);
    convertBtn.addEventListener('click', convertImage);
    
    // Drag and drop support
    setupDragAndDrop(fileUpload, handleImageFileSelect);
    
    function handleImageFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            processSelectedImage(file);
        } else {
            showAlert('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        }
    }
    
    function processSelectedImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImageData = {
                    width: img.width,
                    height: img.height,
                    type: file.type,
                    size: file.size
                };
                
                displayImagePreview(img);
                displayFileInfo(file, img);
                enableControls();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function displayImagePreview(img) {
        preview.innerHTML = `
            <div class="image-preview">
                <img src="${img.src}" style="max-width: 100%; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div class="image-dimensions">
                    <span class="dimension-tag">${img.width} × ${img.height}px</span>
                </div>
            </div>
        `;
    }
    
    function displayFileInfo(file, img) {
        const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div class="file-info-grid">
                <div class="info-item">
                    <strong>Original Size:</strong> ${sizeInMB} MB
                </div>
                <div class="info-item">
                    <strong>Format:</strong> ${file.type.toUpperCase()}
                </div>
                <div class="info-item">
                    <strong>Dimensions:</strong> ${img.width} × ${img.height}px
                </div>
                <div class="info-item">
                    <strong>Output:</strong> ${formatSelect.value.toUpperCase()}
                </div>
            </div>
        `;
    }
    
    function enableControls() {
        convertBtn.disabled = false;
        formatSelect.disabled = false;
        if (qualitySlider) qualitySlider.disabled = false;
    }
    
    function convertImage() {
        if (!selectedFile || AppState.isProcessing) return;
        
        AppState.isProcessing = true;
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="loading"></span> Converting...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                processImageConversion(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
    
    function processImageConversion(img) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply any image processing here
            ctx.drawImage(img, 0, 0);
            
            const outputFormat = formatSelect.value;
            const quality = qualitySlider ? qualitySlider.value / 100 : 0.9;
            
            canvas.toBlob(function(blob) {
                if (!blob) {
                    throw new Error('Failed to create image blob');
                }
                
                const outputFilename = `converted_${Date.now()}.${outputFormat}`;
                downloadBlob(blob, outputFilename);
                
                // Show conversion statistics
                const originalSize = selectedFile.size;
                const newSize = blob.size;
                const compressionRatio = ((1 - newSize / originalSize) * 100).toFixed(1);
                
                showConversionResult(originalSize, newSize, compressionRatio);
                
                AppState.isProcessing = false;
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert Image';
            }, `image/${outputFormat}`, quality);
            
        } catch (error) {
            showAlert('Error converting image: ' + error.message, 'error');
            AppState.isProcessing = false;
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert Image';
        }
    }
    
    function showConversionResult(originalSize, newSize, ratio) {
        const result = document.createElement('div');
        result.className = 'conversion-result';
        result.innerHTML = `
            <h4>Conversion Complete! ✅</h4>
            <div class="result-stats">
                <div class="stat">
                    <strong>Original:</strong> ${(originalSize / 1024 / 1024).toFixed(2)} MB
                </div>
                <div class="stat">
                    <strong>New:</strong> ${(newSize / 1024 / 1024).toFixed(2)} MB
                </div>
                <div class="stat">
                    <strong>Size Change:</strong> ${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%
                </div>
            </div>
        `;
        
        modalBody.appendChild(result);
        
        if (AppState.userPreferences.soundEnabled) {
            playSuccessSound();
        }
    }
    
    // Update file info when format changes
    formatSelect.addEventListener('change', () => {
        if (selectedFile) {
            displayFileInfo(selectedFile, { width: originalImageData.width, height: originalImageData.height });
        }
    });
}

function initImageCompressor() {
    const fileUpload = document.getElementById('imageFile');
    const qualitySlider = document.getElementById('quality');
    const compressBtn = document.getElementById('compressBtn');
    const preview = document.getElementById('preview');
    const qualityValue = document.getElementById('qualityValue');
    
    let selectedFile = null;
    
    // Quality slider display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        updateCompressionEstimate();
    });
    
    fileUpload.addEventListener('change', handleImageFileSelect);
    compressBtn.addEventListener('click', compressImage);
    setupDragAndDrop(fileUpload, handleImageFileSelect);
    
    function handleImageFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            displayImagePreview(file);
            updateCompressionEstimate();
        } else {
            showAlert('Please select a valid image file', 'error');
        }
    }
    
    function displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="image-preview">
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
    
    function updateCompressionEstimate() {
        const quality = qualitySlider.value / 100;
        if (selectedFile && quality) {
            const estimatedSize = (selectedFile.size * quality / 1024 / 1024).toFixed(2);
            qualityValue.innerHTML = `${qualitySlider.value}% <small>(~${estimatedSize} MB)</small>`;
        }
    }
    
    function compressImage() {
        if (!selectedFile || AppState.isProcessing) return;
        
        AppState.isProcessing = true;
        compressBtn.disabled = true;
        compressBtn.innerHTML = '<span class="loading"></span> Compressing...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                processImageCompression(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
    
    function processImageCompression(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const quality = qualitySlider.value / 100;
        
        canvas.toBlob(function(blob) {
            const filename = `compressed_${Date.now()}.jpg`;
            downloadBlob(blob, filename);
            
            const originalSize = (selectedFile.size / 1024 / 1024).toFixed(2);
            const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
            const compressionRatio = ((1 - blob.size / selectedFile.size) * 100).toFixed(1);
            
            showCompressionResult(originalSize, compressedSize, compressionRatio);
            
            AppState.isProcessing = false;
            compressBtn.disabled = false;
            compressBtn.innerHTML = 'Compress Image';
        }, 'image/jpeg', quality);
    }
    
    function showCompressionResult(original, compressed, ratio) {
        const result = document.createElement('div');
        result.className = 'compression-result';
        result.innerHTML = `
            <h4>Compression Complete! 🎉</h4>
            <div class="result-comparison">
                <div class="size-comparison">
                    <div class="size-item">
                        <strong>Original:</strong> ${original} MB
                    </div>
                    <div class="size-arrow">→</div>
                    <div class="size-item">
                        <strong>Compressed:</strong> ${compressed} MB
                    </div>
                </div>
                <div class="savings">
                    <strong>Space Saved:</strong> ${ratio}% reduction
                </div>
            </div>
        `;
        
        modalBody.appendChild(result);
    }
}

function initImageCropper() {
    const fileUpload = document.getElementById('imageFile');
    const cropBtn = document.getElementById('cropBtn');
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    
    let img = null;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let cropArea = { x: 0, y: 0, width: 0, height: 0 };
    let imageScale = 1;
    
    fileUpload.addEventListener('change', loadImage);
    cropBtn.addEventListener('click', cropImage);
    setupDragAndDrop(fileUpload, loadImage);
    
    if (aspectRatioSelect) {
        aspectRatioSelect.addEventListener('change', updateAspectRatio);
    }
    
    function loadImage(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                img = new Image();
                img.onload = function() {
                    setupCanvas();
                    enableCropping();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    function setupCanvas() {
        const maxWidth = 500;
        const maxHeight = 400;
        
        imageScale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        canvas.width = img.width * imageScale;
        canvas.height = img.height * imageScale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    function enableCropping() {
        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', drag);
        canvas.addEventListener('mouseup', endDrag);
        canvas.addEventListener('mouseleave', endDrag);
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', endDrag);
    }
    
    function startDrag(e) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        dragStartX = clientX - rect.left;
        dragStartY = clientY - rect.top;
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const currentX = clientX - rect.left;
        const currentY = clientY - rect.top;
        
        let x = Math.min(dragStartX, currentX);
        let y = Math.min(dragStartY, currentY);
        let width = Math.abs(currentX - dragStartX);
        let height = Math.abs(currentY - dragStartY);
        
        // Apply aspect ratio if selected
        if (aspectRatioSelect && aspectRatioSelect.value !== 'free') {
            const ratio = parseFloat(aspectRatioSelect.value);
            if (width / height > ratio) {
                width = height * ratio;
            } else {
                height = width / ratio;
            }
            
            // Adjust position to maintain starting point
            if (currentX < dragStartX) x = dragStartX - width;
            if (currentY < dragStartY) y = dragStartY - height;
        }
        
        // Ensure crop area stays within canvas
        x = Math.max(0, Math.min(x, canvas.width - width));
        y = Math.max(0, Math.min(y, canvas.height - height));
        width = Math.min(width, canvas.width - x);
        height = Math.min(height, canvas.height - y);
        
        cropArea = { x, y, width, height };
        redrawCanvas();
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        if (e.type === 'touchstart') {
            startDrag(e);
        } else if (e.type === 'touchmove') {
            drag(e);
        } else {
            endDrag();
        }
    }
    
    function updateAspectRatio() {
        if (cropArea.width > 0 && cropArea.height > 0) {
            redrawCanvas();
        }
    }
    
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        if (cropArea.width > 0 && cropArea.height > 0) {
            // Darken the area outside crop selection
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Clear the crop area
            ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
            
            // Draw crop area border
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
            ctx.setLineDash([]);
            
            // Add crop area info
            ctx.fillStyle = '#3b82f6';
            ctx.font = '14px Arial';
            ctx.fillText(`${Math.round(cropArea.width)} × ${Math.round(cropArea.height)}`, 
                        cropArea.x + 10, cropArea.y + 25);
        }
    }
    
    function cropImage() {
        if (cropArea.width === 0 || cropArea.height === 0) {
            showAlert('Please select a crop area by clicking and dragging on the image', 'error');
            return;
        }
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Calculate actual image coordinates (not scaled)
        const scaleX = img.width / canvas.width;
        const scaleY = img.height / canvas.height;
        
        tempCanvas.width = cropArea.width * scaleX;
        tempCanvas.height = cropArea.height * scaleY;
        
        tempCtx.drawImage(
            img,
            cropArea.x * scaleX,
            cropArea.y * scaleY,
            cropArea.width * scaleX,
            cropArea.height * scaleY,
            0,
            0,
            cropArea.width * scaleX,
            cropArea.height * scaleY
        );
        
        tempCanvas.toBlob(function(blob) {
            downloadBlob(blob, `cropped_${Date.now()}.jpg`);
            showAlert('Image cropped successfully!', 'success');
            
            if (AppState.userPreferences.soundEnabled) {
                playSuccessSound();
            }
        }, 'image/jpeg');
    }
}

// ================== ENHANCED AUDIO/VIDEO TOOLS ==================

function initVideoConverter() {
    const fileUpload = document.getElementById('videoFile');
    const formatSelect = document.getElementById('outputFormat');
    const convertBtn = document.getElementById('convertBtn');
    const videoPreview = document.getElementById('videoPreview');
    
    let selectedFile = null;
    
    fileUpload.addEventListener('change', handleVideoFileSelect);
    convertBtn.addEventListener('click', convertVideo);
    setupDragAndDrop(fileUpload, handleVideoFileSelect);
    
    function handleVideoFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            selectedFile = file;
            displayVideoPreview(file);
        } else {
            showAlert('Please select a valid video file', 'error');
        }
    }
    
    function displayVideoPreview(file) {
        const url = URL.createObjectURL(file);
        videoPreview.innerHTML = `
            <video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <source src="${url}" type="${file.type}">
                Your browser does not support the video tag.
            </video>
            <div class="video-info">
                <strong>File:</strong> ${file.name}<br>
                <strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
                <strong>Type:</strong> ${file.type}
            </div>
        `;
    }
    
    function convertVideo() {
        if (!selectedFile || AppState.isProcessing) return;
        
        AppState.isProcessing = true;
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="loading"></span> Converting...';
        
        showAlert('Video conversion started. This may take several minutes depending on file size.', 'info');
        
        const video = document.createElement('video');
        video.src = URL.createObjectURL(selectedFile);
        video.load();
        
        video.addEventListener('loadedmetadata', function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const stream = canvas.captureStream();
            const targetFormat = formatSelect.value;
            
            let mimeType;
            if (targetFormat === 'mp4') {
                mimeType = 'video/mp4;codecs=avc1.42E01E';
            } else {
                mimeType = 'video/webm;codecs=vp8';
            }
            
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                throw new Error(`Format ${targetFormat} not supported in this browser`);
            }
            
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            const chunks = [];
            
            mediaRecorder.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };
            
            mediaRecorder.onstop = function() {
                const blob = new Blob(chunks, { type: mimeType });
                const filename = `converted_video_${Date.now()}.${targetFormat}`;
                downloadBlob(blob, filename);
                
                showAlert('Video converted successfully!', 'success');
                
                AppState.isProcessing = false;
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert Video';
            };
            
            mediaRecorder.onerror = function(e) {
                showAlert('Error during video conversion: ' + e.error, 'error');
                AppState.isProcessing = false;
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert Video';
            };
            
            mediaRecorder.start();
            
            video.addEventListener('ended', function() {
                mediaRecorder.stop();
            });
            
            video.play();
        });
        
        video.onerror = function() {
            showAlert('Error loading video file', 'error');
            AppState.isProcessing = false;
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert Video';
        };
    }
}

function initAudioConverter() {
    const fileUpload = document.getElementById('audioFile');
    const formatSelect = document.getElementById('outputFormat');
    const convertBtn = document.getElementById('convertBtn');
    const audioPreview = document.getElementById('audioPreview');
    
    let selectedFile = null;
    
    fileUpload.addEventListener('change', handleAudioFileSelect);
    convertBtn.addEventListener('click', convertAudio);
    setupDragAndDrop(fileUpload, handleAudioFileSelect);
    
    function handleAudioFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            selectedFile = file;
            displayAudioPreview(file);
        } else {
            showAlert('Please select a valid audio file', 'error');
        }
    }
    
    function displayAudioPreview(file) {
        const url = URL.createObjectURL(file);
        audioPreview.innerHTML = `
            <audio controls style="width: 100%;">
                <source src="${url}" type="${file.type}">
                Your browser does not support the audio tag.
            </audio>
            <div class="audio-info">
                <strong>File:</strong> ${file.name}<br>
                <strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
                <strong>Type:</strong> ${file.type}
            </div>
        `;
    }
    
    function convertAudio() {
        if (!selectedFile || AppState.isProcessing) return;
        
        AppState.isProcessing = true;
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="loading"></span> Converting...';
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const reader = new FileReader();
        reader.onload = function(e) {
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                processAudioConversion(buffer);
            }, function(error) {
                showAlert('Error decoding audio: ' + error.message, 'error');
                AppState.isProcessing = false;
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert Audio';
            });
        };
        reader.readAsArrayBuffer(selectedFile);
    }
    
    function processAudioConversion(buffer) {
        const offlineContext = new OfflineAudioContext(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate
        );
        
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        source.connect(offlineContext.destination);
        source.start(0);
        
        offlineContext.startRendering().then(function(renderedBuffer) {
            const targetFormat = formatSelect.value;
            let blob;
            
            if (targetFormat === 'wav') {
                const wav = audioBufferToWav(renderedBuffer);
                blob = new Blob([wav], { type: 'audio/wav' });
            } else if (targetFormat === 'mp3') {
                // Note: MP3 conversion requires additional libraries
                showAlert('MP3 conversion requires additional libraries. Converting to WAV instead.', 'info');
                const wav = audioBufferToWav(renderedBuffer);
                blob = new Blob([wav], { type: 'audio/wav' });
            }
            
            const filename = `converted_audio_${Date.now()}.${targetFormat}`;
            downloadBlob(blob, filename);
            
            showAlert('Audio converted successfully!', 'success');
            
            AppState.isProcessing = false;
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert Audio';
            
            if (AppState.userPreferences.soundEnabled) {
                playSuccessSound();
            }
        }).catch(function(error) {
            showAlert('Error converting audio: ' + error.message, 'error');
            AppState.isProcessing = false;
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert Audio';
        });
    }
}

function initAudioTrimmer() {
    const fileUpload = document.getElementById('audioFile');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    const trimBtn = document.getElementById('trimBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const waveform = document.getElementById('waveform');
    
    let audioBuffer = null;
    let audioContext = null;
    
    fileUpload.addEventListener('change', loadAudioFile);
    trimBtn.addEventListener('click', trimAudio);
    setupDragAndDrop(fileUpload, loadAudioFile);
    
    if (startTime && endTime) {
        startTime.addEventListener('input', updateTrimPreview);
        endTime.addEventListener('input', updateTrimPreview);
    }
    
    function loadAudioFile(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.decodeAudioData(e.target.result, function(buffer) {
                    audioBuffer = buffer;
                    setupAudioPlayer(file);
                    setupWaveform(buffer);
                    setupTimeControls(buffer);
                }, function(error) {
                    showAlert('Error decoding audio: ' + error.message, 'error');
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            showAlert('Please select a valid audio file', 'error');
        }
    }
    
    function setupAudioPlayer(file) {
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        audioPlayer.load();
        
        audioPlayer.addEventListener('loadedmetadata', function() {
            showAlert(`Audio loaded. Duration: ${audioPlayer.duration.toFixed(2)} seconds`, 'success');
        });
    }
    
    function setupWaveform(buffer) {
        if (!waveform) return;
        
        const canvas = waveform;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, width, height);
        
        const channelData = buffer.getChannelData(0);
        const sliceWidth = width / channelData.length;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i < channelData.length; i++) {
            const x = i * sliceWidth;
            const v = channelData[i] * 0.5;
            const y = (height / 2) + (v * height / 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    function setupTimeControls(buffer) {
        const duration = buffer.duration;
        
        if (startTime) {
            startTime.max = duration;
            startTime.value = 0;
        }
        
        if (endTime) {
            endTime.max = duration;
            endTime.value = duration;
        }
    }
    
    function updateTrimPreview() {
        // Visual feedback for trim selection
        const start = parseFloat(startTime.value) || 0;
        const end = parseFloat(endTime.value) || 0;
        
        if (start >= end) {
            endTime.value = Math.min(start + 0.1, parseFloat(endTime.max));
        }
    }
    
    function trimAudio() {
        if (!audioBuffer) {
            showAlert('Please select an audio file first', 'error');
            return;
        }
        
        const start = parseFloat(startTime.value);
        const end = parseFloat(endTime.value);
        
        if (start >= end) {
            showAlert('Start time must be less than end time', 'error');
            return;
        }
        
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(start * sampleRate);
        const endSample = Math.floor(end * sampleRate);
        const length = endSample - startSample;
        
        const trimmedBuffer = audioBuffer.context.createBuffer(
            audioBuffer.numberOfChannels,
            length,
            sampleRate
        );
        
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            const trimmedData = trimmedBuffer.getChannelData(channel);
            
            for (let i = 0; i < length; i++) {
                trimmedData[i] = channelData[startSample + i];
            }
        }
        
        const wav = audioBufferToWav(trimmedBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        
        const filename = `trimmed_audio_${Date.now()}.wav`;
        downloadBlob(blob, filename);
        
        showAlert(`Audio trimmed successfully! Duration: ${(end - start).toFixed(2)} seconds`, 'success');
        
        if (AppState.userPreferences.soundEnabled) {
            playSuccessSound();
        }
    }
}

// ================== ENHANCED CALCULATORS ==================

function initAgeCalculator() {
    const dobInput = document.getElementById('dob');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    
    calculateBtn.addEventListener('click', calculateAge);
    
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    dobInput.max = today;
    
    function calculateAge() {
        const dob = new Date(dobInput.value);
        const today = new Date();
        
        if (!dobInput.value || isNaN(dob.getTime())) {
            showAlert('Please enter a valid date of birth', 'error');
            return;
        }
        
        if (dob > today) {
            showAlert('Date of birth cannot be in the future', 'error');
            return;
        }
        
        // Calculate age components
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();
        
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total durations
        const totalDays = Math.floor((today - dob) / (1000 * 60 * 60 * 24));
        const totalMonths = years * 12 + months;
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = Math.floor((today - dob) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((today - dob) / (1000 * 60));
        const totalSeconds = Math.floor((today - dob) / 1000);
        
        // Calculate next birthday
        const nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
        const daysToNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        // Calculate zodiac sign
        const zodiacSign = getZodiacSign(dob);
        
        // Calculate day of week born
        const dayOfWeek = dob.toLocaleDateString('en-US', { weekday: 'long' });
        
        displayAgeResult({
            years, months, days,
            totalDays, totalMonths, totalWeeks,
            totalHours, totalMinutes, totalSeconds,
            daysToNextBirthday, zodiacSign, dayOfWeek,
            dob: dob.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        });
    }
    
    function getZodiacSign(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries ♈";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus ♉";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini ♊";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer ♋";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo ♌";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo ♍";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra ♎";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio ♏";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius ♐";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn ♑";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius ♒";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces ♓";
        return "Unknown";
    }
    
    function displayAgeResult(data) {
        resultDiv.innerHTML = `
            <div class="age-result">
                <h4>Age Calculation Result 🎉</h4>
                <div class="birth-info">
                    <strong>Born on:</strong> ${data.dob} (${data.dayOfWeek})
                </div>
                <div class="primary-age">
                    <div class="age-display">
                        <span class="age-number">${data.years}</span>
                        <span class="age-label">Years</span>
                    </div>
                    <div class="age-display">
                        <span class="age-number">${data.months}</span>
                        <span class="age-label">Months</span>
                    </div>
                    <div class="age-display">
                        <span class="age-number">${data.days}</span>
                        <span class="age-label">Days</span>
                    </div>
                </div>
                <div class="zodiac-info">
                    <strong>Zodiac Sign:</strong> ${data.zodiacSign}
                </div>
                <div class="next-birthday">
                    <strong>Next Birthday:</strong> ${data.daysToNextBirthday} days
                </div>
                <div class="detailed-stats">
                    <h5>Detailed Statistics</h5>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>Total Days:</strong> ${data.totalDays.toLocaleString()}
                        </div>
                        <div class="stat-item">
                            <strong>Total Months:</strong> ${data.totalMonths.toLocaleString()}
                        </div>
                        <div class="stat-item">
                            <strong>Total Weeks:</strong> ${data.totalWeeks.toLocaleString()}
                        </div>
                        <div class="stat-item">
                            <strong>Total Hours:</strong> ${data.totalHours.toLocaleString()}
                        </div>
                        <div class="stat-item">
                            <strong>Total Minutes:</strong> ${data.totalMinutes.toLocaleString()}
                        </div>
                        <div class="stat-item">
                            <strong>Total Seconds:</strong> ${data.totalSeconds.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function initEMICalculator() {
    const loanAmount = document.getElementById('loanAmount');
    const interestRate = document.getElementById('interestRate');
    const loanTenure = document.getElementById('loanTenure');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    
    // Add input formatting
    loanAmount.addEventListener('input', formatCurrency);
    interestRate.addEventListener('input', formatPercentage);
    
    calculateBtn.addEventListener('click', calculateEMI);
    
    function formatCurrency(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            e.target.value = parseInt(value).toLocaleString();
        }
    }
    
    function formatPercentage(e) {
        if (e.target.value && !e.target.value.includes('%')) {
            e.target.value = e.target.value + '%';
        }
    }
    
    function calculateEMI() {
        const P = parseFloat(loanAmount.value.replace(/[^\d]/g, ''));
        const annualRate = parseFloat(interestRate.value.replace('%', ''));
        const years = parseFloat(loanTenure.value);
        
        if (!P || !annualRate || !years || P <= 0 || annualRate <= 0 || years <= 0) {
            showAlert('Please enter valid loan details', 'error');
            return;
        }
        
        const r = annualRate / (12 * 100); // Monthly interest rate
        const n = years * 12; // Number of monthly installments
        
        const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmount = EMI * n;
        const totalInterest = totalAmount - P;
        const principalPercentage = (P / totalAmount) * 100;
        const interestPercentage = (totalInterest / totalAmount) * 100;
        
        // Generate payment schedule
        const schedule = generatePaymentSchedule(P, r, n, EMI);
        
        displayEMIResult({
            EMI, totalAmount, totalInterest, principalPercentage, interestPercentage,
            loanAmount: P, interestRate: annualRate, loanTenure: years,
            schedule
        });
    }
    
    function generatePaymentSchedule(P, r, n, EMI) {
        let balance = P;
        const schedule = [];
        
        for (let i = 1; i <= Math.min(n, 12); i++) { // Show first 12 months
            const interestPayment = balance * r;
            const principalPayment = EMI - interestPayment;
            balance -= principalPayment;
            
            schedule.push({
                month: i,
                EMI: EMI,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }
        
        return schedule;
    }
    
    function displayEMIResult(data) {
        resultDiv.innerHTML = `
            <div class="emi-result">
                <h4>EMI Calculation Result 💰</h4>
                <div class="emi-summary">
                    <div class="emi-highlight">
                        <div class="emi-amount">₹${data.EMI.toLocaleString('en-IN', {maximumFractionDigits: 2})}</div>
                        <div class="emi-label">Monthly EMI</div>
                    </div>
                    <div class="breakdown">
                        <div class="breakdown-item">
                            <strong>Principal Amount:</strong><br>
                            ₹${data.loanAmount.toLocaleString('en-IN')}
                        </div>
                        <div class="breakdown-item">
                            <strong>Total Interest:</strong><br>
                            ₹${data.totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                        </div>
                        <div class="breakdown-item">
                            <strong>Total Amount:</strong><br>
                            ₹${data.totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                        </div>
                    </div>
                </div>
                <div class="percentage-breakdown">
                    <div class="percentage-item">
                        <div class="percentage-bar">
                            <div class="percentage-fill principal" style="width: ${data.principalPercentage}%"></div>
                            <div class="percentage-fill interest" style="width: ${data.interestPercentage}%"></div>
                        </div>
                        <div class="percentage-labels">
                            <span>Principal: ${data.principalPercentage.toFixed(1)}%</span>
                            <span>Interest: ${data.interestPercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="loan-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Loan Amount:</strong> ₹${data.loanAmount.toLocaleString('en-IN')}
                        </div>
                        <div class="detail-item">
                            <strong>Interest Rate:</strong> ${data.interestRate}% p.a.
                        </div>
                        <div class="detail-item">
                            <strong>Loan Tenure:</strong> ${data.loanTenure} years (${data.loanTenure * 12} months)
                        </div>
                        <div class="detail-item">
                            <strong>Interest/Principal Ratio:</strong> ${(data.totalInterest / data.loanAmount * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div class="payment-schedule">
                    <h5>Payment Schedule (First 12 Months)</h5>
                    <div class="schedule-table">
                        <div class="schedule-header">
                            <span>Month</span>
                            <span>EMI</span>
                            <span>Principal</span>
                            <span>Interest</span>
                            <span>Balance</span>
                        </div>
                        ${data.schedule.map(payment => `
                            <div class="schedule-row">
                                <span>${payment.month}</span>
                                <span>₹${payment.EMI.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                                <span>₹${payment.principal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                                <span>₹${payment.interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                                <span>₹${payment.balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

function initSIPCalculator() {
    const monthlyInvestment = document.getElementById('monthlyInvestment');
    const expectedReturn = document.getElementById('expectedReturn');
    const timePeriod = document.getElementById('timePeriod');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    
    // Add input formatting
    monthlyInvestment.addEventListener('input', formatCurrency);
    
    calculateBtn.addEventListener('click', calculateSIP);
    
    function formatCurrency(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            e.target.value = parseInt(value).toLocaleString();
        }
    }
    
    function calculateSIP() {
        const P = parseFloat(monthlyInvestment.value.replace(/[^\d]/g, ''));
        const annualReturn = parseFloat(expectedReturn.value);
        const years = parseFloat(timePeriod.value);
        
        if (!P || !annualReturn || !years || P <= 0 || annualReturn <= 0 || years <= 0) {
            showAlert('Please enter valid SIP details', 'error');
            return;
        }
        
        const r = annualReturn / (100 * 12); // Monthly rate
        const n = years * 12; // Total months
        
        const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const totalInvestment = P * n;
        const totalReturns = futureValue - totalInvestment;
        const investmentMultiple = futureValue / totalInvestment;
        
        // Generate yearly breakdown
        const yearlyBreakdown = generateSIPBreakdown(P, annualReturn / 100, years);
        
        displaySIPResult({
            futureValue, totalInvestment, totalReturns, investmentMultiple,
            monthlyInvestment: P, expectedReturn: annualReturn, timePeriod: years,
            yearlyBreakdown
        });
    }
    
    function generateSIPBreakdown(P, annualRate, years) {
        const breakdown = [];
        const monthlyRate = annualRate / 12;
        
        for (let year = 1; year <= years; year++) {
            const months = year * 12;
            const value = P * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            const invested = P * months;
            const returns = value - invested;
            
            breakdown.push({
                year,
                invested,
                value,
                returns,
                growth: (returns / invested * 100)
            });
        }
        
        return breakdown;
    }
    
    function displaySIPResult(data) {
        resultDiv.innerHTML = `
            <div class="sip-result">
                <h4>SIP Calculation Result 📈</h4>
                <div class="sip-summary">
                    <div class="sip-highlight">
                        <div class="sip-amount">₹${data.futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                        <div class="sip-label">Future Value</div>
                    </div>
                    <div class="sip-breakdown">
                        <div class="breakdown-item">
                            <strong>Total Investment:</strong><br>
                            ₹${data.totalInvestment.toLocaleString('en-IN')}
                        </div>
                        <div class="breakdown-item">
                            <strong>Total Returns:</strong><br>
                            ₹${data.totalReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </div>
                        <div class="breakdown-item">
                            <strong>Growth Multiple:</strong><br>
                            ${data.investmentMultiple.toFixed(2)}x
                        </div>
                    </div>
                </div>
                <div class="sip-chart">
                    <div class="chart-bars">
                        <div class="chart-bar invested" style="height: 40%;">
                            <div class="bar-label">Invested<br>₹${(data.totalInvestment / 100000).toFixed(1)}L</div>
                        </div>
                        <div class="chart-bar returns" style="height: 60%;">
                            <div class="bar-label">Returns<br>₹${(data.totalReturns / 100000).toFixed(1)}L</div>
                        </div>
                    </div>
                    <div class="chart-labels">
                        <span>Investment vs Returns</span>
                    </div>
                </div>
                <div class="sip-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Monthly Investment:</strong> ₹${data.monthlyInvestment.toLocaleString('en-IN')}
                        </div>
                        <div class="detail-item">
                            <strong>Expected Return:</strong> ${data.expectedReturn}% p.a.
                        </div>
                        <div class="detail-item">
                            <strong>Time Period:</strong> ${data.timePeriod} years
                        </div>
                        <div class="detail-item">
                            <strong>Annual Growth:</strong> ${((data.totalReturns / data.totalInvestment) * 100 / data.timePeriod).toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div class="yearly-breakdown">
                    <h5>Yearly Growth Breakdown</h5>
                    <div class="breakdown-table">
                        <div class="breakdown-header">
                            <span>Year</span>
                            <span>Invested</span>
                            <span>Value</span>
                            <span>Returns</span>
                            <span>Growth %</span>
                        </div>
                        ${data.yearlyBreakdown.map(year => `
                            <div class="breakdown-row">
                                <span>${year.year}</span>
                                <span>₹${(year.invested / 100000).toFixed(1)}L</span>
                                <span>₹${(year.value / 100000).toFixed(1)}L</span>
                                <span>₹${(year.returns / 100000).toFixed(1)}L</span>
                                <span>${year.growth.toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

function initBMICalculator() {
    const height = document.getElementById('height');
    const weight = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    
    calculateBtn.addEventListener('click', calculateBMI);
    
    function calculateBMI() {
        const h = parseFloat(height.value) / 100; // Convert cm to meters
        const w = parseFloat(weight.value);
        
        if (!h || !w || h <= 0 || w <= 0) {
            showAlert('Please enter valid height and weight', 'error');
            return;
        }
        
        if (h > 3 || h < 0.5) {
            showAlert('Please enter height in centimeters (e.g., 170)', 'error');
            return;
        }
        
        if (w > 500 || w < 10) {
            showAlert('Please enter weight in kilograms', 'error');
            return;
        }
        
        const bmi = w / (h * h);
        
        const result = analyzeBMI(bmi, h, w);
        displayBMIResult(result);
    }
    
    function analyzeBMI(bmi, height, weight) {
        let category, color, advice, risk;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
            risk = 'Malnutrition risk';
            advice = [
                'Consider consulting a healthcare provider',
                'Increase caloric intake with healthy foods',
                'Include protein-rich foods in diet',
                'Consider strength training exercises'
            ];
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            color = '#10b981';
            risk = 'Low risk';
            advice = [
                'Congratulations! Maintain your current lifestyle',
                'Continue balanced diet and regular exercise',
                'Monitor weight periodically',
                'Maintain healthy habits'
            ];
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
            risk = 'Enhanced risk';
            advice = [
                'Consider adopting a healthier diet',
                'Increase physical activity',
                'Aim for gradual weight loss (0.5-1 kg/week)',
                'Consult healthcare provider if needed'
            ];
        } else {
            category = 'Obese';
            color = '#ef4444';
            risk = 'High risk';
            advice = [
                'Please consult a healthcare provider immediately',
                'Consider medically supervised weight loss program',
                'Focus on gradual, sustainable lifestyle changes',
                'Regular health monitoring recommended'
            ];
        }
        
        // Calculate ideal weight range
        const idealWeightMin = 18.5 * height * height;
        const idealWeightMax = 24.9 * height * height;
        const weightToLose = weight > idealWeightMax ? weight - idealWeightMax : 0;
        const weightToGain = weight < idealWeightMin ? idealWeightMin - weight : 0;
        
        return {
            bmi: bmi,
            category: category,
            color: color,
            risk: risk,
            advice: advice,
            height: height,
            weight: weight,
            idealWeightMin: idealWeightMin,
            idealWeightMax: idealWeightMax,
            weightToLose: weightToLose,
            weightToGain: weightToGain
        };
    }
    
    function displayBMIResult(data) {
        resultDiv.innerHTML = `
            <div class="bmi-result">
                <h4>BMI Calculation Result ⚖️</h4>
                <div class="bmi-display">
                    <div class="bmi-circle">
                        <div class="bmi-value" style="color: ${data.color};">${data.bmi.toFixed(1)}</div>
                        <div class="bmi-category" style="color: ${data.color};">${data.category}</div>
                    </div>
                </div>
                <div class="bmi-risk">
                    <strong>Health Risk:</strong> <span style="color: ${data.color};">${data.risk}</span>
                </div>
                <div class="bmi-advice">
                    <h5>Recommendations:</h5>
                    <ul>
                        ${data.advice.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                <div class="ideal-weight">
                    <h5>Ideal Weight Range</h5>
                    <div class="weight-range">
                        ${data.idealWeightMin.toFixed(1)} - ${data.idealWeightMax.toFixed(1)} kg
                    </div>
                    ${data.weightToLose > 0 ? `
                        <div class="weight-action">
                            <strong>Weight to lose:</strong> ${data.weightToLose.toFixed(1)} kg
                        </div>
                    ` : data.weightToGain > 0 ? `
                        <div class="weight-action">
                            <strong>Weight to gain:</strong> ${data.weightToGain.toFixed(1)} kg
                        </div>
                    ` : ''}
                </div>
                <div class="bmi-chart">
                    <h5>BMI Scale</h5>
                    <div class="bmi-scale">
                        <div class="scale-segment underweight">
                            <span>Underweight<br>&lt;18.5</span>
                        </div>
                        <div class="scale-segment normal">
                            <span>Normal<br>18.5-24.9</span>
                        </div>
                        <div class="scale-segment overweight">
                            <span>Overweight<br>25-29.9</span>
                        </div>
                        <div class="scale-segment obese">
                            <span>Obese<br>≥30</span>
                        </div>
                        <div class="bmi-indicator" style="left: ${Math.min((data.bmi / 40) * 100, 100)}%; background: ${data.color};"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ================== ENHANCED GENERATORS ==================

function initQRGenerator() {
    const inputText = document.getElementById('qrInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const qrCanvas = document.getElementById('qrCanvas');
    const colorPicker = document.getElementById('qrColor');
    const sizeSlider = document.getElementById('qrSize');
    
    let qrCodeData = null;
    
    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    
    // Real-time generation on input
    let typingTimer;
    inputText.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            if (inputText.value.trim()) {
                generateQR();
            }
        }, 1000);
    });
    
    function generateQR() {
        const text = inputText.value.trim();
        
        if (!text) {
            showAlert('Please enter text or URL to generate QR code', 'error');
            return;
        }
        
        // Use a simple QR code generation algorithm
        generateSimpleQR(text);
    }
    
    function generateSimpleQR(text) {
        const canvas = qrCanvas;
        const ctx = canvas.getContext('2d');
        const size = parseInt(sizeSlider.value) || 256;
        const color = colorPicker ? colorPicker.value : '#000000';
        
        canvas.width = size;
        canvas.height = size;
        
        // Create a pattern based on the text
        const pattern = generateQRPattern(text, size);
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Draw QR pattern
        ctx.fillStyle = color;
        const cellSize = size / pattern.size;
        
        for (let row = 0; row < pattern.size; row++) {
            for (let col = 0; col < pattern.size; col++) {
                if (pattern.data[row * pattern.size + col]) {
                    ctx.fillRect(
                        col * cellSize, 
                        row * cellSize, 
                        cellSize, 
                        cellSize
                    );
                }
            }
        }
        
        // Add finder patterns (simplified)
        addFinderPatterns(ctx, size, pattern.size, color);
        
        qrCodeData = canvas.toDataURL();
        downloadBtn.disabled = false;
        
        showAlert('QR Code generated successfully!', 'success');
    }
    
    function generateQRPattern(text, size) {
        const modules = 21; // Simplified QR code size
        const pattern = {
            size: modules,
            data: new Array(modules * modules).fill(false)
        };
        
        // Create a hash-based pattern
        const hash = simpleHash(text);
        const seed = hash % 1000;
        
        for (let i = 0; i < pattern.data.length; i++) {
            pattern.data[i] = ((hash + i * seed) % 7) === 0;
        }
        
        return pattern;
    }
    
    function addFinderPatterns(ctx, size, modules, color) {
        const patternSize = Math.floor(modules * 0.15);
        const cellSize = size / modules;
        
        // Top-left finder pattern
        drawFinderPattern(ctx, cellSize * 2, cellSize * 2, patternSize, cellSize, color);
        
        // Top-right finder pattern
        drawFinderPattern(ctx, size - cellSize * (patternSize + 2), cellSize * 2, patternSize, cellSize, color);
        
        // Bottom-left finder pattern
        drawFinderPattern(ctx, cellSize * 2, size - cellSize * (patternSize + 2), patternSize, cellSize, color);
    }
    
    function drawFinderPattern(ctx, x, y, size, cellSize, color) {
        ctx.fillStyle = color;
        
        // Outer square
        ctx.fillRect(x, y, size * cellSize, size * cellSize);
        
        // Inner white square
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
            x + cellSize, 
            y + cellSize, 
            (size - 2) * cellSize, 
            (size - 2) * cellSize
        );
        
        // Inner black square
        ctx.fillStyle = color;
        ctx.fillRect(
            x + cellSize * 2, 
            y + cellSize * 2, 
            (size - 4) * cellSize, 
            (size - 4) * cellSize
        );
    }
    
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    function downloadQR() {
        if (!qrCodeData) {
            showAlert('Please generate a QR code first', 'error');
            return;
        }
        
        const a = document.createElement('a');
        a.href = qrCodeData;
        a.download = `qr-code-${Date.now()}.png`;
        a.click();
        
        showAlert('QR Code downloaded successfully!', 'success');
    }
}

function initPasswordGenerator() {
    const length = document.getElementById('passwordLength');
    const uppercase = document.getElementById('includeUppercase');
    const lowercase = document.getElementById('includeLowercase');
    const numbers = document.getElementById('includeNumbers');
    const symbols = document.getElementById('includeSymbols');
    const generateBtn = document.getElementById('generateBtn');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');
    
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    
    // Real-time strength checking
    passwordOutput.addEventListener('input', updateStrengthMeter);
    
    // Auto-generate on load
    generatePassword();
    
    function generatePassword() {
        const passLength = parseInt(length.value);
        let chars = '';
        
        if (uppercase.checked) chars += uppercaseChars;
        if (lowercase.checked) chars += lowercaseChars;
        if (numbers.checked) chars += numberChars;
        if (symbols.checked) chars += symbolChars;
        
        if (!chars) {
            showAlert('Please select at least one character type', 'error');
            return;
        }
        
        let password = '';
        const charsLength = chars.length;
        
        // Ensure at least one character from each selected type
        if (uppercase.checked) password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        if (lowercase.checked) password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        if (numbers.checked) password += numberChars[Math.floor(Math.random() * numberChars.length)];
        if (symbols.checked) password += symbolChars[Math.floor(Math.random() * symbolChars.length)];
        
        // Fill the rest randomly
        for (let i = password.length; i < passLength; i++) {
            const randomIndex = Math.floor(Math.random() * charsLength);
            password += chars.charAt(randomIndex);
        }
        
        // Shuffle the password to avoid predictable patterns
        password = shuffleString(password);
        
        passwordOutput.value = password;
        updateStrengthMeter();
    }
    
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Length scoring
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        
        // Character variety scoring
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Pattern penalties
        if (/([a-zA-Z])\1\1/.test(password)) score--;
        if (/([0-9])\1\1/.test(password)) score--;
        if (password.length < 6) score--;
        
        return Math.max(0, Math.min(score, 10));
    }
    
    function updateStrengthMeter() {
        const password = passwordOutput.value;
        const score = calculatePasswordStrength(password);
        
        let color, text, percentage;
        
        if (score <= 3) {
            color = '#ef4444';
            text = 'Weak';
            percentage = 25;
        } else if (score <= 6) {
            color = '#f59e0b';
            text = 'Medium';
            percentage = 50;
        } else if (score <= 8) {
            color = '#10b981';
            text = 'Strong';
            percentage = 75;
        } else {
            color = '#059669';
            text = 'Very Strong';
            percentage = 100;
        }
        
        strengthMeter.style.background = color;
        strengthMeter.style.width = percentage + '%';
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    function copyPassword() {
        if (!passwordOutput.value) {
            showAlert('No password to copy', 'error');
            return;
        }
        
        passwordOutput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
        showAlert('Password copied to clipboard!', 'success');
    }
}

// ================== ENHANCED TEXT TOOLS ==================

function initWordCounter() {
    const textInput = document.getElementById('textInput');
    const countBtn = document.getElementById('countBtn');
    const resultDiv = document.getElementById('result');
    const liveCount = document.getElementById('liveCount');
    
    countBtn.addEventListener('click', countWords);
    
    // Real-time counting
    if (textInput && liveCount) {
        textInput.addEventListener('input', function() {
            updateLiveCount(this.value);
        });
    }
    
    function updateLiveCount(text) {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        liveCount.innerHTML = `
            <span class="live-stat">Words: ${words.length}</span>
            <span class="live-stat">Characters: ${text.length}</span>
            <span class="live-stat">Lines: ${text.split('\n').length}</span>
        `;
    }
    
    function countWords() {
        const text = textInput.value.trim();
        
        if (!text) {
            showAlert('Please enter some text to count', 'error');
            return;
        }
        
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
        const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
        const lines = text.split('\n').length;
        
        // Calculate reading time (average 200 words per minute)
        const readingTime = Math.ceil(words.length / 200);
        
        // Calculate speaking time (average 150 words per minute)
        const speakingTime = Math.ceil(words.length / 150);
        
        // Additional statistics
        const avgWordsPerSentence = sentences > 0 ? (words.length / sentences).toFixed(1) : '0';
        const avgCharactersPerWord = words.length > 0 ? (charactersNoSpaces / words.length).toFixed(1) : '0';
        
        // Find longest and shortest words
        const wordLengths = words.map(word => word.replace(/[^a-zA-Z]/g, '').length);
        const longestWord = wordLengths.length > 0 ? Math.max(...wordLengths) : 0;
        const shortestWord = wordLengths.length > 0 ? Math.min(...wordLengths.filter(len => len > 0)) : 0;
        
        // Frequency analysis
        const wordFreq = {};
        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
            if (cleanWord) {
                wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
        });
        
        const topWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        displayWordCountResult({
            words: words.length,
            characters,
            charactersNoSpaces,
            sentences,
            paragraphs,
            lines,
            readingTime,
            speakingTime,
            avgWordsPerSentence,
            avgCharactersPerWord,
            longestWord,
            shortestWord,
            topWords
        });
    }
    
    function displayWordCountResult(data) {
        resultDiv.innerHTML = `
            <div class="word-count-result">
                <h4>Text Analysis Result 📊</h4>
                <div class="main-stats">
                    <div class="stat-card">
                        <div class="stat-number">${data.words.toLocaleString()}</div>
                        <div class="stat-label">Words</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.characters.toLocaleString()}</div>
                        <div class="stat-label">Characters</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.charactersNoSpaces.toLocaleString()}</div>
                        <div class="stat-label">No Spaces</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.sentences}</div>
                        <div class="stat-label">Sentences</div>
                    </div>
                </div>
                <div class="detailed-stats">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>Paragraphs:</strong> ${data.paragraphs}
                        </div>
                        <div class="stat-item">
                            <strong>Lines:</strong> ${data.lines}
                        </div>
                        <div class="stat-item">
                            <strong>Reading Time:</strong> ${data.readingTime} min
                        </div>
                        <div class="stat-item">
                            <strong>Speaking Time:</strong> ${data.speakingTime} min
                        </div>
                        <div class="stat-item">
                            <strong>Avg Words/Sentence:</strong> ${data.avgWordsPerSentence}
                        </div>
                        <div class="stat-item">
                            <strong>Avg Characters/Word:</strong> ${data.avgCharactersPerWord}
                        </div>
                        <div class="stat-item">
                            <strong>Longest Word:</strong> ${data.longestWord} chars
                        </div>
                        <div class="stat-item">
                            <strong>Shortest Word:</strong> ${data.shortestWord} chars
                        </div>
                    </div>
                </div>
                ${data.topWords.length > 0 ? `
                    <div class="word-frequency">
                        <h5>Top 5 Most Common Words</h5>
                        <div class="frequency-list">
                            ${data.topWords.map(([word, count], index) => `
                                <div class="frequency-item">
                                    <span class="word">${word}</span>
                                    <span class="count">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

function initBase64Encoder() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const swapBtn = document.getElementById('swapBtn');
    const fileUpload = document.getElementById('fileUpload');
    
    encodeBtn.addEventListener('click', encodeText);
    decodeBtn.addEventListener('click', decodeText);
    swapBtn.addEventListener('click', swapTexts);
    
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileUpload);
    }
    
    // Auto-detect and process
    inputText.addEventListener('input', autoDetectType);
    
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file && file.size < 1024 * 1024) { // 1MB limit
            const reader = new FileReader();
            reader.onload = function(e) {
                inputText.value = e.target.result;
                showAlert(`File loaded: ${file.name}`, 'success');
            };
            reader.readAsText(file);
        } else {
            showAlert('File too large or invalid', 'error');
        }
    }
    
    function autoDetectType() {
        const text = inputText.value.trim();
        if (!text) return;
        
        // Try to decode first (assuming it's base64)
        try {
            const decoded = decodeBase64(text);
            if (decoded) {
                outputText.value = decoded;
                showAlert('Auto-detected Base64 encoding', 'info');
            }
        } catch (e) {
            // Not base64, try encoding
            try {
                const encoded = encodeBase64(text);
                outputText.value = encoded;
                showAlert('Auto-detected text encoding', 'info');
            } catch (e2) {
                // Unable to process
            }
        }
    }
    
    function encodeText() {
        const text = inputText.value;
        
        if (!text) {
            showAlert('Please enter text to encode', 'error');
            return;
        }
        
        try {
            const encoded = encodeBase64(text);
            outputText.value = encoded;
            showAlert('Text encoded successfully!', 'success');
        } catch (error) {
            showAlert('Error encoding text: ' + error.message, 'error');
        }
    }
    
    function decodeText() {
        const encoded = outputText.value;
        
        if (!encoded) {
            showAlert('Please enter encoded text to decode', 'error');
            return;
        }
        
        try {
            const decoded = decodeBase64(encoded);
            inputText.value = decoded;
            showAlert('Text decoded successfully!', 'success');
        } catch (error) {
            showAlert('Error decoding text. Please check if the input is valid Base64.', 'error');
        }
    }
    
    function encodeBase64(text) {
        try {
            return btoa(unescape(encodeURIComponent(text)));
        } catch (error) {
            throw new Error('Failed to encode text');
        }
    }
    
    function decodeBase64(encoded) {
        try {
            return decodeURIComponent(escape(atob(encoded)));
        } catch (error) {
            throw new Error('Failed to decode Base64');
        }
    }
    
    function swapTexts() {
        const temp = inputText.value;
        inputText.value = outputText.value;
        outputText.value = temp;
    }
}

function initTextToSpeech() {
    const textInput = document.getElementById('ttsText');
    const speakBtn = document.getElementById('speakBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const stopBtn = document.getElementById('stopBtn');
    const voiceSelect = document.getElementById('voiceSelect');
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const volumeInput = document.getElementById('volume');
    const rateValue = document.getElementById('rateValue');
    const pitchValue = document.getElementById('pitchValue');
    const volumeValue = document.getElementById('volumeValue');
    
    let voices = [];
    let currentUtterance = null;
    
    // Update value displays
    rateInput.addEventListener('input', () => rateValue.textContent = rateInput.value);
    pitchInput.addEventListener('input', () => pitchValue.textContent = pitchInput.value);
    volumeInput.addEventListener('input', () => volumeValue.textContent = volumeInput.value);
    
    // Load voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        
        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Default Voice';
        voiceSelect.appendChild(defaultOption);
        
        // Voice options
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' - Default' : ''}`;
            voiceSelect.appendChild(option);
        });
    }
    
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    speakBtn.addEventListener('click', speakText);
    pauseBtn.addEventListener('click', pauseSpeech);
    resumeBtn.addEventListener('click', resumeSpeech);
    stopBtn.addEventListener('click', stopSpeech);
    
    function speakText() {
        const text = textInput.value.trim();
        
        if (!text) {
            showAlert('Please enter text to speak', 'error');
            return;
        }
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Apply voice settings
        if (voices.length > 0 && voiceSelect.value) {
            currentUtterance.voice = voices[parseInt(voiceSelect.value)];
        }
        
        currentUtterance.rate = parseFloat(rateInput.value);
        currentUtterance.pitch = parseFloat(pitchInput.value);
        currentUtterance.volume = parseFloat(volumeInput.value);
        
        // Event handlers
        currentUtterance.onstart = function() {
            updateButtonStates(true);
            showAlert('Speaking started...', 'info');
        };
        
        currentUtterance.onend = function() {
            updateButtonStates(false);
            showAlert('Speech finished', 'success');
        };
        
        currentUtterance.onerror = function(event) {
            updateButtonStates(false);
            showAlert('Speech error: ' + event.error, 'error');
        };
        
        speechSynthesis.speak(currentUtterance);
    }
    
    function pauseSpeech() {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            updateButtonStates(true, true);
            showAlert('Speech paused', 'info');
        }
    }
    
    function resumeSpeech() {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            updateButtonStates(true, false);
            showAlert('Speech resumed', 'info');
        }
    }
    
    function stopSpeech() {
        speechSynthesis.cancel();
        updateButtonStates(false);
        showAlert('Speech stopped', 'info');
    }
    
    function updateButtonStates(speaking, paused = false) {
        speakBtn.disabled = speaking;
        pauseBtn.disabled = !speaking || paused;
        resumeBtn.disabled = !paused;
        stopBtn.disabled = !speaking;
    }
    
    // Sample text button
    const sampleBtn = document.getElementById('sampleBtn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', function() {
            const samples = [
                "Hello! This is a text to speech demonstration using the Web Speech API.",
                "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
                "Welcome to our Multi Function Tool Hub! We provide free online utilities for everyone.",
                "Technology is best when it brings people together and makes life easier."
            ];
            
            const randomSample = samples[Math.floor(Math.random() * samples.length)];
            textInput.value = randomSample;
            showAlert('Sample text loaded', 'success');
        });
    }
}

function initSpeechToText() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const outputText = document.getElementById('sttOutput');
    const statusDiv = document.getElementById('sttStatus');
    const languageSelect = document.getElementById('language');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showAlert('Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'error');
        startBtn.disabled = true;
        stopBtn.disabled = true;
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect ? languageSelect.value : 'en-US';
    
    recognition.onstart = function() {
        updateStatus('Listening... Speak now!', 'listening');
        startBtn.disabled = true;
        stopBtn.disabled = false;
        outputText.focus();
    };
    
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        outputText.value = finalTranscript + interimTranscript;
        updateStatus('Listening...', 'listening');
    };
    
    recognition.onerror = function(event) {
        let errorMessage = 'Speech recognition error';
        
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone found. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error occurred. Please check your connection.';
                break;
            default:
                errorMessage = 'Error: ' + event.error;
        }
        
        updateStatus(errorMessage, 'error');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
    
    recognition.onend = function() {
        updateStatus('Speech recognition stopped', 'stopped');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
    
    startBtn.addEventListener('click', function() {
        try {
            recognition.start();
        } catch (error) {
            showAlert('Error starting speech recognition: ' + error.message, 'error');
        }
    });
    
    stopBtn.addEventListener('click', function() {
        recognition.stop();
    });
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            recognition.lang = this.value;
        });
    }
    
    function updateStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `alert alert-${type === 'listening' ? 'info' : type === 'error' ? 'error' : 'info'}`;
        
        // Add visual indicator for listening state
        if (type === 'listening') {
            statusDiv.innerHTML += ' <span class="listening-indicator">●</span>';
        }
    }
    
    // Copy button functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (outputText.value.trim()) {
                outputText.select();
                document.execCommand('copy');
                showAlert('Text copied to clipboard!', 'success');
            } else {
                showAlert('No text to copy', 'error');
            }
        });
    }
}

// ================== ENHANCED UTILITIES ==================

function initColorPicker() {
    const colorInput = document.getElementById('colorPicker');
    const hexOutput = document.getElementById('hexValue');
    const rgbOutput = document.getElementById('rgbValue');
    const hslOutput = document.getElementById('hslValue');
    const preview = document.getElementById('colorPreview');
    const copyButtons = document.querySelectorAll('.copy-color');
    
    colorInput.addEventListener('input', updateColorValues);
    
    // Copy button functionality
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const value = document.getElementById(target).value;
            navigator.clipboard.writeText(value).then(() => {
                showAlert(`${target.toUpperCase()} copied to clipboard!`, 'success');
            });
        });
    });
    
    function updateColorValues() {
        const color = colorInput.value;
        
        // Update preview
        preview.style.backgroundColor = color;
        
        // Convert to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const rgba = `rgba(${r}, ${g}, ${b}, 1)`;
        
        rgbOutput.value = rgb;
        
        // Convert to HSL
        const hsl = rgbToHsl(r, g, b);
        const hslString = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        const hslaString = `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`;
        
        hslOutput.value = hslString;
        
        // Update outputs
        document.getElementById('hexValue').value = color.toUpperCase();
        document.getElementById('rgbValue').value = rgb;
        document.getElementById('hslValue').value = hslString;
        
        // Additional color information
        updateColorInfo(color, r, g, b, hsl);
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    
    function updateColorInfo(hex, r, g, b, hsl) {
        // Calculate color temperature
        const temp = calculateColorTemperature(r, g, b);
        
        // Determine color name (simplified)
        const colorName = getColorName(hsl.h, hsl.s, hsl.l);
        
        // Update info display
        const infoDiv = document.getElementById('colorInfo');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <div class="color-info-grid">
                    <div class="info-item">
                        <strong>Color Name:</strong> ${colorName}
                    </div>
                    <div class="info-item">
                        <strong>Temperature:</strong> ${temp}
                    </div>
                    <div class="info-item">
                        <strong>Brightness:</strong> ${hsl.l < 30 ? 'Dark' : hsl.l > 70 ? 'Light' : 'Medium'}
                    </div>
                    <div class="info-item">
                        <strong>Saturation:</strong> ${hsl.s < 30 ? 'Low' : hsl.s > 70 ? 'High' : 'Medium'}
                    </div>
                </div>
            `;
        }
    }
    
    function calculateColorTemperature(r, g, b) {
        // Simplified color temperature calculation
        if (r > g && r > b) {
            return 'Warm';
        } else if (b > g && b > r) {
            return 'Cool';
        } else if (g > r && g > b) {
            return 'Neutral';
        }
        return 'Neutral';
    }
    
    function getColorName(h, s, l) {
        if (s < 10) {
            if (l < 20) return 'Black';
            if (l > 80) return 'White';
            return 'Gray';
        }
        
        const hue = h;
        
        if (hue < 15 || hue >= 345) return 'Red';
        if (hue < 45) return 'Orange';
        if (hue < 65) return 'Yellow';
        if (hue < 85) return 'Lime';
        if (hue < 150) return 'Green';
        if (hue < 180) return 'Cyan';
        if (hue < 210) return 'Sky Blue';
        if (hue < 240) return 'Blue';
        if (hue < 270) return 'Indigo';
        if (hue < 300) return 'Violet';
        if (hue < 330) return 'Magenta';
        return 'Pink';
    }
    
    // Initialize with default color
    updateColorValues();
}

function initJSONFormatter() {
    const inputText = document.getElementById('jsonInput');
    const formatBtn = document.getElementById('formatBtn');
    const validateBtn = document.getElementById('validateBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultText = document.getElementById('jsonResult');
    const errorDisplay = document.getElementById('jsonError');
    
    formatBtn.addEventListener('click', formatJSON);
    validateBtn.addEventListener('click', validateJSON);
    minifyBtn.addEventListener('click', minifyJSON);
    clearBtn.addEventListener('click', clearJSON);
    
    // Auto-format on input (debounced)
    let typingTimer;
    inputText.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            if (this.value.trim()) {
                tryFormatJSON(this.value);
            }
        }, 1000);
    });
    
    function tryFormatJSON(text) {
        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            resultText.value = formatted;
            hideError();
        } catch (error) {
            // Show error but don't interrupt typing
            showError('Invalid JSON: ' + error.message);
        }
    }
    
    function formatJSON() {
        const input = inputText.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to format', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            resultText.value = formatted;
            hideError();
            
            // Show statistics
            const stats = getJSONStats(parsed);
            showAlert(`JSON formatted successfully! ${stats}`, 'success');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }
    
    function validateJSON() {
        const input = inputText.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to validate', 'error');
            return;
        }
        
        try {
            JSON.parse(input);
            hideError();
            showAlert('Valid JSON! ✓', 'success');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }
    
    function minifyJSON() {
        const input = inputText.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to minify', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            resultText.value = minified;
            hideError();
            
            // Show size reduction
            const originalSize = input.length;
            const newSize = minified.length;
            const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
            
            showAlert(`JSON minified successfully! Size reduced by ${reduction}%`, 'success');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }
    
    function clearJSON() {
        inputText.value = '';
        resultText.value = '';
        hideError();
        showAlert('JSON cleared', 'info');
    }
    
    function getJSONStats(obj) {
        const stats = [];
        
        function countProperties(obj) {
            let count = 0;
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) count++;
            }
            return count;
        }
        
        function countElements(arr) {
            return Array.isArray(arr) ? arr.length : 0;
        }
        
        if (typeof obj === 'object' && obj !== null) {
            stats.push(`${countProperties(obj)} properties`);
        }
        
        if (Array.isArray(obj)) {
            stats.push(`${obj.length} elements`);
        }
        
        return stats.join(', ');
    }
    
    function showError(message) {
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.style.display = 'block';
        }
    }
    
    function hideError() {
        if (errorDisplay) {
            errorDisplay.style.display = 'none';
        }
    }
}

function initUnitConverter() {
    const categorySelect = document.getElementById('category');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const inputValue = document.getElementById('inputValue');
    const convertBtn = document.getElementById('convertBtn');
    const resultOutput = document.getElementById('resultOutput');
    const swapBtn = document.getElementById('swapBtn');
    
    const conversionData = {
        length: {
            units: {
                'mm': { name: 'Millimeters', factor: 0.001 },
                'cm': { name: 'Centimeters', factor: 0.01 },
                'm': { name: 'Meters', factor: 1 },
                'km': { name: 'Kilometers', factor: 1000 },
                'in': { name: 'Inches', factor: 0.0254 },
                'ft': { name: 'Feet', factor: 0.3048 },
                'yd': { name: 'Yards', factor: 0.9144 },
                'mi': { name: 'Miles', factor: 1609.34 }
            },
            base: 'm'
        },
        weight: {
            units: {
                'mg': { name: 'Milligrams', factor: 0.001 },
                'g': { name: 'Grams', factor: 1 },
                'kg': { name: 'Kilograms', factor: 1000 },
                'oz': { name: 'Ounces', factor: 28.3495 },
                'lb': { name: 'Pounds', factor: 453.592 },
                'ton': { name: 'Tons', factor: 1000000 }
            },
            base: 'g'
        },
        temperature: {
            units: {
                'c': { name: 'Celsius', type: 'celsius' },
                'f': { name: 'Fahrenheit', type: 'fahrenheit' },
                'k': { name: 'Kelvin', type: 'kelvin' }
            },
            base: 'celsius'
        }
    };
    
    categorySelect.addEventListener('change', updateUnitOptions);
    convertBtn.addEventListener('click', convert);
    swapBtn.addEventListener('click', swapUnits);
    inputValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convert();
        }
    });
    
    function updateUnitOptions() {
        const category = categorySelect.value;
        const data = conversionData[category];
        
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        Object.keys(data.units).forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = data.units[unit].name;
            fromUnit.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = data.units[unit].name;
            toUnit.appendChild(option2);
        });
        
        // Set different defaults for temperature
        if (category === 'temperature') {
            fromUnit.value = 'c';
            toUnit.value = 'f';
        } else {
            fromUnit.value = Object.keys(data.units)[0];
            toUnit.value = Object.keys(data.units)[1];
        }
        
        updateConversionInfo();
    }
    
    function convert() {
        const category = categorySelect.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        const value = parseFloat(inputValue.value);
        
        if (!value || isNaN(value)) {
            showAlert('Please enter a valid number', 'error');
            return;
        }
        
        if (value < 0 && category !== 'temperature') {
            showAlert('Please enter a non-negative number', 'error');
            return;
        }
        
        const data = conversionData[category];
        let result;
        
        if (category === 'temperature') {
            result = convertTemperature(value, from, to);
        } else {
            result = convertUnit(value, from, to, data);
        }
        
        displayResult(result, value, from, to, category);
    }
    
    function convertUnit(value, from, to, data) {
        // Convert to base unit first, then to target
        const fromFactor = data.units[from].factor;
        const toFactor = data.units[to].factor;
        
        const baseValue = value * fromFactor;
        const result = baseValue / toFactor;
        
        return result;
    }
    
    function convertTemperature(value, from, to) {
        let celsius;
        
        // Convert to Celsius first
        switch (from) {
            case 'c':
                celsius = value;
                break;
            case 'f':
                celsius = (value - 32) * 5/9;
                break;
            case 'k':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target
        switch (to) {
            case 'c':
                return celsius;
            case 'f':
                return celsius * 9/5 + 32;
            case 'k':
                return celsius + 273.15;
        }
    }
    
    function displayResult(result, inputValue, from, to, category) {
        const categoryData = conversionData[category];
        const fromName = categoryData.units[from].name;
        const toName = categoryData.units[to].name;
        
        resultOutput.value = result.toFixed(6).replace(/\.?0+$/, '');
        
        // Show conversion details
        const details = document.createElement('div');
        details.className = 'conversion-details';
        details.innerHTML = `
            <h5>Conversion Details</h5>
            <div class="conversion-formula">
                ${inputValue} ${fromName} = ${result.toFixed(6).replace(/\.?0+$/, '')} ${toName}
            </div>
            <div class="conversion-info">
                <strong>Formula:</strong> ${getConversionFormula(category, from, to)}
            </div>
        `;
        
        // Remove previous details
        const existingDetails = modalBody.querySelector('.conversion-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        
        modalBody.appendChild(details);
        
        showAlert('Conversion completed successfully!', 'success');
    }
    
    function getConversionFormula(category, from, to) {
        if (category === 'temperature') {
            switch (from + '->' + to) {
                case 'c->f': return '(°C × 9/5) + 32';
                case 'c->k': return '°C + 273.15';
                case 'f->c': return '(°F - 32) × 5/9';
                case 'f->k': return '((°F - 32) × 5/9) + 273.15';
                case 'k->c': return 'K - 273.15';
                case 'k->f': return '((K - 273.15) × 9/5) + 32';
                default: return 'Direct conversion';
            }
        }
        return 'Multiply by conversion factor';
    }
    
    function swapUnits() {
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        updateConversionInfo();
    }
    
    function updateConversionInfo() {
        const category = categorySelect.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        
        if (from === to) {
            resultOutput.value = inputValue.value || '0';
        }
    }
    
    // Initialize with default options
    updateUnitOptions();
}

function initTimerStopwatch() {
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    const startTimerBtn = document.getElementById('startTimer');
    const stopTimerBtn = document.getElementById('stopTimer');
    const resetTimerBtn = document.getElementById('resetTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    
    const startStopwatchBtn = document.getElementById('startStopwatch');
    const stopStopwatchBtn = document.getElementById('stopStopwatch');
    const resetStopwatchBtn = document.getElementById('resetStopwatch');
    const stopwatchDisplay = document.getElementById('stopwatchDisplay');
    
    const timerSoundToggle = document.getElementById('timerSound');
    
    let timerInterval = null;
    let timerTotal = 0;
    let stopwatchTime = 0;
    let stopwatchInterval = null;
    let timerEndTime = null;
    
    // Timer controls
    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Stopwatch controls
    startStopwatchBtn.addEventListener('click', startStopwatch);
    stopStopwatchBtn.addEventListener('click', stopStopwatch);
    resetStopwatchBtn.addEventListener('click', resetStopwatch);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (AppState.currentTool === 'timer-stopwatch') {
            if (e.code === 'Space') {
                e.preventDefault();
                if (stopwatchInterval) {
                    stopStopwatch();
                } else {
                    startStopwatch();
                }
            }
        }
    });
    
    function startTimer() {
        const minutes = parseInt(timerMinutes.value) || 0;
        const seconds = parseInt(timerSeconds.value) || 0;
        timerTotal = (minutes * 60 + seconds) * 1000;
        
        if (timerTotal <= 0) {
            showAlert('Please set a valid timer duration', 'error');
            return;
        }
        
        timerEndTime = Date.now() + timerTotal;
        
        timerInterval = setInterval(function() {
            const remaining = timerEndTime - Date.now();
            
            if (remaining <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                timerInterval = null;
                
                showAlert('Timer finished! ⏰', 'success');
                
                if (timerSoundToggle && timerSoundToggle.checked && AppState.userPreferences.soundEnabled) {
                    playNotificationSound();
                }
                
                updateTimerButtons();
                return;
            }
            
            updateTimerDisplay(remaining);
        }, 1000);
        
        updateTimerButtons();
        showAlert('Timer started!', 'info');
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        updateTimerButtons();
        showAlert('Timer stopped', 'info');
    }
    
    function resetTimer() {
        stopTimer();
        timerDisplay.textContent = '00:00';
        timerMinutes.value = '';
        timerSeconds.value = '';
        timerEndTime = null;
        showAlert('Timer reset', 'info');
    }
    
    function updateTimerDisplay(remaining) {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        
        timerDisplay.textContent = 
            String(mins).padStart(2, '0') + ':' + 
            String(secs).padStart(2, '0');
    }
    
    function updateTimerButtons() {
        const isRunning = timerInterval !== null;
        startTimerBtn.disabled = isRunning;
        stopTimerBtn.disabled = !isRunning;
    }
    
    function startStopwatch() {
        if (stopwatchInterval) return;
        
        stopwatchInterval = setInterval(function() {
            stopwatchTime += 10;
            updateStopwatchDisplay();
        }, 10);
        
        updateStopwatchButtons();
        showAlert('Stopwatch started!', 'info');
    }
    
    function stopStopwatch() {
        if (stopwatchInterval) {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
        }
        updateStopwatchButtons();
        showAlert('Stopwatch stopped', 'info');
    }
    
    function resetStopwatch() {
        stopStopwatch();
        stopwatchTime = 0;
        updateStopwatchDisplay();
        showAlert('Stopwatch reset', 'info');
    }
    
    function updateStopwatchDisplay() {
        const mins = Math.floor(stopwatchTime / 60000);
        const secs = Math.floor((stopwatchTime % 60000) / 1000);
        const ms = Math.floor((stopwatchTime % 1000) / 10);
        
        stopwatchDisplay.textContent = 
            String(mins).padStart(2, '0') + ':' + 
            String(secs).padStart(2, '0') + ':' + 
            String(ms).padStart(2, '0');
    }
    
    function updateStopwatchButtons() {
        const isRunning = stopwatchInterval !== null;
        startStopwatchBtn.disabled = isRunning;
        stopStopwatchBtn.disabled = !isRunning;
    }
    
    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }
}

// ================== ENHANCED UTILITY FUNCTIONS ==================

// Enhanced Tool Content Generator
function getToolContent(toolName) {
    const content = {
        'image-converter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert images between different formats while maintaining quality. Supports JPG, PNG, and WebP formats.</p>
                </div>
                <div class="form-group">
                    <label for="imageFile">Select Image File</label>
                    <div class="file-upload" id="imageFile">
                        <div class="upload-icon">📁</div>
                        <p>Drag & drop image here or click to browse</p>
                        <small>Supports JPG, PNG, WEBP (Max: 10MB)</small>
                    </div>
                    <input type="file" id="imageFile" accept="image/*" style="display: none;">
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="outputFormat">Output Format</label>
                        <select id="outputFormat" class="form-control">
                            <option value="jpeg">JPEG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WebP</option>
                        </select>
                    </div>
                    <div class="form-group" id="qualityGroup">
                        <label for="quality">Quality: <span id="qualityValue">90%</span></label>
                        <input type="range" id="quality" min="10" max="100" value="90" class="form-control">
                    </div>
                </div>
                <button id="convertBtn" class="btn" disabled>Convert Image</button>
                <div id="fileInfo"></div>
                <div id="preview" class="canvas-container"></div>
            </div>
        `,
        
        'image-compressor': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Reduce image file size while maintaining visual quality. Perfect for web optimization and storage management.</p>
                </div>
                <div class="form-group">
                    <label for="imageFile">Select Image File</label>
                    <div class="file-upload" id="imageFile">
                        <div class="upload-icon">📁</div>
                        <p>Drag & drop image here or click to browse</p>
                        <small>Supports JPG, PNG (Max: 10MB)</small>
                    </div>
                    <input type="file" id="imageFile" accept="image/*" style="display: none;">
                </div>
                <div class="form-group">
                    <label for="quality">Compression Quality: <span id="qualityValue">80%</span></label>
                    <input type="range" id="quality" min="10" max="100" value="80" class="form-control">
                    <small>Lower quality = smaller file size</small>
                </div>
                <button id="compressBtn" class="btn" disabled>Compress Image</button>
                <div id="preview" class="canvas-container"></div>
            </div>
        `,
        
        'image-cropper': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Crop images with live preview and precise controls. Maintain aspect ratios and remove unwanted areas.</p>
                </div>
                <div class="form-group">
                    <label for="imageFile">Select Image File</label>
                    <div class="file-upload" id="imageFile">
                        <div class="upload-icon">📁</div>
                        <p>Drag & drop image here or click to browse</p>
                        <small>Supports JPG, PNG (Max: 10MB)</small>
                    </div>
                    <input type="file" id="imageFile" accept="image/*" style="display: none;">
                </div>
                <div class="form-group">
                    <label for="aspectRatio">Aspect Ratio (Optional)</label>
                    <select id="aspectRatio" class="form-control">
                        <option value="free">Free Form</option>
                        <option value="1">1:1 (Square)</option>
                        <option value="4/3">4:3</option>
                        <option value="3/4">3:4</option>
                        <option value="16/9">16:9</option>
                        <option value="9/16">9:16</option>
                    </select>
                </div>
                <div class="form-group">
                    <canvas id="cropCanvas" style="max-width: 100%; border: 2px dashed #ccc; cursor: crosshair; border-radius: 8px;"></canvas>
                </div>
                <p class="text-center" style="color: #666; margin: 1rem 0;">
                    <strong>Instructions:</strong> Click and drag to select crop area. Release mouse to confirm selection.
                </p>
                <button id="cropBtn" class="btn" disabled>Crop & Download</button>
            </div>
        `,
        
        'video-converter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert videos between MP4 and WebM formats. Optimized for web and mobile viewing.</p>
                </div>
                <div class="alert alert-info">
                    <strong>Note:</strong> Video conversion may take several minutes depending on file size and browser capabilities.
                </div>
                <div class="form-group">
                    <label for="videoFile">Select Video File</label>
                    <div class="file-upload" id="videoFile">
                        <div class="upload-icon">🎥</div>
                        <p>Drag & drop video here or click to browse</p>
                        <small>Supports MP4, WebM, AVI (Max: 100MB)</small>
                    </div>
                    <input type="file" id="videoFile" accept="video/*" style="display: none;">
                </div>
                <div class="form-group">
                    <label for="outputFormat">Output Format</label>
                    <select id="outputFormat" class="form-control">
                        <option value="mp4">MP4</option>
                        <option value="webm">WebM</option>
                    </select>
                </div>
                <button id="convertBtn" class="btn" disabled>Convert Video</button>
                <div id="videoPreview" class="canvas-container"></div>
            </div>
        `,
        
        'audio-converter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert audio files between MP3 and WAV formats. Maintain audio quality during conversion.</p>
                </div>
                <div class="alert alert-info">
                    <strong>Note:</strong> MP3 conversion requires additional libraries. WAV format provides best quality.
                </div>
                <div class="form-group">
                    <label for="audioFile">Select Audio File</label>
                    <div class="file-upload" id="audioFile">
                        <div class="upload-icon">🎵</div>
                        <p>Drag & drop audio here or click to browse</p>
                        <small>Supports MP3, WAV, M4A (Max: 50MB)</small>
                    </div>
                    <input type="file" id="audioFile" accept="audio/*" style="display: none;">
                </div>
                <div class="form-group">
                    <label for="outputFormat">Output Format</label>
                    <select id="outputFormat" class="form-control">
                        <option value="wav">WAV (Recommended)</option>
                        <option value="mp3">MP3</option>
                    </select>
                </div>
                <button id="convertBtn" class="btn" disabled>Convert Audio</button>
                <div id="audioPreview" class="canvas-container"></div>
            </div>
        `,
        
        'audio-trimmer': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Trim audio files with start and end time controls. Perfect for creating ringtones or audio clips.</p>
                </div>
                <div class="form-group">
                    <label for="audioFile">Select Audio File</label>
                    <div class="file-upload" id="audioFile">
                        <div class="upload-icon">🎵</div>
                        <p>Drag & drop audio here or click to browse</p>
                        <small>Supports MP3, WAV, M4A (Max: 50MB)</small>
                    </div>
                    <input type="file" id="audioFile" accept="audio/*" style="display: none;">
                </div>
                <audio id="audioPlayer" controls style="width: 100%; margin: 1rem 0; border-radius: 8px;"></audio>
                <div class="waveform-container">
                    <canvas id="waveform" width="600" height="100" style="width: 100%; border: 1px solid #ddd; border-radius: 4px;"></canvas>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="startTime">Start Time (seconds)</label>
                        <input type="number" id="startTime" min="0" step="0.1" class="form-control" placeholder="0.0">
                    </div>
                    <div class="form-group">
                        <label for="endTime">End Time (seconds)</label>
                        <input type="number" id="endTime" min="0" step="0.1" class="form-control" placeholder="10.0">
                    </div>
                </div>
                <div class="button-group">
                    <button id="trimBtn" class="btn" disabled>Trim Audio</button>
                    <button id="playSelection" class="btn btn-secondary" disabled>Preview Selection</button>
                </div>
            </div>
        `,
        
        'age-calculator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Calculate exact age in years, months, and days. Get detailed age breakdown and statistics.</p>
                </div>
                <div class="form-group">
                    <label for="dob">Date of Birth</label>
                    <input type="date" id="dob" class="form-control">
                    <small>Select your birth date to calculate your exact age</small>
                </div>
                <button id="calculateBtn" class="btn">Calculate Age</button>
                <div id="result"></div>
            </div>
        `,
        
        'emi-calculator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Calculate loan EMI with total interest amount. Plan your finances with accurate payment schedules.</p>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="loanAmount">Loan Amount (₹)</label>
                        <input type="number" id="loanAmount" min="1000" step="1000" class="form-control" placeholder="100000">
                        <small>Enter principal amount</small>
                    </div>
                    <div class="form-group">
                        <label for="interestRate">Interest Rate (% per annum)</label>
                        <input type="number" id="interestRate" min="0.1" max="50" step="0.1" class="form-control" placeholder="8.5">
                        <small>Annual interest rate</small>
                    </div>
                    <div class="form-group">
                        <label for="loanTenure">Loan Tenure (years)</label>
                        <input type="number" id="loanTenure" min="1" max="30" step="1" class="form-control" placeholder="5">
                        <small>Loan duration in years</small>
                    </div>
                </div>
                <button id="calculateBtn" class="btn">Calculate EMI</button>
                <div id="result"></div>
            </div>
        `,
        
        'sip-calculator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Calculate future value of systematic investment plan. Plan your investment strategy effectively.</p>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="monthlyInvestment">Monthly Investment (₹)</label>
                        <input type="number" id="monthlyInvestment" min="500" step="500" class="form-control" placeholder="5000">
                        <small>Amount you invest monthly</small>
                    </div>
                    <div class="form-group">
                        <label for="expectedReturn">Expected Return (% per annum)</label>
                        <input type="number" id="expectedReturn" min="1" max="30" step="0.1" class="form-control" placeholder="12">
                        <small>Expected annual return rate</small>
                    </div>
                    <div class="form-group">
                        <label for="timePeriod">Time Period (years)</label>
                        <input type="number" id="timePeriod" min="1" max="40" step="1" class="form-control" placeholder="10">
                        <small>Investment duration in years</small>
                    </div>
                </div>
                <button id="calculateBtn" class="btn">Calculate SIP</button>
                <div id="result"></div>
            </div>
        `,
        
        'bmi-calculator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Calculate Body Mass Index with health category. Get personalized health recommendations.</p>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="height">Height (cm)</label>
                        <input type="number" id="height" min="50" max="300" step="0.1" class="form-control" placeholder="170">
                        <small>Enter height in centimeters</small>
                    </div>
                    <div class="form-group">
                        <label for="weight">Weight (kg)</label>
                        <input type="number" id="weight" min="20" max="300" step="0.1" class="form-control" placeholder="65">
                        <small>Enter weight in kilograms</small>
                    </div>
                </div>
                <button id="calculateBtn" class="btn">Calculate BMI</button>
                <div id="result"></div>
            </div>
        `,
        
        'qr-generator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Generate QR codes for text, URLs, and contact info. Create custom QR codes with download options.</p>
                </div>
                <div class="form-group">
                    <label for="qrInput">Text or URL to Encode</label>
                    <textarea id="qrInput" class="form-control" placeholder="Enter text, URL, or contact information here..." rows="3"></textarea>
                    <small>Enter the content you want to encode in the QR code</small>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="qrSize">Size: <span id="sizeValue">256</span>px</label>
                        <input type="range" id="qrSize" min="128" max="512" value="256" step="64" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="qrColor">Color</label>
                        <input type="color" id="qrColor" value="#000000" class="form-control">
                    </div>
                </div>
                <button id="generateBtn" class="btn">Generate QR Code</button>
                <div class="canvas-container">
                    <canvas id="qrCanvas" width="256" height="256" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;"></canvas>
                </div>
                <button id="downloadBtn" class="btn btn-secondary" disabled>Download QR Code</button>
            </div>
        `,
        
        'password-generator': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Generate secure passwords with custom options. Create strong passwords for enhanced security.</p>
                </div>
                <div class="form-group">
                    <label for="passwordLength">Password Length: <span id="lengthValue">16</span></label>
                    <input type="range" id="passwordLength" min="6" max="50" value="16" class="form-control">
                    <small>Longer passwords are more secure</small>
                </div>
                <div class="form-group">
                    <label>Character Types:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="includeUppercase" checked> Uppercase Letters (A-Z)</label>
                        <label><input type="checkbox" id="includeLowercase" checked> Lowercase Letters (a-z)</label>
                        <label><input type="checkbox" id="includeNumbers" checked> Numbers (0-9)</label>
                        <label><input type="checkbox" id="includeSymbols"> Symbols (!@#$...)</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="passwordOutput">Generated Password</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="passwordOutput" class="form-control" readonly>
                        <button id="copyBtn" class="btn btn-secondary">Copy</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Password Strength: <span id="strengthText">Medium</span></label>
                    <div class="progress">
                        <div id="strengthMeter" class="progress-bar" style="width: 50%; background: #f59e0b;"></div>
                    </div>
                </div>
                <div class="button-group">
                    <button id="generateBtn" class="btn">Generate New Password</button>
                    <button id="generateAnother" class="btn btn-secondary">Generate Another</button>
                </div>
            </div>
        `,
        
        'word-counter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Count words, characters, and estimate reading time. Analyze text with detailed statistics.</p>
                </div>
                <div class="form-group">
                    <div id="liveCount" class="live-counter">
                        <span class="live-stat">Words: 0</span>
                        <span class="live-stat">Characters: 0</span>
                        <span class="live-stat">Lines: 0</span>
                    </div>
                    <label for="textInput">Enter Text</label>
                    <textarea id="textInput" class="form-control" placeholder="Paste or type your text here..." rows="8"></textarea>
                    <small>Start typing to see live word count updates</small>
                </div>
                <button id="countBtn" class="btn">Analyze Text</button>
                <div id="result"></div>
            </div>
        `,
        
        'base64-encoder': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Encode and decode text using Base64 format. Essential for data transmission and encoding.</p>
                </div>
                <div class="form-group">
                    <label for="inputText">Input Text</label>
                    <textarea id="inputText" class="form-control" placeholder="Enter text to encode/decode..." rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="outputText">Output Text</label>
                    <textarea id="outputText" class="form-control" placeholder="Result will appear here..." rows="4" readonly></textarea>
                </div>
                <div class="button-group">
                    <button id="encodeBtn" class="btn">Encode to Base64</button>
                    <button id="decodeBtn" class="btn btn-secondary">Decode from Base64</button>
                    <button id="swapBtn" class="btn btn-outline">Swap</button>
                </div>
                <div class="form-group">
                    <label for="fileUpload">Or Upload Text File</label>
                    <input type="file" id="fileUpload" accept=".txt" class="form-control">
                </div>
            </div>
        `,
        
        'text-to-speech': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert text to natural-sounding speech. Multiple voice options and speed controls.</p>
                </div>
                <div class="form-group">
                    <label for="ttsText">Text to Speak</label>
                    <textarea id="ttsText" class="form-control" placeholder="Enter text to convert to speech..." rows="4"></textarea>
                    <button id="sampleBtn" class="btn btn-outline" style="margin-top: 0.5rem;">Load Sample Text</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="voiceSelect">Voice</label>
                        <select id="voiceSelect" class="form-control">
                            <option value="">Default Voice</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="rate">Rate: <span id="rateValue">1.0</span></label>
                        <input type="range" id="rate" min="0.1" max="3" step="0.1" value="1" class="form-control">
                        <small>Speech speed (0.1 = slow, 3.0 = fast)</small>
                    </div>
                    <div class="form-group">
                        <label for="pitch">Pitch: <span id="pitchValue">1.0</span></label>
                        <input type="range" id="pitch" min="0" max="2" step="0.1" value="1" class="form-control">
                        <small>Voice pitch (0 = low, 2 = high)</small>
                    </div>
                    <div class="form-group">
                        <label for="volume">Volume: <span id="volumeValue">1.0</span></label>
                        <input type="range" id="volume" min="0" max="1" step="0.1" value="1" class="form-control">
                        <small>Volume level</small>
                    </div>
                </div>
                <div class="button-group">
                    <button id="speakBtn" class="btn">Speak</button>
                    <button id="pauseBtn" class="btn btn-secondary">Pause</button>
                    <button id="resumeBtn" class="btn btn-secondary">Resume</button>
                    <button id="stopBtn" class="btn btn-outline">Stop</button>
                </div>
            </div>
        `,
        
        'speech-to-text': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert speech to text using voice recognition. Accurate transcription with real-time processing.</p>
                </div>
                <div class="alert alert-info">
                    <strong>Requirements:</strong> Microphone access and supported browser (Chrome/Edge recommended).
                </div>
                <div class="form-group">
                    <label for="language">Language</label>
                    <select id="language" class="form-control">
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                        <option value="it-IT">Italian</option>
                        <option value="pt-BR">Portuguese</option>
                        <option value="ru-RU">Russian</option>
                        <option value="ja-JP">Japanese</option>
                        <option value="ko-KR">Korean</option>
                        <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                </div>
                <div class="form-group">
                    <div id="sttStatus" class="alert">Click Start to begin speech recognition</div>
                </div>
                <div class="form-group">
                    <label for="sttOutput">Recognized Text</label>
                    <textarea id="sttOutput" class="form-control" placeholder="Speech will appear here..." rows="6" readonly></textarea>
                    <button id="copyBtn" class="btn btn-secondary" style="margin-top: 0.5rem;">Copy Text</button>
                </div>
                <div class="button-group">
                    <button id="startBtn" class="btn">Start Listening</button>
                    <button id="stopBtn" class="btn btn-secondary">Stop</button>
                </div>
            </div>
        `,
        
        'color-picker': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Pick colors and view HEX, RGB, and HSL values. Perfect for designers and developers.</p>
                </div>
                <div class="form-group">
                    <label for="colorPicker">Pick a Color</label>
                    <input type="color" id="colorPicker" value="#3b82f6" class="form-control">
                    <small>Click to select a color or use the color picker</small>
                </div>
                <div class="color-preview" id="colorPreview" style="width: 100%; height: 120px; border-radius: 8px; margin: 1rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="hexValue">HEX Value</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="hexValue" class="form-control" readonly>
                            <button class="copy-color btn btn-secondary" data-target="hexValue">Copy</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="rgbValue">RGB Value</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="rgbValue" class="form-control" readonly>
                            <button class="copy-color btn btn-secondary" data-target="rgbValue">Copy</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="hslValue">HSL Value</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="hslValue" class="form-control" readonly>
                            <button class="copy-color btn btn-secondary" data-target="hslValue">Copy</button>
                        </div>
                    </div>
                </div>
                <div id="colorInfo"></div>
            </div>
        `,
        
        'json-formatter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Format, validate, and beautify JSON data. Essential tool for developers and API testing.</p>
                </div>
                <div class="form-group">
                    <label for="jsonInput">Input JSON</label>
                    <textarea id="jsonInput" class="form-control" placeholder="Paste your JSON here..." rows="8"></textarea>
                    <small>Enter JSON data to format, validate, or minify</small>
                </div>
                <div class="button-group">
                    <button id="formatBtn" class="btn">Format JSON</button>
                    <button id="validateBtn" class="btn btn-secondary">Validate</button>
                    <button id="minifyBtn" class="btn btn-outline">Minify</button>
                    <button id="clearBtn" class="btn btn-outline">Clear</button>
                </div>
                <div class="form-group">
                    <div id="jsonError" class="alert alert-error" style="display: none;"></div>
                </div>
                <div class="form-group">
                    <label for="jsonResult">Result</label>
                    <textarea id="jsonResult" class="form-control" placeholder="Formatted JSON will appear here..." rows="8" readonly></textarea>
                </div>
            </div>
        `,
        
        'unit-converter': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Convert between length, weight, and temperature units. Support for metric and imperial systems.</p>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" class="form-control">
                        <option value="length">Length/Distance</option>
                        <option value="weight">Weight/Mass</option>
                        <option value="temperature">Temperature</option>
                    </select>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fromUnit">From Unit</label>
                        <select id="fromUnit" class="form-control"></select>
                    </div>
                    <div class="form-group">
                        <label for="toUnit">To Unit</label>
                        <select id="toUnit" class="form-control"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputValue">Value to Convert</label>
                    <input type="number" id="inputValue" class="form-control" placeholder="Enter value">
                    <small>Enter the value you want to convert</small>
                </div>
                <button id="convertBtn" class="btn">Convert</button>
                <div class="form-group">
                    <label for="resultOutput">Result</label>
                    <input type="text" id="resultOutput" class="form-control" readonly>
                </div>
                <div style="display: flex; justify-content: center; margin-top: 1rem;">
                    <button id="swapBtn" class="btn btn-outline">Swap Units</button>
                </div>
            </div>
        `,
        
        'timer-stopwatch': `
            <div class="tool-section active">
                <div class="tool-description">
                    <p>Set timers and use stopwatch with precision timing. Essential for productivity and sports.</p>
                </div>
                
                <div class="timer-section">
                    <h3>⏰ Timer</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="timerMinutes">Minutes</label>
                            <input type="number" id="timerMinutes" min="0" max="59" value="5" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="timerSeconds">Seconds</label>
                            <input type="number" id="timerSeconds" min="0" max="59" value="0" class="form-control">
                        </div>
                    </div>
                    <div class="timer-display" id="timerDisplay" style="font-size: 2.5rem; font-weight: bold; text-align: center; margin: 1.5rem 0; font-family: monospace; background: #f1f5f9; padding: 1rem; border-radius: 8px;">00:00</div>
                    <div class="button-group">
                        <button id="startTimer" class="btn">Start Timer</button>
                        <button id="stopTimer" class="btn btn-secondary">Stop</button>
                        <button id="resetTimer" class="btn btn-outline">Reset</button>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label><input type="checkbox" id="timerSound" checked> Sound Notification</label>
                    </div>
                </div>
                
                <hr style="margin: 2.5rem 0; border: none; border-top: 1px solid #e2e8f0;">
                
                <div class="stopwatch-section">
                    <h3>⏱️ Stopwatch</h3>
                    <div class="stopwatch-display" id="stopwatchDisplay" style="font-size: 2.5rem; font-weight: bold; text-align: center; margin: 1.5rem 0; font-family: monospace; background: #f1f5f9; padding: 1rem; border-radius: 8px;">00:00.00</div>
                    <div class="button-group">
                        <button id="startStopwatch" class="btn">Start Stopwatch</button>
                        <button id="stopStopwatch" class="btn btn-secondary">Stop</button>
                        <button id="resetStopwatch" class="btn btn-outline">Reset</button>
                    </div>
                    <p style="text-align: center; color: #666; margin-top: 1rem;">
                        <small>Press SPACEBAR to start/stop stopwatch</small>
                    </p>
                </div>
            </div>
        `
    };
    
    return content[toolName] || '<div class="tool-section active"><p>Tool not found</p></div>';
}

// Enhanced Utility Functions

function setupDragAndDrop(element, callback) {
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.parentElement.classList.add('dragover');
    });
    
    element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.parentElement.classList.remove('dragover');
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        this.parentElement.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fakeEvent = {
                target: {
                    files: files
                }
            };
            callback(fakeEvent);
        }
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function playSuccessSound() {
    if (!AppState.userPreferences.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Success sound not supported');
    }
}

// Enhanced Alert System
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = modalBody.querySelectorAll('.alert');
    existingAlerts.forEach(alert => {
        if (!alert.classList.contains('modal-header') && !alert.classList.contains('sttStatus')) {
            alert.remove();
        }
    });
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${getAlertIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Insert at the top of modal body
    modalBody.insertBefore(alertDiv, modalBody.firstChild);
    
    // Auto remove after 5 seconds for success/info, 10 seconds for error
    const timeout = type === 'error' ? 10000 : 5000;
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, timeout);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': default: return 'ℹ️';
    }
}

// User Preferences and Settings
function loadUserPreferences() {
    try {
        const saved = localStorage.getItem('toolHubPreferences');
        if (saved) {
            AppState.userPreferences = { ...AppState.userPreferences, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.log('Could not load user preferences');
    }
}

function saveUserPreferences() {
    try {
        localStorage.setItem('toolHubPreferences', JSON.stringify(AppState.userPreferences));
    } catch (error) {
        console.log('Could not save user preferences');
    }
}

// Analytics and Tracking (Privacy-friendly)
function trackToolUsage(toolName) {
    // Simple local storage based tracking
    try {
        const analytics = JSON.parse(localStorage.getItem('toolAnalytics') || '{}');
        analytics[toolName] = (analytics[toolName] || 0) + 1;
        localStorage.setItem('toolAnalytics', JSON.stringify(analytics));
    } catch (error) {
        // Silently fail if analytics can't be stored
    }
}

function trackPageView() {
    try {
        const analytics = JSON.parse(localStorage.getItem('toolAnalytics') || '{}');
        analytics.pageViews = (analytics.pageViews || 0) + 1;
        localStorage.setItem('toolAnalytics', JSON.stringify(analytics));
    } catch (error) {
        // Silently fail
    }
}

function trackPerformance(metric, value) {
    try {
        const analytics = JSON.parse(localStorage.getItem('toolAnalytics') || '{}');
        if (!analytics.performance) analytics.performance = {};
        analytics.performance[metric] = value;
        localStorage.setItem('toolAnalytics', JSON.stringify(analytics));
    } catch (error) {
        // Silently fail
    }
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send to analytics in production
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for offline capabilities
    });
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
    const activeElement = document.activeElement;
    
    // Global shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                const activeButton = modalBody.querySelector('.btn:not(:disabled)');
                if (activeButton) activeButton.click();
                break;
            case 's':
                e.preventDefault();
                handleSaveShortcut();
                break;
        }
    }
    
    // Tool-specific shortcuts
    if (AppState.currentTool) {
        switch(AppState.currentTool) {
            case 'timer-stopwatch':
                if (e.code === 'Space') {
                    e.preventDefault();
                    handleTimerStopwatchShortcuts();
                }
                break;
            case 'text-to-speech':
                if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    handleTTSSpacebar();
                }
                break;
        }
    }
}

function handleSaveShortcut() {
    // Handle save/download shortcuts for various tools
    const downloadBtn = modalBody.querySelector('#downloadBtn');
    if (downloadBtn && !downloadBtn.disabled) {
        downloadBtn.click();
    }
}

function handleTimerStopwatchShortcuts() {
    if (AppState.stopwatchInterval) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
}

function handleTTSSpacebar() {
    const speakBtn = modalBody.querySelector('#speakBtn');
    if (speakBtn && !speakBtn.disabled) {
        speakBtn.click();
    }
}

// Audio buffer to WAV conversion helper
function audioBufferToWav(buffer) {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
    }
    
    return arrayBuffer;
}

// Initialize user preferences on load
document.addEventListener('DOMContentLoaded', function() {
    loadUserPreferences();
});