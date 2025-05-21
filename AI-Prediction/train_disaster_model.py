import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences



# Sample data (Replace with your actual dataset)
texts = ['This is a disaster', 'Everything is fine', 'Emergency situation', 'No issues here', 'Natural disaster happening']
labels = ['disaster', 'no_disaster', 'disaster', 'no_disaster', 'disaster']

# Tokenizing the text data
tokenizer = Tokenizer(num_words=10000)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
data = pad_sequences(sequences, maxlen=100)

# Encoding labels
encoder = LabelEncoder()
encoded_labels = encoder.fit_transform(labels)

# Splitting data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(data, encoded_labels, test_size=0.2, random_state=42)

# Building a simple neural network model
model = keras.Sequential([
    layers.Embedding(input_dim=10000, output_dim=128, input_length=100),
    layers.GlobalAveragePooling1D(),
    layers.Dense(64, activation='relu'),
    layers.Dense(32, activation='relu'),
    layers.Dense(2, activation='softmax')  # 2 classes (disaster, no_disaster)
])

# Compiling the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Training the model
model.fit(X_train, y_train, epochs=5, batch_size=32, validation_data=(X_test, y_test))

# Saving the model
model.save('disaster_model.h5')

print("Model saved as 'disaster_model.h5'")
