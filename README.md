# 🎬 Movie App

Полноценное SPA-приложение для поиска фильмов, актеров и управления избранным.  
Проект построен на React + TMDB API с нормальной архитектурой, а не учебной помойкой.

---

## 🚀 Features

### 🔍 Movies
- Поиск фильмов (debounce)
- Фильтрация:
  - по жанру
  - по году
  - по рейтингу
- Пагинация
- Trending секция

---

### ❤️ Favorites
- Добавление/удаление фильмов
- Persist через Zustand (localStorage)
- Отдельная страница избранного

---

### 🎭 Actors
- Список популярных актеров
- Поиск актеров
- Пагинация
- Страница актера:
  - биография
  - фильмы
  - базовая информация

---

### 🎬 Movie Details
- Полная информация о фильме
- Cast (актеры)
- Similar Movies
- Recommendations (умный алгоритм)
- Trailer (YouTube modal)

---

### 🧠 UX / UI
- Debounced search
- Search history
- Custom Select
- Responsive layout
- Skeleton loaders
- Dark theme

---

## 🧱 Tech Stack

- React
- React Router
- Zustand (persist)
- Tailwind CSS
- TMDB API
- Vite

---

## 📦 Installation

```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
npm install
```

## 🔑 Environment Variables
Создай .env файл:

```bash
VITE_TMDB_API_KEY=your_tmdb_token
```

## 🧪 Development

```bash
npm run dev
```

## 🏗 Build
```bash
npm run build
```
