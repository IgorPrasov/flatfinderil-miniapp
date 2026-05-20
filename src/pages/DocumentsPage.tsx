import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp, AlertTriangle, Wand2 } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { t } from '@/i18n'

// ── Contract templates ───────────────────────────────────────────────────────

const RENT_TEMPLATE = `ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ
(типовая форма)

г. _________________, «___» ____________ 20__ г.

СТОРОНЫ:
Арендодатель: ___________________________________
Удостоверение личности (Teudat Zehut): ___________

Арендатор: ______________________________________
Удостоверение личности (Teudat Zehut): ___________

ПРЕДМЕТ ДОГОВОРА:
Арендодатель передаёт, а Арендатор принимает во временное пользование жилое помещение, расположенное по адресу:
_________________________________________________
Площадь: _______ м², количество комнат: _________

СРОК АРЕНДЫ:
с «___» ____________ 20__ г. по «___» ____________ 20__ г.

АРЕНДНАЯ ПЛАТА И ПОРЯДОК РАСЧЁТОВ:
Ежемесячная арендная плата составляет _________ ₪.
Оплата производится не позднее _____ числа каждого месяца.
Способ оплаты: ___________________________________

ЗАЛОГ (פיקדון):
Арендатор уплачивает залог в размере _________ ₪
(эквивалент _____ месяцев аренды) в течение _____ дней с момента подписания договора.
Залог возвращается в течение 60 дней после окончания аренды при отсутствии претензий.

КОММУНАЛЬНЫЕ УСЛУГИ:
Арнона (муниципальный налог):  □ Арендодатель  □ Арендатор
Электричество:                  □ Арендодатель  □ Арендатор
Вода:                           □ Арендодатель  □ Арендатор
Газ:                            □ Арендодатель  □ Арендатор
Ваад Байт (обслуживание):      □ Арендодатель  □ Арендатор

ОБЯЗАННОСТИ СТОРОН:
Арендодатель обязуется:
1. Передать помещение в надлежащем состоянии.
2. Обеспечить проведение капитального ремонта.
3. Не вмешиваться в законное пользование помещением.

Арендатор обязуется:
1. Использовать помещение только для проживания.
2. Содержать помещение в надлежащем состоянии.
3. Не производить перепланировку без согласия Арендодателя.
4. Не сдавать помещение в субаренду без письменного согласия.
5. Своевременно вносить арендную плату.

ДОСРОЧНОЕ РАСТОРЖЕНИЕ:
Арендатор вправе досрочно расторгнуть договор, уведомив Арендодателя за _____ месяца(ев) в письменной форме.
При досрочном расторжении по инициативе Арендатора без уважительных причин залог не возвращается (либо по соглашению сторон).

ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ:
Домашние животные: □ Разрешены  □ Запрещены
Курение в помещении: □ Разрешено  □ Запрещено
_________________________________________________
_________________________________________________

Настоящий договор составлен в двух экземплярах, по одному для каждой из Сторон.

ПОДПИСИ:
Арендодатель: _________________ Дата: ___________
Арендатор:    _________________ Дата: ___________`

const PRELIMINARY_BUY_TEMPLATE = `ПРЕДВАРИТЕЛЬНЫЙ ДОГОВОР КУПЛИ-ПРОДАЖИ
ЗИКАРОН ДВАРИМ (זכרון דברים)

г. _________________, «___» ____________ 20__ г.

СТОРОНЫ:
Продавец: _______________________________________
Удостоверение личности: _________________________

Покупатель: _____________________________________
Удостоверение личности: _________________________

ОБЪЕКТ СДЕЛКИ:
Квартира/объект по адресу: _______________________
________________________________________________
Площадь: _______ м², этаж: _____, комнат: ________
Кадастровый номер (Gush/Chelka): ________________

ЦЕНА СДЕЛКИ:
Стороны договорились о продаже за сумму: _________ ₪
(_________________________________________ шекелей)

ПОРЯДОК РАСЧЁТОВ:
Задаток при подписании: _________________________ ₪
Оплата при подписании основного договора: ________ ₪
Окончательный расчёт при передаче ключей: ________ ₪

СРОКИ:
Подписание основного договора не позднее: ________
Передача ключей и освобождение объекта: __________

УСЛОВИЯ:
1. Объект продаётся без обременений (עסקה נקייה).
2. Продавец гарантирует отсутствие долгов по арнона, ваад байт, коммунальным услугам на дату передачи.
3. Стороны обязуются обратиться к адвокату для оформления сделки.
4. Все расходы по сделке распределяются: _________.

ЗАДАТОК:
При отказе Покупателя от сделки — задаток остаётся у Продавца.
При отказе Продавца — Продавец возвращает задаток в двойном размере.

Настоящий документ составлен в двух экземплярах.
Стороны понимают, что данный документ не заменяет юридически оформленный договор купли-продажи.

Продавец:   _________________ Дата: ___________
Покупатель: _________________ Дата: ___________`

const BUY_CONTRACT_TEMPLATE = `ДОГОВОР КУПЛИ-ПРОДАЖИ НЕДВИЖИМОСТИ
(краткая типовая форма)

г. _________________, «___» ____________ 20__ г.

ПРОДАВЕЦ: _______________________________________
Паспорт/Teudat Zehut: ___________________________
Адрес: _________________________________________

ПОКУПАТЕЛЬ: _____________________________________
Паспорт/Teudat Zehut: ___________________________
Адрес: _________________________________________

ПРЕДМЕТ ДОГОВОРА:
Продавец продаёт, а Покупатель приобретает право собственности на недвижимое имущество:
Адрес: __________________________________________
Площадь: _______ м²
Кадастровый номер: ______________________________

ЦЕНА И ПОРЯДОК РАСЧЁТОВ:
Цена продажи: ___________________________________₪
Задаток (10%): __________________________________₪ — при подписании
Остаток: ________________________________________₪ — при передаче права собственности

СОСТОЯНИЕ ОБЪЕКТА:
Объект передаётся в состоянии: □ «как есть»  □ с отделкой  □ с мебелью

ГАРАНТИИ ПРОДАВЦА:
1. Продавец является законным собственником объекта.
2. Объект свободен от залогов, обременений и претензий третьих лиц.
3. Задолженности по коммунальным платежам и налогам отсутствуют.

НАЛОГИ И СБОРЫ:
Мас Рехиша (налог покупателя): несёт Покупатель.
Мас Швах (налог продавца): несёт Продавец.
Гонорар адвоката: по договорённости сторон.

ПЕРЕДАЧА ОБЪЕКТА:
Дата передачи ключей: ___________________________
При передаче составляется акт приёма-передачи.

Продавец:   _________________ Дата: ___________
Покупатель: _________________ Дата: ___________`

// ── Contract templates list ──────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'rent',
    icon: '🏠',
    title: 'Договор аренды',
    subtitle: 'Долгосрочная аренда жилья (типовая форма)',
    text: RENT_TEMPLATE,
    color: 'bg-blue-50 border-blue-100',
    badge: 'Аренда',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'preliminary',
    icon: '📝',
    title: 'Зикарон Дварим',
    subtitle: 'Предварительный договор купли-продажи',
    text: PRELIMINARY_BUY_TEMPLATE,
    color: 'bg-amber-50 border-amber-100',
    badge: 'Покупка',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'buy',
    icon: '🔑',
    title: 'Договор купли-продажи',
    subtitle: 'Краткая форма договора продажи недвижимости',
    text: BUY_CONTRACT_TEMPLATE,
    color: 'bg-green-50 border-green-100',
    badge: 'Покупка',
    badgeColor: 'bg-green-100 text-green-700',
  },
]

// ── Contract builder ─────────────────────────────────────────────────────────

interface BuilderState {
  type: 'rent' | 'buy'
  party1: string   // landlord/seller
  party2: string   // tenant/buyer
  address: string
  area: string
  price: string
  deposit: string
  dateStart: string
  dateEnd: string
}

const EMPTY_BUILDER: BuilderState = {
  type: 'rent',
  party1: '', party2: '',
  address: '', area: '',
  price: '', deposit: '',
  dateStart: '', dateEnd: '',
}

function buildContract(s: BuilderState): string {
  const today = new Date().toLocaleDateString('ru-RU')
  if (s.type === 'rent') {
    return `ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ

«${today}»

Арендодатель: ${s.party1 || '_______________'}
Арендатор:    ${s.party2 || '_______________'}

ОБЪЕКТ: ${s.address || '_______________'}
Площадь: ${s.area || '___'} м²

СРОК: с ${s.dateStart || '___'} по ${s.dateEnd || '___'}

АРЕНДНАЯ ПЛАТА: ${s.price ? `${parseInt(s.price).toLocaleString()} ₪/месяц` : '___ ₪/месяц'}
ЗАЛОГ: ${s.deposit ? `${parseInt(s.deposit).toLocaleString()} ₪` : '___ ₪'}

УСЛОВИЯ:
1. Арендатор обязуется оплачивать аренду до 5-го числа каждого месяца.
2. Залог возвращается в течение 60 дней после окончания аренды.
3. Коммунальные услуги оплачивает Арендатор.
4. Субаренда без письменного согласия Арендодателя запрещена.
5. Досрочное расторжение — уведомление за 2 месяца.

Арендодатель: _________________ Дата: ______
Арендатор:    _________________ Дата: ______`
  } else {
    return `ПРЕДВАРИТЕЛЬНЫЙ ДОГОВОР КУПЛИ-ПРОДАЖИ

«${today}»

Продавец:    ${s.party1 || '_______________'}
Покупатель:  ${s.party2 || '_______________'}

ОБЪЕКТ: ${s.address || '_______________'}
Площадь: ${s.area || '___'} м²

ЦЕНА СДЕЛКИ: ${s.price ? `${parseInt(s.price).toLocaleString()} ₪` : '___ ₪'}
ЗАДАТОК (10%): ${s.price ? `${Math.round(parseInt(s.price) * 0.1).toLocaleString()} ₪` : '___ ₪'}

СРОКИ:
Подписание основного договора до: ${s.dateEnd || '___'}
Передача ключей: ${s.dateEnd || '___'}

УСЛОВИЯ:
1. Объект свободен от обременений.
2. При отказе Покупателя — задаток остаётся у Продавца.
3. При отказе Продавца — задаток возвращается в двойном размере.
4. Стороны обязуются обратиться к адвокату для оформления сделки.

Продавец:    _________________ Дата: ______
Покупатель:  _________________ Дата: ______`
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DocumentsPage() {
  const { lang, haptic, rtl } = useTelegram()
  const [activeTab, setActiveTab] = useState<'templates' | 'builder'>('templates')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [builder, setBuilder] = useState<BuilderState>(EMPTY_BUILDER)
  const [generated, setGenerated] = useState('')
  const [copiedGen, setCopiedGen] = useState(false)

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      haptic('medium')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  function generate() {
    haptic('medium')
    setGenerated(buildContract(builder))
  }

  function set(k: keyof BuilderState, v: string) {
    setBuilder((b) => ({ ...b, [k]: v }))
    setGenerated('')
  }

  return (
    <div className="flex flex-col h-full" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="px-4 pt-4 pb-0 bg-white sticky top-0 z-10 border-b border-gray-50">
        <h1 className="text-lg font-bold text-brand mb-3">{t('docs_title', lang)}</h1>

        {/* Tab switcher */}
        <div className="flex gap-0 bg-gray-100 rounded-xl p-1 mb-3">
          {(['templates', 'builder'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { haptic('light'); setActiveTab(tab) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab === 'templates' ? `📋 ${t('docs_tab_templates', lang)}` : `✨ ${t('docs_tab_builder', lang)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── Templates tab ── */}
        {activeTab === 'templates' && (
          <div className="p-4 space-y-3">
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} className={`rounded-2xl border ${tpl.color} overflow-hidden`}>
                {/* Card header */}
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => { haptic('light'); setExpandedId(expandedId === tpl.id ? null : tpl.id) }}
                >
                  <span className="text-2xl">{tpl.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{tpl.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tpl.subtitle}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tpl.badgeColor} shrink-0 mr-2`}>
                    {tpl.badge}
                  </span>
                  {expandedId === tpl.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>

                {/* Expanded content */}
                {expandedId === tpl.id && (
                  <div className="px-4 pb-4">
                    {/* Actions */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => copyText(tpl.text, tpl.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                          copiedId === tpl.id
                            ? 'bg-green-500 text-white'
                            : 'bg-brand text-white'
                        }`}
                      >
                        {copiedId === tpl.id
                          ? <><Check className="w-4 h-4" /> {t('docs_copied', lang)}</>
                          : <><Copy className="w-4 h-4" /> {t('docs_copy', lang)}</>}
                      </button>
                    </div>
                    {/* Contract text */}
                    <pre className="text-xs text-gray-700 bg-white/70 rounded-xl p-3 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto max-h-80 overflow-y-auto">
                      {tpl.text}
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl p-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">{t('docs_disclaimer', lang)}</p>
            </div>
          </div>
        )}

        {/* ── Builder tab ── */}
        {activeTab === 'builder' && (
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-4">{t('docs_builder_title', lang)}</p>

            {/* Contract type */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                {t('docs_builder_type', lang)}
              </label>
              <div className="flex gap-2">
                {(['rent', 'buy'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => { haptic('light'); set('type', type); setGenerated('') }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      builder.type === type
                        ? 'bg-brand border-brand text-white'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {type === 'rent' ? `🏠 ${t('docs_type_rent', lang)}` : `🔑 ${t('docs_type_buy', lang)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            {[
              { key: 'party1' as const, label: builder.type === 'rent' ? t('docs_landlord', lang) : t('docs_seller', lang), placeholder: 'Иванов Иван Иванович' },
              { key: 'party2' as const, label: builder.type === 'rent' ? t('docs_tenant', lang) : t('docs_buyer', lang), placeholder: 'Петрова Анна Сергеевна' },
              { key: 'address' as const, label: t('docs_address', lang), placeholder: 'ул. Дизенгоф 1, Тель-Авив' },
              { key: 'area' as const, label: t('docs_area', lang), placeholder: '75', type: 'number' },
              { key: 'price' as const, label: builder.type === 'rent' ? 'Арендная плата (₪/мес)' : t('docs_price', lang), placeholder: builder.type === 'rent' ? '6000' : '2000000', type: 'number' },
              ...(builder.type === 'rent' ? [{ key: 'deposit' as const, label: t('docs_deposit', lang), placeholder: '12000', type: 'number' }] : []),
              { key: 'dateStart' as const, label: t('docs_date_start', lang), type: 'date' },
              { key: 'dateEnd' as const, label: t('docs_date_end', lang), type: 'date' },
            ].map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key} className="mb-3">
                <label className="text-sm text-gray-500 mb-1 block">{label}</label>
                <input
                  type={type}
                  value={builder[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors"
                />
              </div>
            ))}

            {/* Generate button */}
            <button
              onClick={generate}
              className="w-full py-3.5 bg-brand text-white font-bold rounded-2xl flex items-center justify-center gap-2 mt-2"
            >
              <Wand2 className="w-5 h-5" />
              {t('docs_generate', lang)}
            </button>

            {/* Generated result */}
            {generated && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">{t('docs_result_title', lang)}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generated).then(() => {
                        setCopiedGen(true)
                        haptic('medium')
                        setTimeout(() => setCopiedGen(false), 2000)
                      })
                    }}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors ${
                      copiedGen ? 'bg-green-500 text-white' : 'bg-brand text-white'
                    }`}
                  >
                    {copiedGen
                      ? <><Check className="w-3.5 h-3.5" /> {t('docs_copied', lang)}</>
                      : <><Copy className="w-3.5 h-3.5" /> {t('docs_copy', lang)}</>}
                  </button>
                </div>
                <pre className="text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-2xl p-4 whitespace-pre-wrap leading-relaxed font-mono">
                  {generated}
                </pre>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl p-3 mt-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">{t('docs_disclaimer', lang)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
