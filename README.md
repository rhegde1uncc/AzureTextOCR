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
It is very simple and straight forward to use this Text Scanner API. Try out swagger playground. 
                                                                                                                  
