import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, CheckCircle, Euro, Shield, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Типи для календаря
interface TimeSlot {
  time: string;
  available: boolean;
  popular?: boolean;
}

interface CalendarDay {
  date: Date;
  available: boolean;
  slots: TimeSlot[];
}

const BookMe = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Генерація доступних днів (наступні 30 днів, виключаючи вихідні)
  const generateAvailableDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Виключаємо вихідні
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      if (!isWeekend) {
        days.push({
          date,
          available: true,
          slots: [
            { time: '09:00', available: true, popular: true },
            { time: '11:00', available: true },
            { time: '14:00', available: true, popular: true },
            { time: '16:00', available: true },
            { time: '18:00', available: true }
          ]
        });
      }
    }
    
    return days;
  };

  const [availableDays] = useState<CalendarDay[]>(generateAvailableDays());

  const handleDateSelect = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setSelectedTime(null);
    setShowPayment(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Симуляція оплати
    setTimeout(() => {
      setIsBooked(true);
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long'
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Консультацію заброньовано!</h2>
          <p className="text-gray-600 mb-6">
            Посилання на Google Meet надіслано на твою пошту. 
            Нагадування прийде за 1 годину до дзвінка.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-900">
              {selectedDate && formatDate(selectedDate)} о {selectedTime}
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Повернутися на головну
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">BOOKME</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Забронюй свою консультацію —{' '}
            <span className="text-blue-600">без зайвих повідомлень</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            30 хвилин фокусної розмови про твій Instagram, контент, рекламу чи бренд.
            <br />
            Чітко, по справі, з готовим планом на виході.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Обрати зручний час →
          </motion.button>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          id="calendar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Вибери дату та час</h2>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {availableDays.slice(0, 15).map((day, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDateSelect(day)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDate?.toDateString() === day.date.toDateString()
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-sm text-gray-500 mb-1">
                  {day.date.toLocaleDateString('uk-UA', { weekday: 'short' })}
                </div>
                <div className="font-semibold text-gray-900">
                  {formatDateShort(day.date)}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-100 pt-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Доступні години на {formatDate(selectedDate)}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                {availableDays
                  .find(day => day.date.toDateString() === selectedDate.toDateString())
                  ?.slots.map((slot, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedTime === slot.time
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {slot.popular && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          🔥
                        </div>
                      )}
                      <div className="font-semibold text-gray-900">{slot.time}</div>
                    </motion.button>
                  ))}
              </div>

              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Консультація обрана</h4>
                      <p className="text-gray-600">
                        {formatDate(selectedDate)} о {selectedTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                        <Euro className="w-6 h-6" />
                        39
                      </div>
                      <div className="text-sm text-gray-500">30 хвилин</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Shield className="w-4 h-4" />
                    <span>Оплата захищена (Stripe)</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmBooking}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Підтвердити бронювання
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Payment Modal */}
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Оплата консультації</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Дата та час:</span>
                  <span className="font-semibold">
                    {selectedDate && formatDateShort(selectedDate)} о {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Вартість:</span>
                  <span className="font-bold text-xl">39 €</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Твоя пошта"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Номер картки"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-4 border border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Скасувати
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Оплатити 39 €
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Що ти отримаєш за 30 хвилин
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Аудит Instagram / TikTok',
              'Поради по контенту, рекламі, стратегії',
              'Конкретний чек-лист на 7 днів',
              'Відповіді на твої запитання'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              🕐 Якщо не отримаєш цінності – поверну гроші без питань.
            </p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Поширені питання
          </h2>

          <div className="space-y-6">
            {[
              {
                question: 'А якщо мені потрібна година?',
                answer: 'Можеш написати мені в Telegram — зробимо персональну сесію.'
              },
              {
                question: 'Який формат дзвінка?',
                answer: 'Google Meet. Посилання отримаєш одразу після оплати.'
              },
              {
                question: 'А якщо я не можу зʼявитися?',
                answer: 'Напиши за 24 години — перенесемо. Без попередження — бронь згорає.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center"
        >
          <p className="text-orange-800 text-sm">
            ⚠️ <strong>Увага:</strong> якщо не зʼявишся — бронь не переноситься. Поважай свій і мій час.
          </p>
        </motion.div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Euro className="w-5 h-5" />
          Забронювати консультацію – 39 €
        </motion.button>
      </div>
    </div>
  );
};

export default BookMe; 