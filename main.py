import tensorflow as tf
import sys
model = tf.keras.models.load_model("./tt_model") #Load the model 
IMG_H, IMG_W = 288, 512 #Size of the image taken by the tf model

corresponding_id = { #table labels-position -> monument id
    0: 1,
    1: 2,
    2: 7
} 

file_name = sys.argv[1]
img = tf.keras.utils.load_img(
    file_name, target_size=(IMG_H, IMG_W)
)

img_array = tf.keras.utils.img_to_array(img) #Prepare image to be consumed by predict
img_array = tf.expand_dims(img_array, 0)

predictions = model.predict(img_array)[0]
idx = int(tf.math.argmax(predictions)) # Get the highest value (the predicted label)
print(corresponding_id[idx])
