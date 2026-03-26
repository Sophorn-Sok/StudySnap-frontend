// Firebase configuration example (Optional)
// Replace with your actual Firebase config from console.firebase.google.com

// export const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// For OpenAI configuration
export const openAiConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4',
};

// Socket.io configuration for real-time features
export const socketConfig = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  reconnectionDelayMax: 10000,
  reconnection: true,
};
