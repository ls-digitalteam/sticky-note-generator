# CSV to Image Converter

This web application allows you to upload a CSV file containing messages and generates beautiful sticky note images with those messages. The application runs entirely in your browser - no server required!

## Features

### Core Functionality
- **Pure JavaScript/HTML solution** - no server needed, all processing happens locally
- **Drag-and-drop CSV file upload** - simply drag your CSV file onto the upload area
- **Real-time image preview** - see your generated images instantly
- **Bulk download** - download all images as a single zip file
- **Individual downloads** - download images one at a time with custom filenames

### Image Customization
- **Font selection** - Choose from 8 handwriting-style fonts
- **Font size control** - Adjust max font size with live preview
- **Text color picker** - Customize text color for each image
- **Rotation control** - Rotate text from -45° to 45°
- **Line height adjustment** - Fine-tune text spacing
- **Width control** - Adjust text wrapping width
- **Regenerate backgrounds** - Get a new random colorful sticky note background

### User Experience
- **Dark mode** - Toggle between light and dark themes (preference saved)
- **Loading indicators** - Visual feedback during image generation
- **Progress bar** - For large CSV files, see generation progress
- **Debounced controls** - Smooth performance with real-time slider adjustments
- **Keyboard shortcuts** - Speed up your workflow
  - `Ctrl/Cmd + D` - Download all images
  - `Ctrl/Cmd + R` - Regenerate all images
- **Mobile responsive** - Works great on tablets and phones
- **Accessibility** - Full ARIA labels and keyboard navigation

## Usage

1. Open `index.html` in your web browser
2. Prepare a CSV file with a column named "Message" (case-insensitive)
3. Optionally include a "First Name" column for better file naming
4. Upload the CSV file by clicking or dragging it onto the upload area
5. Customize each image using the controls
6. Download individually or all at once

## CSV Format

Your CSV file should have at least a "Message" column. You can optionally include "First Name" for better file naming:

```csv
Message,First Name
"Happy Birthday! Hope you have a wonderful day!",John
"Thank you for all your help!",Sarah
"Congratulations on your achievement!",Michael
```

The parser handles commas within quoted messages correctly, so feel free to use punctuation!

## Customization Options

For each generated image, you can adjust:
- **Max Font Size** (60-200): Maximum size for short text
- **Line Height** (1.0-2.0): Spacing between lines
- **Width** (100-500): Text wrapping width
- **Rotation** (-45° to 45°): Angle of the text
- **Text Color**: Any color via color picker
- **Font**: Choose from 8 handwriting-style fonts

## Technical Details

- Generated images are in PNG format with full transparency support
- Images are rendered using HTML5 Canvas API
- All processing happens client-side - no data leaves your browser
- Font rendering ensures proper loading before generation
- Efficient memory management with proper cleanup

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- FileReader API
- ES6+ JavaScript
- CSS Grid

## Customization

To use your own background images:
1. Replace images in the `images/` directory
2. Update the `sampleImages` array in `script.js`
3. Ensure images are the same dimensions for consistent results 