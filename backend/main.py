import os
import pickle
import time

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_DIR = os.path.join(BASE_DIR, "..", "checkpoints")
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset")

MAX_LEN = 300

app = FastAPI(title="Fake News Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
tokenizer = None


def load_model():
    global model, tokenizer

    model_path = os.path.join(CHECKPOINT_DIR, "fake_news_model.pkl")
    tokenizer_path = os.path.join(CHECKPOINT_DIR, "tokenizer.pkl")

    if not os.path.exists(tokenizer_path):
        from tokenizer_setup import build_tokenizer
        tokenizer = build_tokenizer()
    else:
        with open(tokenizer_path, "rb") as f:
            tokenizer = pickle.load(f)

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    print("Model and tokenizer loaded successfully.")


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
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    start_time = time.time()

    sequences = tokenizer.texts_to_sequences([request.text])
    padded = pad_sequences(sequences, maxlen=MAX_LEN, padding="post", truncating="post")

    prediction = model.predict(padded, verbose=0)[0][0]

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
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    layers = []
    for layer in model.layers:
        layers.append({
            "name": layer.name,
            "type": layer.__class__.__name__,
            "output_shape": str(layer.output_shape) if hasattr(layer, "output_shape") else "N/A",
            "params": layer.count_params(),
        })

    return ModelInfoResponse(
        model_type="Sequential LSTM",
        total_params=model.count_params(),
        trainable_params=sum(
            tf.keras.backend.count_params(w) for w in model.trainable_weights
        ),
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
        "model_loaded": model is not None,
        "tokenizer_loaded": tokenizer is not None,
    }
