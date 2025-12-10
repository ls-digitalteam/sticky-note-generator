// Utility: Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Helper to build options object (DRY principle)
function getOptionsFromControls(container) {
    const fontSizeGroup = container.querySelector('.control-group:has(.max-font-size)');
    const lineHeightGroup = container.querySelector('.control-group:has(.line-height)');
    const widthGroup = container.querySelector('.control-group:has(.max-width)');
    const rotationGroup = container.querySelector('.control-group:has(.rotation)');
    const fontSelectGroup = container.querySelector('.control-group:has(.font-select)');
    const colorPicker = container.querySelector('.text-color');
    
    return {
        maxFontSize: parseInt(fontSizeGroup.querySelector('.max-font-size').value),
        minFontSize: parseInt(fontSizeGroup.querySelector('.min-font-size').value),
        maxWidth: parseInt(widthGroup.querySelector('.max-width').value),
        rotation: parseInt(rotationGroup.querySelector('.rotation').value),
        lineHeight: parseFloat(lineHeightGroup.querySelector('.line-height').value),
        fontFamily: fontSelectGroup.querySelector('.font-select').value,
        textColor: colorPicker ? colorPicker.value : '#000000',
        firstName: container.dataset.firstName
    };
}

// Utility: Better CSV parsing that handles quoted values with commas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-mode', currentTheme === 'dark');
updateThemeIcon();

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Local images from the images directory
const sampleImages = [
    'images/orange.png',
    'images/green.png',
    'images/blue.png',
    'images/pink.png'
];

// Available fonts with their display names
const availableFonts = [
    { name: 'Just Another Hand', display: 'Just Another Hand' },
    { name: 'Indie Flower', display: 'Indie Flower' },
    { name: 'Architects Daughter', display: 'Architects Daughter' },
    { name: 'Kalam', display: 'Kalam' },
    { name: 'Caveat', display: 'Caveat' },
    { name: 'Shadows Into Light', display: 'Shadows Into Light' },
    { name: 'Patrick Hand', display: 'Patrick Hand' },
    { name: 'Gloria Hallelujah', display: 'Gloria Hallelujah' }
];

function getRandomImage() {
    return sampleImages[Math.floor(Math.random() * sampleImages.length)];
}

function createImageWithText(imageUrl, text, options = {}) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Calculate font size based on text length and custom size
            const maxFontSize = options.maxFontSize || 150;
            const minFontSize = options.minFontSize || 60;
            const maxChars = options.maxChars || 40;
            
            const fontSize = Math.max(
                minFontSize,
                maxFontSize - ((text.length / maxChars) * (maxFontSize - minFontSize))
            );
            
            // Configure text with the selected font
            const selectedFont = options.fontFamily || 'Just Another Hand';
            ctx.font = `${fontSize}px "${selectedFont}"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Function to wrap text
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = ctx.measureText(currentLine + " " + word).width;
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
                return lines;
            }

            // Wrap text to max width
            const maxWidth = (options.maxWidth || 300) * (fontSize / 60);
            const wrappedText = wrapText(text, maxWidth);
            
            // Calculate vertical positioning
            const lineHeight = fontSize * (options.lineHeight || 1.2);
            const totalHeight = wrappedText.length * lineHeight;
            const verticalPadding = (canvas.height - totalHeight) / 2;
            
            // Save the current context state
            ctx.save();
            
            // Apply rotation if specified
            if (options.rotation) {
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(options.rotation * Math.PI / 180);
                ctx.translate(-canvas.width/2, -canvas.height/2);
            }
            
            // Draw each line of text with custom color
            const textColor = options.textColor || '#000000';
            wrappedText.forEach((line, index) => {
                ctx.fillStyle = textColor;
                const y = verticalPadding + (index * lineHeight) + (lineHeight / 2);
                ctx.fillText(line, canvas.width/2, y);
            });
            
            // Restore the context state
            ctx.restore();
            
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (error) => {
            console.error('Error loading image:', error);
            reject(error);
        };
        img.src = imageUrl;
    });
}

// Add download all functionality
const downloadAllBtn = document.getElementById('downloadAllBtn');
let generatedImages = new Map(); // Store generated images with their filenames

// Update image function with loading state
const updateImage = async (container, imageUrl, message, options) => {
    const img = container.querySelector('img');
    container.classList.add('loading');
    
    try {
        const imageData = await createImageWithText(imageUrl, message, options);
        img.src = imageData;
        // Show download all button if we have images
        downloadAllBtn.style.display = 'block';
    } finally {
        container.classList.remove('loading');
    }
};

// Add a function to store all current images
const storeCurrentImages = () => {
    generatedImages.clear();
    const previewItems = document.querySelectorAll('.preview-item');
    previewItems.forEach(container => {
        const img = container.querySelector('img');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const firstName = container.dataset.firstName || 'image';
        const filename = `${firstName}_${timestamp}.png`;
        generatedImages.set(filename, img.src);
    });
};

// Modify the download all button click handler
downloadAllBtn.addEventListener('click', async () => {
    // Store current versions of all images
    storeCurrentImages();
    
    if (generatedImages.size === 0) return;

    downloadAllBtn.disabled = true;
    downloadAllBtn.textContent = 'Creating zip file...';

    try {
        const zip = new JSZip();
        
        // Add each image to the zip
        for (const [filename, imageData] of generatedImages) {
            // Convert base64 to blob
            const response = await fetch(imageData);
            const blob = await response.blob();
            zip.file(filename, blob);
        }

        // Generate zip file
        const content = await zip.generateAsync({type: 'blob'});
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'all_images.zip';
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error creating zip file:', error);
        alert('Error creating zip file. Please try again.');
    } finally {
        downloadAllBtn.disabled = false;
        downloadAllBtn.textContent = 'Download All Images';
    }
});

// Process CSV file helper
async function processCSVFile(file) {
    // Clear previous images
    generatedImages.clear();
    downloadAllBtn.style.display = 'none';

    const reader = new FileReader();
    reader.onload = async (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        
        // Use improved CSV parsing
        const headers = parseCSVLine(lines[0]);
        
        const messageIndex = headers.findIndex(h => h.toLowerCase() === 'message');
        const firstNameIndex = headers.findIndex(h => h.toLowerCase() === 'first name');
        
        if (messageIndex === -1) {
            alert('CSV file must contain a "Message" column (case-insensitive). Found headers: ' + headers.join(', '));
            return;
        }

        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        
        // Show progress for large files
        const totalRows = lines.length - 1;
        if (totalRows > 10) {
            const progressDiv = document.createElement('div');
            progressDiv.className = 'progress-indicator';
            progressDiv.innerHTML = '<div class="progress-bar"><div class="progress-fill"></div></div><div class="progress-text">Processing images...</div>';
            preview.appendChild(progressDiv);
        }

        for (let i = 1; i < lines.length; i++) {
            // Use improved CSV parsing
            const values = parseCSVLine(lines[i]);
            
            const message = values[messageIndex];
            if (!message) continue;
            
            const firstName = firstNameIndex !== -1 ? values[firstNameIndex] : 'image';
            
            // Update progress bar if it exists
            const progressFill = preview.querySelector('.progress-fill');
            if (progressFill) {
                const progress = ((i) / totalRows) * 100;
                progressFill.style.width = `${progress}%`;
            }
            
            try {
                let imageUrl = getRandomImage();
                
                // Create container for image and controls
                const container = document.createElement('div');
                container.className = 'preview-item';
                container.dataset.firstName = firstName;  // Store firstName in dataset
                
                // Create image element
                const img = document.createElement('img');
                container.appendChild(img);
                
                // Create controls
                const controls = document.createElement('div');
                controls.className = 'controls';
                
                // Font size controls with value display
                const fontSizeGroup = document.createElement('div');
                fontSizeGroup.className = 'control-group';
                fontSizeGroup.innerHTML = `
                    <label>Max Size: <span class="value">150</span></label>
                    <input type="range" min="60" max="200" value="150" class="max-font-size" aria-label="Maximum font size">
                    <label>Min Size: <span class="value">60</span></label>
                    <input type="range" min="20" max="100" value="60" class="min-font-size" aria-label="Minimum font size">
                `;
                
                // Line height control with value display
                const lineHeightGroup = document.createElement('div');
                lineHeightGroup.className = 'control-group';
                lineHeightGroup.innerHTML = `
                    <label>Line Height: <span class="value">1.2</span></label>
                    <input type="range" min="1" max="2" step="0.1" value="1.2" class="line-height" aria-label="Line height">
                `;
                
                // Width control with value display
                const widthGroup = document.createElement('div');
                widthGroup.className = 'control-group';
                widthGroup.innerHTML = `
                    <label>Width: <span class="value">300</span></label>
                    <input type="range" min="100" max="500" value="300" class="max-width" aria-label="Text width">
                `;
                
                // Rotation control with value display
                const rotationGroup = document.createElement('div');
                rotationGroup.className = 'control-group';
                rotationGroup.innerHTML = `
                    <label>Rotation: <span class="value">0</span>°</label>
                    <input type="range" min="-45" max="45" value="0" class="rotation" aria-label="Text rotation">
                `;
                
                // Text color control
                const colorGroup = document.createElement('div');
                colorGroup.className = 'control-group';
                colorGroup.innerHTML = `
                    <label for="color-${i}">Text Color:</label>
                    <input type="color" id="color-${i}" value="#000000" class="text-color" aria-label="Text color">
                `;
                
                // Font selection
                const fontSelectGroup = document.createElement('div');
                fontSelectGroup.className = 'control-group';
                fontSelectGroup.innerHTML = `
                    <label for="font-${i}">Font:</label>
                    <select id="font-${i}" class="font-select" aria-label="Font family">
                        ${availableFonts.map(font => `<option value="${font.name}" ${font.name === 'Just Another Hand' ? 'selected' : ''}>${font.display}</option>`).join('')}
                    </select>
                `;
                
                // Regenerate button
                const regenerateBtn = document.createElement('button');
                regenerateBtn.className = 'regenerate-btn';
                regenerateBtn.textContent = 'Regenerate';
                
                // Add controls to container
                controls.appendChild(fontSizeGroup);
                controls.appendChild(lineHeightGroup);
                controls.appendChild(widthGroup);
                controls.appendChild(rotationGroup);
                controls.appendChild(colorGroup);
                controls.appendChild(fontSelectGroup);
                controls.appendChild(regenerateBtn);
                
                // Add controls to container
                container.appendChild(controls);
                
                // Helper to update value displays
                function updateValueDisplay(input) {
                    const label = input.parentElement.querySelector('.value');
                    if (label) {
                        label.textContent = input.value;
                    }
                }
                
                // Add download button
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download';
                downloadBtn.className = 'submit-btn';
                downloadBtn.style.marginTop = '10px';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = img.src;
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const filename = `${firstName}_${timestamp}.png`;
                    link.download = filename;
                    link.click();
                };
                
                container.appendChild(downloadBtn);
                preview.appendChild(container);
                
                // Initial image generation
                await updateImage(container, imageUrl, message, getOptionsFromControls(container));
                
                // Create debounced update function for sliders (300ms delay)
                const debouncedUpdate = debounce(() => {
                    updateImage(container, imageUrl, message, getOptionsFromControls(container));
                }, 300);
                
                // Add event listeners to range inputs with debouncing
                controls.querySelectorAll('input[type="range"]').forEach(input => {
                    input.addEventListener('input', () => {
                        updateValueDisplay(input);
                        debouncedUpdate();
                    });
                });
                
                // Add event listener for color picker (instant update)
                colorGroup.querySelector('.text-color').addEventListener('change', () => {
                    updateImage(container, imageUrl, message, getOptionsFromControls(container));
                });
                
                // Add event listener for font select (instant update)
                fontSelectGroup.querySelector('.font-select').addEventListener('change', () => {
                    updateImage(container, imageUrl, message, getOptionsFromControls(container));
                });
                
                // Update regenerate button
                regenerateBtn.addEventListener('click', () => {
                    imageUrl = getRandomImage();
                    updateImage(container, imageUrl, message, getOptionsFromControls(container));
                });
            } catch (error) {
                console.error(`Error processing row ${i}:`, error);
            }
        }
        
        // Remove progress indicator if it exists
        const progressIndicator = preview.querySelector('.progress-indicator');
        if (progressIndicator) {
            progressIndicator.remove();
        }
    };
    reader.readAsText(file);
}

// File upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;
    await processCSVFile(file);
});

// Drag and drop functionality
const uploadForm = document.getElementById('uploadForm');
const fileInput = uploadForm.querySelector('input[type="file"]');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadForm.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadForm.addEventListener(eventName, () => {
        uploadForm.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadForm.addEventListener(eventName, () => {
        uploadForm.classList.remove('drag-over');
    }, false);
});

uploadForm.addEventListener('drop', async (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
        fileInput.files = files;
        await processCSVFile(files[0]);
    }
}, false);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D: Download all images
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (downloadAllBtn.style.display !== 'none') {
            downloadAllBtn.click();
        }
    }
    
    // Ctrl/Cmd + R: Regenerate all images
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        document.querySelectorAll('.regenerate-btn').forEach(btn => btn.click());
    }
});
