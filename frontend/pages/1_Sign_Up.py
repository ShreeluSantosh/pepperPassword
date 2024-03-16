import streamlit as st
from streamlit_extras.switch_page_button import switch_page

st.set_page_config(page_title="pepperPassword | Sign up", page_icon = "🌶️")

st.title("pepperPassword")

st.header("Welcome to pepperPassword!")

st.text_input(label="Your username: ")
st.text_input(label="Your password: ", type="password")