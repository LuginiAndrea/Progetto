import tensorflow as tf
from flask import Flask
import base64
#We create a mini web-server to speed up the use of the 
#model: this way we don't have to re-load the model
#every time we want to make a prediction
model = tf.keras.models.load_model("./tt_model") #Load the model 
IMG_H, IMG_W = 288, 512 #Size of the image taken by the tf model

corresponding_id = { #table labels-position -> monument id
    0: 1,
    1: 2,
    2: 7
} 

app = Flask("__name__")

@app.route("/")
def hello():
    file_name = request.args.get('file_name') #Load image
    img = tf.keras.utils.load_img(
        file_name, target_size=(IMG_H, IMG_W)
    )

    img_array = tf.keras.utils.img_to_array(img) #Prepare image to be consumed by predict
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)[0]
    idx = int(tf.math.argmax(predictions)) # Get the highest value (the predicted label)
    return { #return result
        "result": corresponding_id[idx]
    }

if __name__ == "__main__":
    app.run(port=8081)

