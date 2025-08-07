# CSV to Image Converter

This web application allows you to upload a CSV file containing messages and generates images with those messages overlaid on random background images. The application runs entirely in your browser - no server required!

## Features

- Pure JavaScript/HTML solution - no server needed
- Drag-and-drop CSV file upload
- Real-time image preview
- Individual image downloads
- Text overlay with shadow for better visibility
- Responsive design

## Usage

1. Open `index.html` in your web browser
2. Prepare a CSV file with a column named "Message" containing the text you want to overlay on images
3. Upload the CSV file through the web interface
4. The application will process each message and create an image with the text overlaid on a random background
5. Images will be displayed below and can be downloaded individually

## CSV Format

Your CSV file should have the following format:
```csv
Message
"Your first message"
"Your second message"
"Your third message"
```

## Notes

- The text will be centered on the images
- Text will have a shadow for better visibility
- Images are generated using random photos from Picsum Photos
- Generated images will be in PNG format
- All processing happens in your browser - no data is sent to any server

## Customization

To use your own background images:
1. Replace the `sampleImages` array in the JavaScript code with your own image URLs
2. Make sure your images are accessible via URL (you can host them on a CDN or image hosting service) 