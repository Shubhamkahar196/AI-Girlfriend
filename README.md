AI Girlfriend Companion
This project is a web-based chat application that allows users to have a personalized conversation with an AI model. It features an interactive user interface where you can select an AI girlfriend avatar and engage in a text-based conversation. The application is built with Next.js and utilizes the Gemini API for natural language generation.

Features
AI Girlfriend Selection: Choose from a gallery of AI girlfriend avatars to personalize your chat experience.

Interactive Chat Interface: Send messages and receive real-time replies from the AI model.

Responsive Design: The app is fully responsive and provides a seamless user experience on both desktop and mobile devices.

API Integration: The backend is powered by a Next.js API route that communicates with the Gemini API to generate responses.

Secure: Environment variables are used to securely manage API keys and endpoints.

Live Demo
You can view a live demo of this project here:

live link : https://ai-girlfriend-kohl.vercel.app/

Note: Please replace the placeholder link with your actual Vercel or other live deployment URL.

Technologies Used
Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

HTTP Client: Axios

AI Model: Gemini API

Getting Started
Follow these steps to set up and run the project locally.

1. Prerequisites
Make sure you have Node.js and npm installed on your machine.

2. Installation
Clone the repository and install the dependencies:

git clone https://github.com/Shubhamkahar196/AI-Girlfriend
cd ai-girlfriend-companion
npm install

3. Environment Variables
Create a .env file in the root of your project and add your Gemini API key and API URL.

GEMINI_API_TOKEN=YOUR_GEMINI_API_KEY
GEMINI_API_URL=your_gemini_api


4. Run the Development Server
Start the application with the following command:

npm run dev

The application will be accessible at http://localhost:3000.

Usage
Choose an Avatar: On the main page, click on one of the AI girlfriend images to select it.

Start Chatting: The chat interface will appear. Type your message in the input field and press "Send" or Enter to get a reply.
