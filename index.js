const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)

var cron = require('node-cron');
//ОТСЮДА
// Id: -1001340940569 Title: Di🍑 <- айди канала

const allUsers = [{
  telegramId: 111,
  payDate: new Date(), //Дата, когда оплачена подписка
  payDays: 7 //Количество оплаченных дней
}];

cron.schedule('0-59 * * * *', () => {
  allUsers.forEach(user => {
      const {telegramId, payDate, payDays} = user;
  
      //Количество дней от подписки до сегодняшнего дня, округление до большего
      const diffDays = Math.ceil(Math.abs(payDate.getTime() - Date.now().getTime()) / (1000 * 3600 * 24));
  
      //Если подписка закончилась
      if(payDays - diffDays <= 0) {
          //телеграм.отправить(telegramId, 'Подписка закончилась, оплатите заново')
          //Бан в чате
          //Удалить юзера из allUsers или базы
      } else {
        //телеграм.отправить(message.chat.id, "responce");(`Осталось ${diffDays} дней подписки`)
      }
  });
})
//СЮДА

bot.start((ctx) => {
    return ctx.reply('Chose your language / выберите язык / оберіть мову', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('ENG', 'eng'),
        Markup.button.callback('RU', 'ru'),
        Markup.button.callback('UA', 'ua')
      ])
    })
  })

  bot.action('ru', (ctx) => {
    return ctx.reply('Что бы получить доступ к каналу, оформите подписку', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('ОФОРМИТЬ ПОДПИСКУ', 'pay_ru'),
      ])
    })
  })

  bot.action('eng', (ctx) => {
    return ctx.reply('To continue using the channel, buy a subscription', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('BUY A SUBSCRIPTION', 'pay_eng'),
      ])
    })
  })

  bot.action('ua', (ctx) => {
    return ctx.reply('Щоб отримати доступ до каналу оплатіть підписку', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('ОФОРМИТИ ПІДПИСКУ', 'pay_ua'),
      ])
    })
  })

  bot.action('pay_ua', (ctx) => { 
  return ctx.reply(
		"Оберіть спосіб оплати",
		Markup.keyboard([
			["Приват банк", "Інші українські банки"],
			["Доларова карта $", "Євро карта €"],
			["Оплата криптовалютою"],
		])
			.oneTime()
			.resize(),
	); 
});

bot.hears("Приват банк", ctx => ctx.reply("Доступ в закритий канал на тиждень : 2000 грн\nРеквізити для оплати :\n5168755451995233\nВідправте скріншот про оплату менеджеру @dianatiiii"));
bot.hears("Інші українські банки", ctx => ctx.reply("Доступ в закритий канал на тиждень : 2000 грн\nРеквізити для оплати :\n5168755451995233\nВідправте скріншот про оплату менеджеру @dianatiiii"));
bot.hears("Доларова карта $", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 $\nРеквізити для оплати :\n5168752014743069\nВідправте скріншот про оплату менеджеру @dianatiiii"));
bot.hears("Євро карта €", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 €\nРеквізити для оплати :\n4149499387334806\nВідправте скріншот про оплату менеджеру @dianatiiii"));
bot.hears("Оплата криптовалютою", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 USDT\nРеквізити для оплати :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nВідправте скріншот про оплату менеджеру @dianatiiii"));

bot.action('pay_ru', (ctx) => { 
  return ctx.reply(
		"Выберите способ оплаты",
		Markup.keyboard([
 			["Приватбанк", "Другие украинские банки"],
			["Доларовая карта $", "Евро карта €"],
			["Оплата криптовалютой"],
		])
			.oneTime()
			.resize(),
	); 
});

bot.hears("Приватбанк", ctx => ctx.reply("Доступ в закрытый канал на неделю : 2000 грн\nРеквизиты для оплаты :\n5168755451995233\nOтправьте скриншот про оплату менеджеру @dianatiiii"));
bot.hears("Другие украинские банки", ctx => ctx.reply("Доступ в закрытый канал на неделю : 2000 грн\nРеквизиты для оплаты :\n5168755451995233\Отправьте скриншот про оплату менеджеру @dianatiiii"));
bot.hears("Доларовая карта $", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 $\nРеквизиты для оплаты :\n5168752014743069\nOтправьте скриншот про оплату менеджеру @dianatiiii"));
bot.hears("Евро карта €", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 €\nРеквизиты для оплаты :\n4149499387334806\nOтправьте скриншот про оплату менеджеру @dianatiiii"));
bot.hears("Оплата криптовалютой", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 USDT\nРеквизиты для оплаты :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nOтправьте скриншот про оплату менеджеру @dianatiiii"));

bot.action('pay_eng', (ctx) => { 
  return ctx.reply(
		"Choose payment method",
		Markup.keyboard([
 			["Privat bank", "Other ukrainian banks"],
			["Dollars card $", "Euros cards €"],
			["Pay by crypto"],
		])
			.oneTime()
			.resize(),
	); 
});

bot.hears("Privat bank", ctx => ctx.reply("Access to closed channel for a week : 2000 UAH\ndetails for payment :\n5168755451995233\nSend a screenshot of the payment to the manager @dianatiiii"));
bot.hears("Other ukrainian banks", ctx => ctx.reply("Access to closed channel for a week : 2000 UAH\ndetails for payment :\n5168755451995233\nSend a screenshot of the payment to the manager @dianatiiii"));
bot.hears("Dollars card $", ctx => ctx.reply("Access to closed channel for a week : 50 $\ndetails for payment :\n5168752014743069\nSend a screenshot of the payment to the manager @dianatiiii"));
bot.hears("Euros cards €", ctx => ctx.reply("Access to closed channel for a week : 50 €\ndetails for payment :\n4149499387334806\nSend a screenshot of the payment to the manager @dianatiiii"));
bot.hears("Pay by crypto", ctx => ctx.reply("Access to closed channel for a week : 50 USDT\ndetails for payment :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nSend a screenshot of the payment to the manager @dianatiiii"));

bot.launch()  

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))