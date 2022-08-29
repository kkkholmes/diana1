const { Telegraf, Markup, Scenes, session } = require('telegraf')
const sqlite3 = require('better-sqlite3')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)
const db = new sqlite3('users.db')

const cancel = [
  ['Отмена']
]

db.exec('CREATE TABLE IF NOT EXISTS users (id INT, subDays INT, regDate INT)')
const add = db.prepare('INSERT INTO users (id, subDays, regDate) VALUES (?, ?, ?)')
const get = db.prepare('SELECT * FROM users WHERE id = ?')
const remove = db.prepare('DELETE FROM users WHERE id = ?')
const all = db.prepare('SELECT * FROM users')

var cron = require('node-cron');

// Id: -1001340940569 Title: Di🍑 <- айди канала

cron.schedule('* * * * *', () => {
  all.all().forEach(async (user) => {
      let i = user.regDate + (1000 * 60 * 60 * 24 * user.subDays)
      if (Date.now() > i) {
        remove.run(user.id)
        await bot.telegram.sendMessage(user.id, 'Срок вашей подписки истек, купите заново')
        awaitbot.telegram.banChatMember(process.env.CHANNEL, user.id)
      }
  });
})
cron.schedule('12 17 * * *', () => {
  all.all().forEach(async (user) => {
    let i = user.regDate + (1000 * 60 * 60 * 24 * user.subDays)
    i = Date.now() - i
    i = i / 1000 / 60 / 60 / 24
    i = Math.abs(Math.floor(i))
    if (i == 0) {
      await bot.telegram.sendMessage(user.id, 'Сегодня заканчивается срок вашей подписки')
    } else {
      await bot.telegram.sendMessage(user.id, `Осталось ${i} дней до конца вашей подписки`)
    }
});
})

const invite = new Scenes.WizardScene('invite',
  async (ctx) => {
    await ctx.reply('Введите айди того, кого надо пригласить в канал:', Markup.keyboard(cancel).resize())
    ctx.wizard.next()
  }, async (ctx) => {
    if (ctx.message.text == 'Отмена') {
      await ctx.reply('Отменено', { reply_markup: { remove_keyboard: true } })
      return ctx.scene.leave()
    }
    try {
      await ctx.tg.getChat(Number(ctx.message.text))
    } catch {
      return await ctx.reply('У бота нет чата с юзером с таким ID, введите другой:', Markup.keyboard(cancel).resize())
    }
    ctx.wizard.state.id = Number(ctx.message.text)
    await ctx.reply('Введите количество дней выдаваемой подписки:', Markup.keyboard(cancel).resize())
    ctx.wizard.next()
  }, async (ctx) => {
    if (ctx.message.text == 'Отмена') {
      await ctx.reply('Отменено', { reply_markup: { remove_keyboard: true } })
      return ctx.scene.leave()
    }
    let days = Number(ctx.message.text)
    if (isNaN(days)) {
      return await ctx.reply('Введите число:', Markup.keyboard(cancel).resize())
    } else if (days <= 0) {
      return await ctx.reply('Ввдите число больше 0:', Markup.keyboard(cancel).resize())
    }
    add.run(ctx.wizard.state.id, Math.floor(days), Date.now())
    send(ctx.wizard.state.id)
    await ctx.reply('Пользователю выслана ссылка с приглашением', { reply_markup: { remove_keyboard: true } })
  }
)

const stage = new Scenes.Stage([invite])
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
    return ctx.reply('Chose your language / выберите язык / оберіть мову', {
      ...Markup.inlineKeyboard([
        Markup.button.callback('ENG', 'eng'),
        Markup.button.callback('RU', 'ru'),
        Markup.button.callback('UA', 'ua')
      ])
    })
  })

bot.command('admin', async (ctx, next) => {
  if (process.env.ADMINS.includes(ctx.chat.id)) {
    next()
  }
}, async (ctx) => {
  await ctx.scene.enter('invite')
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

bot.hears("Приват банк", ctx => ctx.reply("Доступ в закритий канал на тиждень : 2000 грн\nРеквізити для оплати :\n5168755451995233\nВідправте скріншот про оплату менеджеру @Dianka43211")); 
bot.hears("Інші українські банки", ctx => ctx.reply("Доступ в закритий канал на тиждень : 2000 грн\nРеквізити для оплати :\n5168755451995233\nВідправте скріншот про оплату менеджеру @Dianka43211"));
bot.hears("Доларова карта $", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 $\nРеквізити для оплати :\n5168752014743069\nВідправте скріншот про оплату менеджеру @Dianka43211"));
bot.hears("Євро карта €", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 €\nРеквізити для оплати :\n4149499387334806\nВідправте скріншот про оплату менеджеру @Dianka43211"));
bot.hears("Оплата криптовалютою", ctx => ctx.reply("Доступ в закритий канал на тиждень : 50 USDT\nРеквізити для оплати :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nВідправте скріншот про оплату менеджеру @Dianka43211"));

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

bot.hears("Приватбанк", ctx => ctx.reply("Доступ в закрытый канал на неделю : 2000 грн\nРеквизиты для оплаты :\n5168755451995233\nOтправьте скриншот про оплату менеджеру @Dianka43211"));
bot.hears("Другие украинские банки", ctx => ctx.reply("Доступ в закрытый канал на неделю : 2000 грн\nРеквизиты для оплаты :\n5168755451995233\Отправьте скриншот про оплату менеджеру @Dianka43211"));
bot.hears("Доларовая карта $", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 $\nРеквизиты для оплаты :\n5168752014743069\nOтправьте скриншот про оплату менеджеру @Dianka43211"));
bot.hears("Евро карта €", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 €\nРеквизиты для оплаты :\n4149499387334806\nOтправьте скриншот про оплату менеджеру @Dianka43211"));
bot.hears("Оплата криптовалютой", ctx => ctx.reply("Доступ в закрытый канал на неделю : 50 USDT\nРеквизиты для оплаты :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nOтправьте скриншот про оплату менеджеру @Dianka43211"));

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

bot.hears("Privat bank", ctx => ctx.reply("Access to closed channel for a week : 2000 UAH\ndetails for payment :\n5168755451995233\nSend a screenshot of the payment to the manager @Dianka43211"));
bot.hears("Other ukrainian banks", ctx => ctx.reply("Access to closed channel for a week : 2000 UAH\ndetails for payment :\n5168755451995233\nSend a screenshot of the payment to the manager @Dianka43211"));
bot.hears("Dollars card $", ctx => ctx.reply("Access to closed channel for a week : 50 $\ndetails for payment :\n5168752014743069\nSend a screenshot of the payment to the manager @Dianka43211"));
bot.hears("Euros cards €", ctx => ctx.reply("Access to closed channel for a week : 50 €\ndetails for payment :\n4149499387334806\nSend a screenshot of the payment to the manager @Dianka43211"));
bot.hears("Pay by crypto", ctx => ctx.reply("Access to closed channel for a week : 50 USDT\ndetails for payment :\n[USDT adress](https://link.trustwallet.com/send?address=TGdQDbCfLB4h6X7zPQLDuwtK6zNfg74EMn&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)\nSend a screenshot of the payment to the manager @Dianka43211"));

bot.on('chat_join_request', async (ctx) => {
  if (ctx.chatJoinRequest.chat.id != process.env.CHANNEL) return
  let i = all.all()
  if (!i.find(user => user.id == ctx.chatJoinRequest.from.id)) return
  ctx.telegram.approveChatJoinRequest(process.env.CHANNEL, ctx.chatJoinRequest.from.id)
})

function send(id) {
  let kb = [
    Markup.button.url('Отправить запрос', process.env.LINK)
  ]
  bot.telegram.unbanChatMember(process.env.CHANNEL, id)
  bot.telegram.sendMessage(id, `Ваша подписка была одобрена, отправьте запрос на вступление в группу по ссылке ниже`, Markup.inlineKeyboard(kb))
}

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))