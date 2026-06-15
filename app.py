import os
import io
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

@tf.keras.utils.register_keras_serializable()
class Cast(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(Cast, self).__init__(**kwargs)
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'plant_model.keras')

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={'Cast': Cast},
        compile=False
    )
    print(f"✅ Model loaded successfully (38 Classes Detected)")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", 
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", 
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

def prepare_image(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img).astype('float32')
    
    # Reverting to /255.0 because it gave better results (42% vs 20%)
    img_array /= 255.0 
    return np.expand_dims(img_array, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['image']
        image_bytes = file.read()
        processed_image = prepare_image(image_bytes)
        
        raw_predictions = model.predict(processed_image)
        output = raw_predictions[0]

        # Check if the output is Logits or Probabilities
        # If the sum is not close to 1, we must apply Softmax manually
        if not np.isclose(np.sum(output), 1.0, atol=1e-3):
            print("DEBUG: Output sum is not 1. Applying manual Softmax...")
            output = tf.nn.softmax(output).numpy()

        class_idx = np.argmax(output)
        confidence = float(output[class_idx]) * 100

        print("-" * 30)
        print(f"Top Index: {class_idx} | Confidence: {confidence:.2f}%")
        print(f"Predicted Class: {CLASSES[class_idx]}")
        print("-" * 30)

        # Adjusted Threshold to 30% for debugging during inspection
        if confidence < 30.0:
            return jsonify({
                'disease': "Unknown - Low Confidence",
                'confidence': f"{confidence:.2f}%",
                'index': -1
            })

        return jsonify({
            'disease': CLASSES[class_idx],
            'confidence': f"{confidence:.2f}%",
            'index': int(class_idx)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)