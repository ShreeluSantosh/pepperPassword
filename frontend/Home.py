import streamlit as st
from streamlit_extras.switch_page_button import switch_page

st.set_page_config(page_title="pepperPassword", page_icon = "🌶️")

st.title("pepperPassword")

st.write("This is a work-in-progress")

st.header("Are you a new or existing user?")

if st.button("New user"):
    switch_page("sign up")
if st.button("Existing user"):
    switch_page("sign in")