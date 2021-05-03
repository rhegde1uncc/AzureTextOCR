const express = require('express');
const app = express();
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');

require('dotenv').config();



var cors = require('cors');
app.use(cors());

//storage engine
const multer_storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

app.use('/ocrImages', express.static('upload/images'));
const upload = multer({
    storage: multer_storage,
    limits: {
        fileSize: 4000000
    },
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.bmp' && ext !== '.pdf' && ext !== '.tiff') {
            return cb(new Error('Only JPEG, PNG, BMP, PDF, and TIFF are allowed'))
        }
        cb(null, true)
    },
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        let api_post_url = process.env.API_URL;
        let key = process.env.API_KEY;
        if (!key) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

        var uri1 = api_post_url + '/vision/v3.0/read/analyze';
        //const image_url = `http://localhost:3000/ocrImages/${req.file.filename}`;
        const image_url = "https://ocr-demo.abtosoftware.com/uploads/handwritten2.jpg";

        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.API_KEY
            }
        }

        let data = {
            'url': image_url
        }

        await axios.post(uri1, data, options)
            .then(function (response) {
                //console.log(response.headers['operation-location']);
                var uri2 = response.headers['operation-location'];
                (async () => {
                    try {
                        const response = await axios.get(uri2, options)
                            .then(function (response) {
                                res.status(200).send(response.data);
                            })
                            .catch(function (error) {
                                throw error;
                            });

                    } catch (error) {
                        console.log(error.response.body);
                    }
                })();

            })
            .catch(function (error) {
                throw error;
            });



    } catch (error) {
        const err = JSON.stringify(error);
        res.status(500).send(`Request error. ${err}`);
    }


});



function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: false,
            message: err.message
        })

    }
    else {
        res.json({
            success: false,
            message: err.message
        })
    }
}

app.use(errHandler);

app.listen(3000, () => {
    console.log('server started on port 3000');
});