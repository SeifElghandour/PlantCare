import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "plant_model.keras")
TFLITE_PATH = os.path.join(BASE_DIR, "plant_model.tflite")

print(f"Loading model from: {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

print("Converting model to TensorFlow Lite format...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Enable optimizations for smaller size and faster inference
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]

tflite_model = converter.convert()

print(f"Saving TFLite model to: {TFLITE_PATH}")
with open(TFLITE_PATH, 'wb') as f:
    f.write(tflite_model)

print(f"Conversion complete!")
print(f"Original model size: {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} MB")
print(f"TFLite model size: {os.path.getsize(TFLITE_PATH) / (1024*1024):.2f} MB")
print(f"Size reduction: {(1 - os.path.getsize(TFLITE_PATH) / os.path.getsize(MODEL_PATH)) * 100:.1f}%")
