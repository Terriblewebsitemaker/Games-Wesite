import os
from google import genai


def simple_chatbot_if_elif_else(user_input):
    if user_input == "hello":
        return "Hello there!"
    elif user_input == "how are you":
        return "I'm doing well, thank you!"
    elif user_input == "what is your name":
        return "I am a simple chatbot."
    else:
        return "Sorry, I don't understand."
    

def chat_bot_with_gemini_api(user_input, api_key):
    if not api_key:
        raise RuntimeError(
            "API_KEY environment variable is required to call the Gemini API."
        )

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[user_input],
    )
    return response.text