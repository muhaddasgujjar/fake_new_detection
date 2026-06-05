"""Convert the Keras LSTM model to ONNX format for lightweight deployment."""
import os
import sys
import pickle
import json
import tempfile

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import numpy as np
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_DIR = os.path.join(BASE_DIR, "..", "checkpoints")

model_path = os.path.join(CHECKPOINT_DIR, "fake_news_model.pkl")
tokenizer_path = os.path.join(CHECKPOINT_DIR, "tokenizer.pkl")
onnx_output = os.path.join(CHECKPOINT_DIR, "fake_news_model.onnx")
tokenizer_json_output = os.path.join(CHECKPOINT_DIR, "tokenizer.json")

# Load and save as SavedModel format first
print("Loading Keras model...")
with open(model_path, "rb") as f:
    model = pickle.load(f)

model.summary()

saved_model_dir = tempfile.mkdtemp()
print(f"\nExporting to SavedModel at {saved_model_dir}...")
model.export(saved_model_dir)

# Convert SavedModel to ONNX using command line (most reliable method)
print("\nConverting SavedModel to ONNX...")
import subprocess
result = subprocess.run(
    [sys.executable, "-m", "tf2onnx.convert",
     "--saved-model", saved_model_dir,
     "--output", onnx_output,
     "--opset", "13"],
    capture_output=True, text=True
)
if result.returncode != 0:
    print("STDERR:", result.stderr)
    print("STDOUT:", result.stdout)
    sys.exit(1)

size_mb = os.path.getsize(onnx_output) / (1024 * 1024)
print(f"Saved ONNX model: {onnx_output} ({size_mb:.1f} MB)")

# Convert tokenizer to JSON
print("\nConverting tokenizer to JSON...")
with open(tokenizer_path, "rb") as f:
    tokenizer = pickle.load(f)

tokenizer_data = {
    "word_index": tokenizer.word_index,
    "num_words": tokenizer.num_words,
    "oov_token": tokenizer.oov_token,
}

with open(tokenizer_json_output, "w") as f:
    json.dump(tokenizer_data, f)

size_mb = os.path.getsize(tokenizer_json_output) / (1024 * 1024)
print(f"Saved tokenizer JSON: {tokenizer_json_output} ({size_mb:.1f} MB)")

# Verify ONNX model works
print("\nVerifying ONNX inference...")
import onnxruntime as ort
session = ort.InferenceSession(onnx_output)
input_name = session.get_inputs()[0].name
test_input = np.zeros((1, 300), dtype=np.float32)
result = session.run(None, {input_name: test_input})
print(f"Test inference output: {result[0][0][0]:.6f}")
print("\nDone! Ready for deployment with onnxruntime.")
