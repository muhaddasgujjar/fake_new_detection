"""Convert the Keras LSTM model to TFLite format for lightweight deployment."""
import os
import pickle
import numpy as np

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_DIR = os.path.join(BASE_DIR, "..", "checkpoints")

model_path = os.path.join(CHECKPOINT_DIR, "fake_news_model.pkl")
output_path = os.path.join(CHECKPOINT_DIR, "fake_news_model.tflite")

print("Loading Keras model from pickle...")
with open(model_path, "rb") as f:
    model = pickle.load(f)

model.summary()

print("\nConverting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.target_spec.supported_ops = [
    tf.lite.OpsSet.TFLITE_BUILTINS,
    tf.lite.OpsSet.SELECT_TF_OPS,
]
tflite_model = converter.convert()

with open(output_path, "wb") as f:
    f.write(tflite_model)

size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"\nSaved TFLite model: {output_path} ({size_mb:.1f} MB)")
print("Done! You can now deploy with tflite-runtime instead of full tensorflow.")
