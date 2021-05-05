const express = require('express');
const app = express();

const multer = require('multer');
const axios = require('axios');
const path = require('path');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// bodyParser is deprecated fe express version > 14
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//configure secure storage for API keys
require('dotenv').config();

var cors = require('cors');
app.use(cors());


//swagger playground configuration
const options = {
    swaggerDefinition: {
        info: {
            title: 'API for Azure Computer Vision- Text OCR',
            version: '1.0.0',
            description: 'API which is  created for system integration project'
        },
        host: 'localhost:3000', // localhost will be replaced by remote address on server
        basePath: '/',
    },
    apis: ['server.js'],
};

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));


// multer storage engine
const multer_storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});


//upload configuration
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

/**
 * @swagger
 * /api/v1/ocr:
 *   post:
 *     tags:
 *       - Text OCR
 *     summary: This api will accept an image/pdf file or its url to read and extract the text information present in it.
 *     consumes:
 *       - multipart/form-data
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: language
 *         description: language of text to read
 *         type: string
 *         enum: [ "de", "en", "es", "fr", "it", "nl", "pt"]
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image/pdf file to analyze for text OCR. Accepted file formats- JPEG, PNG, BMP, PDF, and TIFF
 *       - in: body
 *         name: file url
 *         description: url of image or pdf  to be analyzed
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *     responses:
 *        '200':
 *          description: OK
 *        '400':
 *          description: Input validation Failed
 *        '500':
 *          description: Internal server error  
 */
app.post('/api/v1/ocr', upload.single('image'), (req, res) => {
    try {
        //Extract  optional query parameter language
        const language = req.query.language;
        const { url } = req.body;

        // Fetch api base url and api key from safe env storage
        let api_post_url = process.env.API_URL;
        let key = process.env.API_KEY;
        if (!key) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

        //Set api url 
        var uri = api_post_url + '/vision/v3.0/read/analyze';
        if (language) {
            uri = uri + '?=' + language;
        }

        //Handle file upload and file url validation
        let image_url;
        if (url && req.file) {
            res.status(400).send("Either upload the file or provide url. Do not input both.");
        } else if (url) {
            image_url = url;
        } else if (req.file) {
            //const image_url = `http://192.168.154.1:3000/ocrImages/${req.file.filename}`;
            image_url = "https://ocr-demo.abtosoftware.com/uploads/handwritten2.jpg";
        } else {
            res.status(400).send("Problem with url");
        }

        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.API_KEY
            }
        }

        let data = {
            'url': image_url
        }
        // post file or its url to Azure computer vision api for text OCR
        axios.post(uri, data, options)
            .then(function (response) {
                var uri2 = response.headers['operation-location'];
                setTimeout(() => {
                    //get analysed result from Azure computer vision - text OCR API
                    axios.get(uri2, options)
                        .then(function (response) {
                            let ocrResults = response.data.analyzeResult.readResults
                            res.status(200).send(ocrResults);
                        })
                        .catch(function (error) {
                            console.log(error);
                            res.status(500).send("Error in Azure text OCR result fetching");
                        });
                }, 1000)
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).send("Error from Azure text OCR read and analyse");
            });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
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