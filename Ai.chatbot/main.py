from chatbot import simple_chatbot_if_elif_else, chat_bot_with_gemini_api
import dotenv
import os
dotenv.load_dotenv()
api_key = os.getenv("API_KEY")
while True:
    user_input = input("You: (type 'quit' to exit): ")
    if user_input == "quit":
        break
    response = chat_bot_with_gemini_api(user_input, api_key)
    print("Chatbot:", response)
