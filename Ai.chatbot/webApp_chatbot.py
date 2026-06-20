import streamlit as st
from chatbot import chat_bot_with_gemini_api


st.title("AI Chatbot")
st.write("Welcome to the AI Chatbot! How can I assist you today?")


user_input = st.text_input("Type your message here...")
if st.button("Send"):
    if user_input:
        response = chat_bot_with_gemini_api(user_input)
        st.write(f"AI: {response}")



