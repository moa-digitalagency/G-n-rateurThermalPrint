from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image, ImageDraw, ImageFont
import qrcode
import io
import base64
import os

app = Flask(__name__)

CM_TO_PIXELS = 118.11

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    elements = data.get('elements', [])
    
    height = int(5.8 * CM_TO_PIXELS)
    padding = 30
    element_spacing = 40
    
    temp_img = Image.new('RGB', (10000, height), 'white')
    temp_draw = ImageDraw.Draw(temp_img)
    
    font_normal = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 38)
    
    widths = []
    max_content_height = height - 2 * padding
    
    for element in elements:
        element_type = element.get('type')
        
        if element_type == 'text':
            content = element.get('content', '')
            is_bold = element.get('bold', False)
            font = font_bold if is_bold else font_normal
            
            words = content.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = temp_draw.textbbox((0, 0), test_line, font=font)
                text_height = bbox[3] - bbox[1]
                
                if len(current_line) == 0 or text_height <= max_content_height:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            
            if current_line:
                lines.append(' '.join(current_line))
            
            max_line_width = 0
            total_text_height = 0
            line_heights = []
            
            for line in lines:
                bbox = temp_draw.textbbox((0, 0), line, font=font)
                line_width = bbox[2] - bbox[0]
                line_height = bbox[3] - bbox[1]
                line_heights.append(line_height)
                total_text_height += line_height + 5
                if line_width > max_line_width:
                    max_line_width = line_width
            
            total_text_height -= 5
            widths.append(('text', lines, font, max_line_width, total_text_height, line_heights))
        
        elif element_type == 'title':
            content = element.get('content', '')
            words = content.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = temp_draw.textbbox((0, 0), test_line, font=font_title)
                text_height = bbox[3] - bbox[1]
                
                if len(current_line) == 0 or text_height <= max_content_height:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            
            if current_line:
                lines.append(' '.join(current_line))
            
            max_line_width = 0
            total_text_height = 0
            line_heights = []
            
            for line in lines:
                bbox = temp_draw.textbbox((0, 0), line, font=font_title)
                line_width = bbox[2] - bbox[0]
                line_height = bbox[3] - bbox[1]
                line_heights.append(line_height)
                total_text_height += line_height + 5
                if line_width > max_line_width:
                    max_line_width = line_width
            
            total_text_height -= 5
            widths.append(('title', lines, font_title, max_line_width, total_text_height, line_heights))
        
        elif element_type == 'qrcode':
            url = element.get('content', '')
            qr = qrcode.QRCode(version=1, box_size=6, border=2)
            qr.add_data(url)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            
            if qr_img.size[1] > max_content_height:
                ratio = max_content_height / qr_img.size[1]
                new_size = (int(qr_img.size[0] * ratio), int(qr_img.size[1] * ratio))
                qr_img = qr_img.resize(new_size, Image.Resampling.LANCZOS)
            
            widths.append(('qrcode', qr_img, None, qr_img.size[0], qr_img.size[1], None))
        
        elif element_type == 'image':
            image_data = element.get('content', '')
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            img_bytes = base64.b64decode(image_data)
            uploaded_img = Image.open(io.BytesIO(img_bytes))
            
            if uploaded_img.size[1] > max_content_height:
                ratio = max_content_height / uploaded_img.size[1]
                new_size = (int(uploaded_img.size[0] * ratio), int(uploaded_img.size[1] * ratio))
                uploaded_img = uploaded_img.resize(new_size, Image.Resampling.LANCZOS)
            
            widths.append(('image', uploaded_img, None, uploaded_img.size[0], uploaded_img.size[1], None))
    
    total_width = padding
    for item in widths:
        total_width += item[3] + element_spacing
    total_width = total_width - element_spacing + padding
    
    final_img = Image.new('RGB', (total_width, height), 'white')
    draw = ImageDraw.Draw(final_img)
    
    x_position = padding
    for item in widths:
        if item[0] == 'text' or item[0] == 'title':
            y_start = (height - item[4]) // 2
            y_pos = y_start
            
            for i, line in enumerate(item[1]):
                draw.text((x_position, y_pos), line, fill='black', font=item[2])
                y_pos += item[5][i] + 5
            
            x_position += item[3] + element_spacing
        
        elif item[0] == 'qrcode' or item[0] == 'image':
            y_center = (height - item[4]) // 2
            final_img.paste(item[1], (x_position, y_center))
            x_position += item[3] + element_spacing
    
    img_io = io.BytesIO()
    final_img.save(img_io, 'PNG', dpi=(300, 300))
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='generated_image.png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
