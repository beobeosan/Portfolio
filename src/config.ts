export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  telegramToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  telegramChatId: import.meta.env.VITE_TELEGRAM_CHAT_ID
}