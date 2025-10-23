from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image, ImageDraw, ImageFont
import qrcode
import io
import base64
import os
import math

app = Flask(__name__)

CM_TO_PIXELS = 118.11

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    elements = data.get('elements', [])
    
    width = int(5.0 * CM_TO_PIXELS)
    padding = 30
    element_spacing = 40
    border_width = 3
    qr_size_cm = 4.0
    
    temp_img = Image.new('RGB', (width, 10000), 'white')
    temp_draw = ImageDraw.Draw(temp_img)
    
    font_normal = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    
    elements_data = []
    max_content_width = width - 2 * padding
    
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
                text_width = bbox[2] - bbox[0]
                
                if len(current_line) == 0 or text_width <= max_content_width:
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
            elements_data.append(('text', lines, font, max_line_width, total_text_height, line_heights))
        
        elif element_type == 'title':
            content = element.get('content', '')
            words = content.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = temp_draw.textbbox((0, 0), test_line, font=font_title)
                text_width = bbox[2] - bbox[0]
                
                if len(current_line) == 0 or text_width <= max_content_width:
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
            elements_data.append(('title', lines, font_title, max_line_width, total_text_height, line_heights))
        
        elif element_type == 'qrcode':
            url = element.get('content', '')
            qr = qrcode.QRCode(version=1, box_size=10, border=2)
            qr.add_data(url)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            qr_img = qr_img.convert('RGB')
            
            target_qr_size = int(qr_size_cm * CM_TO_PIXELS)
            ratio = target_qr_size / qr_img.size[0]
            new_size = (int(qr_img.size[0] * ratio), int(qr_img.size[1] * ratio))
            qr_img = qr_img.resize(new_size, Image.Resampling.LANCZOS)
            
            elements_data.append(('qrcode', qr_img, None, qr_img.size[0], qr_img.size[1], None))
        
        elif element_type == 'image':
            image_data = element.get('content', '')
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            img_bytes = base64.b64decode(image_data)
            uploaded_img = Image.open(io.BytesIO(img_bytes))
            uploaded_img = uploaded_img.convert('RGB')
            
            if uploaded_img.size[0] > max_content_width:
                ratio = max_content_width / uploaded_img.size[0]
                new_size = (int(uploaded_img.size[0] * ratio), int(uploaded_img.size[1] * ratio))
                uploaded_img = uploaded_img.resize(new_size, Image.Resampling.LANCZOS)
            
            elements_data.append(('image', uploaded_img, None, uploaded_img.size[0], uploaded_img.size[1], None))
    
    total_height = padding
    for item in elements_data:
        total_height += item[4] + element_spacing
    total_height = total_height - element_spacing + padding
    
    final_img = Image.new('RGB', (width, total_height), 'white')
    draw = ImageDraw.Draw(final_img)
    
    y_position = padding
    for item in elements_data:
        if item[0] == 'text' or item[0] == 'title':
            y_pos = y_position
            
            for i, line in enumerate(item[1]):
                bbox = draw.textbbox((0, 0), line, font=item[2])
                line_width = bbox[2] - bbox[0]
                x_centered = (width - line_width) // 2
                draw.text((x_centered, y_pos), line, fill='black', font=item[2])
                y_pos += item[5][i] + 5
            
            y_position += item[4] + element_spacing
        
        elif item[0] == 'qrcode' or item[0] == 'image':
            x_center = (width - item[3]) // 2
            final_img.paste(item[1], (x_center, y_position))
            y_position += item[4] + element_spacing
    
    bordered_img = Image.new('RGB', (width, total_height), 'white')
    bordered_draw = ImageDraw.Draw(bordered_img)
    bordered_img.paste(final_img, (0, 0))
    
    corner_radius = 15
    dash_length = 10
    gap_length = 5
    inset = border_width // 2
    
    def draw_dashed_line(draw, x1, y1, x2, y2, dash_len, gap_len, width):
        total_length = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        if total_length == 0:
            return
        
        dx = (x2 - x1) / total_length
        dy = (y2 - y1) / total_length
        
        distance = 0
        while distance < total_length:
            dash_end = min(distance + dash_len, total_length)
            start_x = x1 + dx * distance
            start_y = y1 + dy * distance
            end_x = x1 + dx * dash_end
            end_y = y1 + dy * dash_end
            draw.line([(start_x, start_y), (end_x, end_y)], fill='black', width=width)
            distance += dash_len + gap_len
    
    def draw_dashed_arc(draw, center_x, center_y, radius, start_angle, end_angle, dash_len, gap_len, width):
        arc_length = radius * abs(end_angle - start_angle) * math.pi / 180
        angle_step = 1
        
        distance = 0
        angle = start_angle
        
        while angle < end_angle:
            if distance % (dash_len + gap_len) < dash_len:
                x = center_x + radius * math.cos(angle * math.pi / 180)
                y = center_y + radius * math.sin(angle * math.pi / 180)
                
                next_angle = min(angle + angle_step, end_angle)
                next_x = center_x + radius * math.cos(next_angle * math.pi / 180)
                next_y = center_y + radius * math.sin(next_angle * math.pi / 180)
                
                draw.line([(x, y), (next_x, next_y)], fill='black', width=width)
            
            angle += angle_step
            distance += radius * angle_step * math.pi / 180
    
    draw_dashed_line(bordered_draw, corner_radius + inset, inset, width - corner_radius - inset, inset, dash_length, gap_length, border_width)
    draw_dashed_line(bordered_draw, width - inset, corner_radius + inset, width - inset, total_height - corner_radius - inset, dash_length, gap_length, border_width)
    draw_dashed_line(bordered_draw, width - corner_radius - inset, total_height - inset, corner_radius + inset, total_height - inset, dash_length, gap_length, border_width)
    draw_dashed_line(bordered_draw, inset, total_height - corner_radius - inset, inset, corner_radius + inset, dash_length, gap_length, border_width)
    
    draw_dashed_arc(bordered_draw, corner_radius + inset, corner_radius + inset, corner_radius, 180, 270, dash_length, gap_length, border_width)
    draw_dashed_arc(bordered_draw, width - corner_radius - inset, corner_radius + inset, corner_radius, 270, 360, dash_length, gap_length, border_width)
    draw_dashed_arc(bordered_draw, width - corner_radius - inset, total_height - corner_radius - inset, corner_radius, 0, 90, dash_length, gap_length, border_width)
    draw_dashed_arc(bordered_draw, corner_radius + inset, total_height - corner_radius - inset, corner_radius, 90, 180, dash_length, gap_length, border_width)
    
    img_io = io.BytesIO()
    bordered_img.save(img_io, 'PNG', dpi=(300, 300))
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='generated_image.png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
