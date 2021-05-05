# Text Scanner API  V1.0
Made with [Azure Text OCR](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/overview-ocr)




Text Scanner API [(Application Programming Interfaces)](https://en.wikipedia.org/wiki/API) power its platform for text detection and extraction. Behind this API, Microsoft’s Azure Computer Vision API for Text OCR is used. The Text Scanner API allows users to input with  images or  multi-page, mixed language, and mixed type (print – seven languages and handwritten – English only) documents to extract text information from it.

Text Scanner API  is organized around [REST](https://en.wikipedia.org/wiki/Representational_state_transfer). It accepts raw binary files or image URLs in request bodies, returns JSON responses, and uses standard HTTP response codes.  This API supports detecting both printed and handwritten text in the same image or document.

# What is Optical Character Recognition [(OCR)](https://en.wikipedia.org/wiki/Optical_character_recognition)?
Optical character recognition (OCR) allows you to extract printed or handwritten text from images, such as photos of street signs and products, as well as from documents—invoices, bills, financial reports, articles, and more. 

# How is this  Text Scanner API built?
This Text scanner API  internally uses Azure Computer Vision API(V3.0).The Computer Vision API provides state-of-the-art algorithms to process images and return information. For example, computer vision text OCR can be used to determine if an image contains text content and read the text from the image.

# Why should you use this Text Scanner API rather than Azure Text OCR directly?
To consume Azure computer vision APIs, you must create an account with Microsoft Azure. You need to create resources for computer vision, and you need to manage your API keys by your own. Moreover, you will have to make 2 separate API calls one to read and another to get analyzed result to extract the text information. But with this API, you will be avoiding those extra steps. You do not have to have an Azure account, you do not have to manage your API keys, you can just make a single request to this API and you will receive the analyzed result with the same speed of Azure text OCR API.

# How Text Scanner API works?
The  API is optimized for text-heavy images and multi-page, mixed language, and mixed type (print – seven languages and handwritten – English only) documents. The text analysis happens in 2 steps. First, when you upload a file or web address of an image to be analyzed for its text content, Text Scanner API hits the Azure text OCR read API, where actual analysis happens for text recognition. The call returns with a response header called 'Operation-Location'. In the second step,  our API hits Azure text OCR  read results API  with the operation-location obtained  to fetch the detected text lines and words as part of the JSON response. The time for completion of the text extraction process depends on the volume of the text and the number of pages in the document.


![image](https://user-images.githubusercontent.com/71330830/117196288-4ba8bc00-adb4-11eb-81b8-0b3ef4b7ceaf.png)



# Supported languages:
The text extraction is currently only available for Dutch, English, French, German, Italian, Portuguese, and Spanish.

# How to consume this simple Text OCR API?
It is very simple and straight forward to use this Text Scanner API. Try out [SWAGGER playground](http://142.93.56.167:3000/docs)!!.

### Base url:
```
http://142.93.56.167:3000/api/v1/ocr
```
### Query Pararameters:
An optional query parameter named 'language' is accepted by the API.
```
Query param name : 'language'
Allowed values :  'de', 'en', 'es', 'fr', 'it', 'nl', 'pt'
 ```
### Request Headers:
If your input to the Text Scanner API is image URL, then set request header as below:
```
'Content-Type': 'application/json'
```
If your input to the Text Scanner API is raw image binary, then set request header as below:
```
'Content-Type': 'multipart/form-data'
```
### Request body
Input passed within the POST body. 
Supported input methods: raw image binary or image URL.

**Input requirements:**
-	Supported image formats: JPEG, PNG, BMP, PDF and TIFF.
-	Please do note MPO (Multi Picture Objects) embedded JPEG files are not supported.
- For multi-page PDF and TIFF documents:  currently, this API is supporting 2 pages processing only.
- Image file size must be less than 4 MB.
- The image/document page dimensions must be at least 50 x 50 pixels and at most 10000 x 10000 pixels.
-	The PDF file dimensions must be at most 17 x 17 inches, corresponding to Legal or A3 paper sizes and smaller.

## Possible Responses :
| Response code | Description |
| --- | --- |
| 200 | OK |
| 400 | Input Validation Failed |
| 500 | Internal Server Error |
#
#
### 200 : OK
This response code means a successful response received.

JSON fields in the response body and their descrption:

| Fields| Type | Description |
| --- | --- | --- |
| Success | boolean | Indicates whether response received successfully |
| lines | [Object]	 | 	List of text lines. The maximum number of lines returned is 300 per page. The lines are sorted top to bottom, left to right, although in certain cases proximity is treated with higher priority. As the sorting order depends on the detected text, it may change across images and OCR version updates. Thus, business logic should be built upon the actual line location instead of order. |
| words | [Object]	 | List of words in the text line. |
| boundingBox | [Number]	 | Quadrangle bounding box of a line or word, depending on the parent object, specified as a list of 8 numbers. The coordinates are specified relative to the top-left of the original image. The eight numbers represent the four points, clockwise from the top-left corner relative to the text orientation. For image, the (x, y) coordinates are measured in pixels. For PDF, the (x, y) coordinates are measured in inches. |
| text | String	 | The text content of a line or word. |
| confidence | Number	 | Confidence value between 0 and 1 inclusive. |
| width | Number	 | The width of the image/PDF in pixels/inches, respectively. |
| height | Number	 | 	The height of the image/PDF in pixels/inches, respectively. |
| angle | Number	 | The general orientation of the text in clockwise direction, measured in degrees between (-180, 180]. |
| page | Integer	 | The 1-based page number in the input document. |
| unit | String	 | The unit used by the width, height and boundingBox properties. For images, the unit is "pixel". For PDF, the unit is "inch". |
| language | String	 | The input language of the overall document. |

#
#
A successful response is returned in JSON. The sample application parses and displays a successful response in the command prompt window, similar to the following example:
```JSON
{
  "success": true,
  "readResults": [
    {
      "page": 1,
      "angle": 1.663,
      "width": 800,
      "height": 550,
      "unit": "pixel",
      "lines": [
        {
          "boundingBox": [
            96,
            80,
            671,
            98,
            666,
            199,
            96,
            193
          ],
          "text": "LAST Wednesday",
          "words": [
            {
              "boundingBox": [
                97,
                81,
                337,
                85,
                335,
                180,
                101,
                195
              ],
              "text": "LAST",
              "confidence": 0.985
            },
            {
              "boundingBox": [
                360,
                86,
                665,
                124,
                655,
                199,
                357,
                180
              ],
              "text": "Wednesday",
              "confidence": 0.755
            }
          ]
        },
        {
          "boundingBox": [
            103,
            230,
            741,
            252,
            739,
            340,
            103,
            325
          ],
          "text": "We had a good",
          "words": [
            {
              "boundingBox": [
                132,
                233,
                259,
                244,
                263,
                331,
                136,
                321
              ],
              "text": "We",
              "confidence": 0.986
            },
            {
              "boundingBox": [
                276,
                245,
                443,
                253,
                449,
                340,
                281,
                332
              ],
              "text": "had",
              "confidence": 0.981
            },
            {
              "boundingBox": [
                460,
                254,
                512,
                255,
                519,
                340,
                467,
                340
              ],
              "text": "a",
              "confidence": 0.986
            },
            {
              "boundingBox": [
                530,
                255,
                732,
                252,
                740,
                339,
                536,
                340
              ],
              "text": "good",
              "confidence": 0.559
            }
          ]
        },
        {
          "boundingBox": [
            111,
            379,
            544,
            392,
            537,
            490,
            109,
            461
          ],
          "text": "Team building",
          "words": [
            {
              "boundingBox": [
                114,
                387,
                282,
                380,
                277,
                455,
                113,
                444
              ],
              "text": "Team",
              "confidence": 0.952
            },
            {
              "boundingBox": [
                293,
                380,
                542,
                397,
                532,
                491,
                288,
                456
              ],
              "text": "building",
              "confidence": 0.69
            }
          ]
        }
      ]
    }
  ]
}
```
#
## 400: Input Validation Failed

If there is a problem with the supplied input to the Text Scanner API, then this response is received.
Example response:
```
{
  "success": false,
  "code": "ProblemWithURL",
  "message": "Input Validation Failed"
}
```

## 500: Internal Server Error
If problem is due to the API service, then this status code is returned.
Example response:
```
{
  "success": false,
  "code": "Unspecified", 
  "message": "Internal Server Error"
}

```
