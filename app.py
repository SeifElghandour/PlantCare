import io
import os
import gc

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import tflite_runtime.interpreter as tflite

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "http://localhost:8080",
                "http://127.0.0.1:8080",
                "https://plant-care-gold.vercel.app",
                "https://plant-care-tan.vercel.app",
                "https://plant-cure-tan.vercel.app",
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_CANDIDATES = [
    os.path.join(BASE_DIR, "plant_model.tflite"),
    os.path.join(BASE_DIR, "plant_model.keras"),
    os.path.join(BASE_DIR, "plant_model.h5"),
]

interpreter = None
input_details = None
output_details = None

for model_path in MODEL_CANDIDATES:
    if not os.path.exists(model_path):
        print(f"Model file not found: {model_path}")
        continue
    
    try:
        if model_path.endswith('.tflite'):
            interpreter = tflite.Interpreter(model_path=model_path)
            interpreter.allocate_tensors()
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()
            print(f"TFLite model loaded successfully from {model_path}")
            print("=" * 50)
            print("MODEL DETAILS:")
            print(f"Input shape: {input_details[0]['shape']}")
            print(f"Input dtype: {input_details[0]['dtype']}")
            print(f"Output shape: {output_details[0]['shape']}")
            print(f"Output dtype: {output_details[0]['dtype']}")
            print("=" * 50)
            break
        else:
            print(f"Skipping non-TFLite model: {model_path}")
            print("Please convert to TFLite using: python convert_to_tflite.py")
    except Exception as exc:
        print(f"Failed to load {model_path}: {exc}")
        import traceback
        traceback.print_exc()

if interpreter is None:
    print("=" * 50)
    print("CRITICAL ERROR: No AI model loaded!")
    print("Available model paths checked:")
    for model_path in MODEL_CANDIDATES:
        print(f"  - {model_path} (exists: {os.path.exists(model_path)})")
    print("=" * 50)
    print("To convert plant_model.keras to TFLite, run: python convert_to_tflite.py")
    print("=" * 50)
    raise RuntimeError("Failed to load AI model. Check the error logs above for details.")

CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

MOCK_PREDICTION = {
    "predicted_class": "Tomato___Early_blight",
    "confidence": 87.5,
}


def prepare_image(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(target_size, Image.LANCZOS)
    img_array = np.array(img).astype("float32") / 255.0
    return np.expand_dims(img_array, axis=0)


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
        }
    )


@app.route("/test-isolation", methods=["GET"])
def test_isolation():
    """
    ISOLATION TEST: Uses a synthetic image to verify if model actually processes input.
    If this returns the same prediction as real images, the model is corrupted/hardcoded.
    """
    if model is None:
        return jsonify({"error": "Model not loaded - check server logs for loading error"}), 500

    try:
        # Create a synthetic image: solid green (224x224 RGB)
        # This should NOT be predicted as "Tomato Early Blight" if model works correctly
        synthetic_image = np.zeros((224, 224, 3), dtype=np.uint8)
        synthetic_image[:, :, 1] = 255  # Pure green channel
        
        # Convert to bytes
        img = Image.fromarray(synthetic_image)
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Process and predict
        processed_image = prepare_image(img_bytes.read())
        print("[ISOLATION TEST] Synthetic green image loaded")
        print(f"[ISOLATION TEST] Input shape: {processed_image.shape}, mean: {processed_image.mean():.3f}")
        
        # TFLite inference
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        raw_predictions = interpreter.get_tensor(output_details[0]['index'])
        
        # Manual softmax
        exp_preds = np.exp(raw_predictions[0] - np.max(raw_predictions[0]))
        probabilities = exp_preds / np.sum(exp_preds)
        
        class_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[class_idx]) * 100
        predicted_class = CLASSES[class_idx]
        
        print("[ISOLATION TEST] Prediction:", predicted_class, f"({confidence:.2f}%)")
        print("[ISOLATION TEST] Top 3 classes:", np.argsort(probabilities)[-3:][::-1])
        
        # Clean up
        del processed_image
        del raw_predictions
        del probabilities
        gc.collect()
        
        return jsonify({
            "test_type": "synthetic_green_image",
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "top_3_indices": np.argsort(probabilities)[-3:][::-1].tolist(),
            "top_3_probabilities": sorted(probabilities)[-3:][::-1].tolist(),
            "note": "If this is 'Tomato___Early_blight', model is likely corrupted/hardcoded"
        })
    except Exception as exc:
        print(f"[ISOLATION TEST] Error: {exc}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded. Use form field name 'image'."}), 400

    file = request.files["image"]
    if not file or file.filename == "":
        return jsonify({"error": "Empty image upload."}), 400

    try:
        image_bytes = file.read()
        if not image_bytes:
            return jsonify({"error": "Uploaded image is empty."}), 400

        if interpreter is None:
            print("ERROR: Model not loaded - server startup failed")
            return jsonify({"error": "AI model not loaded. Check server logs for loading error details."}), 500

        processed_image = prepare_image(image_bytes)
        print(f"Input tensor shape: {processed_image.shape}, dtype: {processed_image.dtype}, min: {processed_image.min():.3f}, max: {processed_image.max():.3f}")
        
        # TFLite inference
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        raw_predictions = interpreter.get_tensor(output_details[0]['index'])
        
        print(f"Raw predictions shape: {raw_predictions.shape}, raw values: {raw_predictions[0][:5]}")
        
        # Apply softmax manually since TFLite doesn't include it by default
        exp_preds = np.exp(raw_predictions[0] - np.max(raw_predictions[0]))
        probabilities = exp_preds / np.sum(exp_preds)
        
        print(f"Softmax probabilities - min: {probabilities.min():.6f}, max: {probabilities.max():.6f}")

        class_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[class_idx]) * 100
        predicted_class = CLASSES[class_idx]

        print("-" * 30)
        print(f"Predicted: {predicted_class} ({confidence:.2f}%)")
        print(f"Top 3 indices: {np.argsort(probabilities)[-3:][::-1]}")
        print(f"Top 3 probs: {sorted(probabilities)[-3:][::-1]}")
        print("-" * 30)

        # Clean up tensors to free memory
        del processed_image
        del raw_predictions
        del probabilities
        gc.collect()

        return jsonify(
            {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 2),
                "index": class_idx,
            }
        )
    except Exception as exc:
        print(f"Prediction error: {exc}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
