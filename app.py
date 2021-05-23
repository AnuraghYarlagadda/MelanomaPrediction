import os
from flask import Flask, flash, request
import logging
from flask_cors import CORS  # comment this on deployment

import numpy as np
import cv2
import tensorflow as tf

UPLOAD_FOLDER = 'images'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)
CORS(app)  # comment this on deployment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('HELLO WORLD')

ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])

tflite_interpreter1 = tf.lite.Interpreter(
    model_path="TFLite's/model1.tflite")
tflite_interpreter2 = tf.lite.Interpreter(
    model_path="TFLite's/model2.tflite")
tflite_interpreter3 = tf.lite.Interpreter(
    model_path="TFLite's/model3.tflite")
tflite_interpreter4 = tf.lite.Interpreter(
    model_path="TFLite's/model4.tflite")
tflite_interpreter5 = tf.lite.Interpreter(
    model_path="TFLite's/model5.tflite")

input_details = tflite_interpreter5.get_input_details()
output_details = tflite_interpreter5.get_output_details()

# print("== Input details ==")
# print("name:", input_details[0]['name'])
# print("shape:", input_details[0]['shape'])
# print("type:", input_details[0]['dtype'])

# print("\n== Output details ==")
# print("name:", output_details[0]['name'])
# print("shape:", output_details[0]['shape'])
# print("type:", output_details[0]['dtype'])


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'there is no file in form!'
        print(request)
        file = request.files['file']
        path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(path)

        image = cv2.imread(path)
        image = cv2.resize(image, (384, 384))
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        image = np.array(image).reshape(1, 384, 384, 3)
        image = image.astype(np.float32)
        image = image / 255.0

        val = 0
        listofpreds = []

        tflite_interpreter1.allocate_tensors()
        tflite_interpreter1.set_tensor(input_details[0]['index'], image)
        tflite_interpreter1.invoke()
        tflite_model_predictions = tflite_interpreter1.get_tensor(
            output_details[0]['index'])
        print("Prediction results :", tflite_model_predictions)
        val = val + tflite_model_predictions[0][0]
        listofpreds.append(tflite_model_predictions[0][0])

        tflite_interpreter2.allocate_tensors()
        tflite_interpreter2.set_tensor(input_details[0]['index'], image)
        tflite_interpreter2.invoke()
        tflite_model_predictions = tflite_interpreter2.get_tensor(
            output_details[0]['index'])
        print("Prediction results :", tflite_model_predictions)
        val = val + tflite_model_predictions[0][0]
        listofpreds.append(tflite_model_predictions[0][0])

        tflite_interpreter3.allocate_tensors()
        tflite_interpreter3.set_tensor(input_details[0]['index'], image)
        tflite_interpreter3.invoke()
        tflite_model_predictions = tflite_interpreter3.get_tensor(
            output_details[0]['index'])
        print("Prediction results :", tflite_model_predictions)
        val = val + tflite_model_predictions[0][0]
        listofpreds.append(tflite_model_predictions[0][0])

        tflite_interpreter4.allocate_tensors()
        tflite_interpreter4.set_tensor(input_details[0]['index'], image)
        tflite_interpreter4.invoke()
        tflite_model_predictions = tflite_interpreter4.get_tensor(
            output_details[0]['index'])
        print("Prediction results :", tflite_model_predictions)
        val = val + tflite_model_predictions[0][0]
        listofpreds.append(tflite_model_predictions[0][0])

        tflite_interpreter5.allocate_tensors()
        tflite_interpreter5.set_tensor(input_details[0]['index'], image)
        tflite_interpreter5.invoke()
        tflite_model_predictions = tflite_interpreter5.get_tensor(
            output_details[0]['index'])
        print("Prediction results :", tflite_model_predictions)
        val = val + tflite_model_predictions[0][0]
        listofpreds.append(tflite_model_predictions[0][0])

        val = val/5
        print(val)
        if os.path.exists(path):
            os.remove(path)

        return str(val)
