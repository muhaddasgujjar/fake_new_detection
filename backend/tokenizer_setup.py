"""One-time script to fit and save the tokenizer from the training dataset."""
import os
import pickle
import pandas as pd
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "fake_and_real_news.csv")
TOKENIZER_PATH = os.path.join(os.path.dirname(__file__), "..", "checkpoints", "tokenizer.pkl")

MAX_WORDS = 50000
MAX_LEN = 300


def build_tokenizer():
    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset shape: {df.shape}")

    print("Fitting tokenizer...")
    tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
    tokenizer.fit_on_texts(df["Text"].values)

    print(f"Vocabulary size: {len(tokenizer.word_index)}")

    with open(TOKENIZER_PATH, "wb") as f:
        pickle.dump(tokenizer, f)

    print(f"Tokenizer saved to {TOKENIZER_PATH}")
    return tokenizer


if __name__ == "__main__":
    build_tokenizer()
