import streamlit as st
import requests

# Set backend API endpoint URL
backend_url = 'http://localhost:3000/signup'  

# Set page config
st.set_page_config(page_title="pepperPassword | Sign up", page_icon="🌶️")

# Title and header
st.title("pepperPassword")
st.header("Welcome to pepperPassword!")

# Input fields for username and password
username = st.text_input(label="Your username: ")
password = st.text_input(label="Your password: ", type="password")

# Button to submit login
if st.button("Sign up"):
    # Make POST request to backend endpoint
    response = requests.post(backend_url, json={"username": username, "password": password})

    # Check response status code
    if response.status_code == 201:
        st.success("Sign up successful")
    else:
        st.error("Sign up failed. Please try again later.")
