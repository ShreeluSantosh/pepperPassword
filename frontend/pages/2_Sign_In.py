import streamlit as st
import requests

# Set backend API endpoint URL
backend_url = 'http://localhost:3000/login'  

# Set page config
st.set_page_config(page_title="pepperPassword | Sign up", page_icon="🌶️")

# Title and header
st.title("pepperPassword")
st.header("Welcome to pepperPassword!")

# Input fields for username and password
username = st.text_input(label="Your username: ")
password = st.text_input(label="Your password: ", type="password")

# Button to submit login
if st.button("Log in"):
    # Make POST request to backend endpoint
    response = requests.post(backend_url, json={"username": username, "password": password})

    # Check response status code
    if response.status_code == 200:
        st.success("Login successful")
        # Redirect or switch page to another page if needed
        # switch_page("page_name")
    elif response.status_code == 401:
        st.error("Incorrect username or password")
    else:
        st.error("Failed to login. Please try again later.")