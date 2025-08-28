import pandas as pd
import spacy
import random
import pickle
from nltk import NaiveBayesClassifier, classify
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
CLASSIFIER_DIR = BASE_DIR / "classifier"

CLASSIFIER_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_DIR / "email_data.txt", delimiter="|")
nlp = spacy.load("pt_core_news_sm")

with open(DATA_DIR / "stopwords.txt", "r", encoding="utf-8") as f:
    stopwords = set(line.strip().lower() for line in f if line.strip())

def preprocess(text):
    doc = nlp(text.lower())
    tokens = []
    for token in doc:
        if not token.is_punct:
            token_lemma = token.lemma_.lower()
            if token_lemma not in stopwords:
                tokens.append(token_lemma)
    return tokens

def get_features(tokens):
    return {token: True for token in tokens}

dataset = []
for text, label in zip(df["text"], df["label"]):
    tokens = preprocess(text)
    features = get_features(tokens)
    dataset.append((features, label))

random.shuffle(dataset)
def train(feature_set):
    split = int(0.8 * len(feature_set))
    train_data = feature_set[:split]
    test_data = feature_set[split:]
    classifier = NaiveBayesClassifier.train(train_data)
    accuracy = classify.accuracy(classifier, test_data)

    return accuracy, classifier

if __name__ == "__main__":
    accuracy, classifier = train(dataset)
    print(f"Acurácia: {accuracy:.2f}")

    with open(CLASSIFIER_DIR / "emailclassifier.pkl", "wb") as f:
        pickle.dump(classifier, f)
