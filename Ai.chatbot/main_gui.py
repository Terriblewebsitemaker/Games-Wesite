import os
import threading
import tkinter as tk
import tkinter.scrolledtext as scrolledtext

import dotenv
from chatbot import chat_bot_with_gemini_api


dotenv.load_dotenv()
api_key = os.getenv("API_KEY")


def display_message(sender, message):
    chat_history.config(state="normal")
    chat_history.insert("end", f"{sender}: {message}\n\n")
    chat_history.see("end")
    chat_history.config(state="disabled")


def send_message(event=None):
    user_text = prompt_entry.get().strip()
    if not user_text:
        return

    prompt_entry.delete(0, "end")
    display_message("You", user_text)
    send_button.config(state="disabled")
    prompt_entry.config(state="disabled")

    thread = threading.Thread(target=fetch_response, args=(user_text,), daemon=True)
    thread.start()


def fetch_response(user_text):
    try:
        if not api_key:
            raise RuntimeError("API_KEY is not set. Please add it to your .env file.")

        response = chat_bot_with_gemini_api(user_text, api_key)
    except Exception as exc:
        response = f"Error: {exc}"

    root.after(0, finish_response, response)


def finish_response(response):
    display_message("Chatbot", response)
    send_button.config(state="normal")
    prompt_entry.config(state="normal")
    prompt_entry.focus()


root = tk.Tk()
root.title("Gemini Chatbot")
root.geometry("650x520")

chat_history = scrolledtext.ScrolledText(root, wrap="word", state="disabled", font=("Segoe UI", 11), padx=10, pady=10)
chat_history.pack(fill="both", expand=True, padx=10, pady=(10, 0))

control_frame = tk.Frame(root)
control_frame.pack(fill="x", padx=10, pady=10)

prompt_entry = tk.Entry(control_frame, font=("Segoe UI", 12))
prompt_entry.pack(side="left", fill="x", expand=True, padx=(0, 10))
prompt_entry.bind("<Return>", send_message)

send_button = tk.Button(control_frame, text="Send", width=12, command=send_message)
send_button.pack(side="right")

status_text = "API_KEY loaded" if api_key else "API_KEY missing - set it in .env"
status_color = "green" if api_key else "red"
status_label = tk.Label(root, text=status_text, anchor="w", fg=status_color, font=("Segoe UI", 10))
status_label.pack(fill="x", padx=10, pady=(0, 10))

if not api_key:
    display_message("System", "No API_KEY found. Please add API_KEY to your .env file and restart this app.")

prompt_entry.focus()
root.mainloop()
