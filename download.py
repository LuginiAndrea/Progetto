import dropbox
from dotenv import dotenv_values
config = dotenv_values(".env")

dpx_key = config["DROPBOX_KEY"]
dbx = dropbox.Dropbox(dpx_key)

with open("tt_model/variables/variables.data-00000-of-00001", "wb") as f:
    metadata, res = dbx.files_download(path="/tt_model/variables/variables.data-00000-of-00001")
    f.write(res.content)
    