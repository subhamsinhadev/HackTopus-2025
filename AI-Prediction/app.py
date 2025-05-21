from flask import Flask, request, jsonify, render_template
import tensorflow as tf
from PIL import Image
import numpy as np
import os

app = Flask(__name__)

# Load your trained model
model = tf.keras.models.load_model('disaster_model.h5')

# Class labels
classes = ['Flood', 'Cyclone', 'Wildfire', 'Earthquake', 'No Disaster']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    img = Image.open(file.stream)
    img = img.resize((128, 128))  # Resize according to your model input
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class = classes[np.argmax(prediction)]
    confidence = float(np.max(prediction)) * 100

    result = {
        'severity': predicted_class,
        'confidence': round(confidence, 2)
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
