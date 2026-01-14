# Lab 1: Calling, Building, and Securing APIs
In homework I1 you will use third-party LLM APIs, and in the group project you will develop your own APIs. In this lab you will experiment with both: connecting to an LLM of your choice, and providing your own API endpoint. 

To receive credit for this lab, show your work to the TA during recitation.

## Deliverables
- [ ] Use an API key to invoke an LLM API and generate a schema-enforced JSON travel itinerary.
- [ ] Run the API endpoint with the LLM call implemented and demonstrate that it works using an example invocation.
- [ ] Commit your code without committing your credentials. Explain to the TA why hard-coding credentials is a bad idea, and explain any remedial steps you might take should credentials accidentally be leaked. 

## Getting started
Clone the starter code from this Git repository

The code implements a Flask web application that exposes an API endpoint for generating a structured travel itinerary for a given destination. The API accepts a destination string and returns a JSON response containing high-level travel information. 

To generate this response, you will need to call an LLM. We suggest using Meta's [Llama](https://www.llama.com/), hosted by [Groq](https://groq.com/), using [LiteLLM](https://docs.litellm.ai/docs/) to abstract client-specific details.

Install the dependencies listed in requirements.txt using pip or a similar tool. The Flask server can be started with:
```
python3 app.py
```

Once running, the API will be available at:
```
http://localhost:8000/api/v1/itinerary
```

## Generate an LLM API Key
For this we suggest using an API key from Groq but you are certainly free to use other API keys, such as those from OpenAI, Anthropic, etc., Instructions for using those keys can be found [here](https://docs.litellm.ai/docs/providers/openai). The instructions below are shown for getting an API key from Groq.
1. Sign into your Groq account and [navigate to the API keys console](https://console.groq.com/keys) 
2. Generate a new API key
3. Update the code in [analyze.py](./analyze.py) with the API key retrieved from Groq and test it.


## Secure your Credentials
The starter code hardcodes credentials in the code. This is a bad practice. 

Research and discuss best practices, such as never hard-code credentials, never commit credentials to Git, rotate secrets regularly, encrypt your secrets at rest/in-transit if possible, practice least-access privilege on machines where your credentials are stored as environment variables or within local files.

Rewrite the code to load credentials from a file or an environment variable and commit the code without the credentials.

## Implement the call to the LLM
Using LiteLLM, implement the logic in analyze.py to call a an LLM. We suggest `groq/llama-3.3-70b-versatile` but you are free to use others. 

Your implementation should 
- Make at least one LLM call using LiteLLM
- Request a [structured JSON response](https://docs.litellm.ai/docs/completion/json_mode)
- Enforce (or validate) the structure of the response against a predefined schema. The schema should include the following fields:
  - `destination`
  - `price_range`
  - `ideal_visit_times`
  - `top_attractions`

The response from your implemented API call should look something like what is shown below:

```JSON
{
    "destination": "...",
    "ideal_visit_times": [
        ...
    ],
    "price_range": ...,
    "top_attractions": [
       ...
    ]
}
```

## Calling your own API
The Flask server serves a simple documentation page at:
```
http://localhost:8000/
```
It also exposes the API endpoint:
```
GET http://localhost:8000/api/v1/itinerary
```
The endpoint expects a required query parameter:
 - `destination`: the destination to generate an itinerary for

You can use tools like [curl](https://curl.se/) or [Postman](https://www.postman.com/) to ensure your API endpoint is functioning appropriately. 

The file [mlip-api-lab-collection.json](./mlip-api-lab-collection.json) has a sample request to test calls to your API with Postman. Consider using [Postman test scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/) to test the response of your API endpoints (status codes, response structure, etc.,).


## Additional resources 
- [Redhat article on API](https://www.redhat.com/en/topics/api/what-are-application-programming-interfaces)
- [API Design Best Practices](https://blog.stoplight.io/crud-api-design?_ga=2.223919515.1813989671.1674077556-1488117179.1674077556)
- [API Endpoint Best Practices](https://www.telerik.com/blogs/7-tips-building-good-web-api)
- [LiteLLM documentation](https://docs.litellm.ai/)