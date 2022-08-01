const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } =require("./options");
const token = "5344007668:AAG1YlzXVdQj9SonLIdUpv5fjqQmyNlEIUg";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId)=>{
    await bot.sendMessage(
        chatId,
        `Сейчас я загадаю цифру от 0 до 9, а ты должен её отгадать`
      );
      const randomNumber = Math.floor(Math.random() * 10);
      chats[chatId] = randomNumber;
      return bot.sendMessage(chatId, "Отгадывай", gameOptions);
}



const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало работы" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Сыграть в игру: Угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/d97/c1e/d97c1e8a-943c-37c4-963f-8db69b18db05/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот MogShark`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === "/game") {
       return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    await bot.sendMessage(chatId, `Твой ответ: ${data}`);
    if(data==='/again'){
       return startGame(chatId);
    }
   else if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        "Поздравляю! Ты угадал",
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Неправильно! Попробуй еще раз! ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
