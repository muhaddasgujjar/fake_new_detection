import os
import json
import time

import numpy as np
import pandas as pd
import onnxruntime as ort
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_DIR = os.path.join(BASE_DIR, "..", "checkpoints")
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset")

MAX_LEN = 300

app = FastAPI(title="Fake News Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = None
input_name = None
word_index = None
num_words = None


class SimpleTokenizer:
    def __init__(self, word_index, num_words):
        self.word_index = word_index
        self.num_words = num_words

    def texts_to_sequences(self, texts):
        sequences = []
        for text in texts:
            words = text.lower().split()
            seq = []
            for word in words:
                idx = self.word_index.get(word)
                if idx and (self.num_words is None or idx < self.num_words):
                    seq.append(idx)
            sequences.append(seq)
        return sequences


tokenizer = None


def pad_sequences(sequences, maxlen, padding="post", truncating="post"):
    result = []
    for seq in sequences:
        if len(seq) > maxlen:
            seq = seq[:maxlen] if truncating == "post" else seq[-maxlen:]
        elif len(seq) < maxlen:
            pad_len = maxlen - len(seq)
            seq = seq + [0] * pad_len if padding == "post" else [0] * pad_len + seq
        result.append(seq)
    return np.array(result, dtype=np.float32)


def load_model():
    global session, input_name, tokenizer

    onnx_path = os.path.join(CHECKPOINT_DIR, "fake_news_model.onnx")
    tokenizer_path = os.path.join(CHECKPOINT_DIR, "tokenizer.json")

    with open(tokenizer_path, "r") as f:
        tok_data = json.load(f)
    tokenizer = SimpleTokenizer(tok_data["word_index"], tok_data["num_words"])

    session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    print("ONNX model and tokenizer loaded successfully.")


@app.on_event("startup")
async def startup():
    load_model()


class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=10, description="News article text to classify")


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    fake_probability: float
    real_probability: float
    inference_time_ms: float
    text_length: int
    word_count: int


class ModelInfoResponse(BaseModel):
    model_type: str
    total_params: int
    trainable_params: int
    layers: list
    input_shape: str
    max_sequence_length: int
    vocab_size: int


class DatasetStatsResponse(BaseModel):
    total_samples: int
    fake_count: int
    real_count: int
    avg_text_length: float
    max_text_length: int
    min_text_length: int


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if session is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    start_time = time.time()

    sequences = tokenizer.texts_to_sequences([request.text])
    padded = pad_sequences(sequences, maxlen=MAX_LEN, padding="post", truncating="post")

    result = session.run(None, {input_name: padded})
    prediction = result[0][0][0]

    inference_time = (time.time() - start_time) * 1000

    fake_prob = float(prediction)
    real_prob = 1.0 - fake_prob
    label = "Fake" if fake_prob >= 0.5 else "Real"
    confidence = fake_prob if label == "Fake" else real_prob

    return PredictionResponse(
        prediction=label,
        confidence=round(confidence, 4),
        fake_probability=round(fake_prob, 4),
        real_probability=round(real_prob, 4),
        inference_time_ms=round(inference_time, 2),
        text_length=len(request.text),
        word_count=len(request.text.split()),
    )


@app.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    if session is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    layers = [
        {"name": "embedding", "type": "Embedding", "output_shape": "(None, 300, 128)", "params": 6400000},
        {"name": "bidirectional", "type": "Bidirectional LSTM", "output_shape": "(None, 300, 128)", "params": 98816},
        {"name": "dropout", "type": "Dropout", "output_shape": "(None, 300, 128)", "params": 0},
        {"name": "lstm_1", "type": "LSTM", "output_shape": "(None, 32)", "params": 20608},
        {"name": "dense", "type": "Dense", "output_shape": "(None, 64)", "params": 2112},
        {"name": "dropout_1", "type": "Dropout", "output_shape": "(None, 64)", "params": 0},
        {"name": "dense_1", "type": "Dense (Sigmoid)", "output_shape": "(None, 1)", "params": 65},
    ]

    return ModelInfoResponse(
        model_type="Sequential Bidirectional LSTM",
        total_params=6521601,
        trainable_params=6521601,
        layers=layers,
        input_shape="(None, 300)",
        max_sequence_length=MAX_LEN,
        vocab_size=50000,
    )


@app.get("/dataset-stats", response_model=DatasetStatsResponse)
async def dataset_stats():
    dataset_path = os.path.join(DATASET_DIR, "fake_and_real_news.csv")
    df = pd.read_csv(dataset_path)

    text_lengths = df["Text"].str.len()

    return DatasetStatsResponse(
        total_samples=len(df),
        fake_count=int((df["label"] == "Fake").sum()),
        real_count=int((df["label"] == "Real").sum()),
        avg_text_length=round(text_lengths.mean(), 1),
        max_text_length=int(text_lengths.max()),
        min_text_length=int(text_lengths.min()),
    )


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": session is not None,
        "tokenizer_loaded": tokenizer is not None,
    }
