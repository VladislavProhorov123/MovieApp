# Movie App (React + TMDB API)

Современное React приложение для поиска и просмотра фильмов с использованием TMDB API.  
Проект сделан для практики реальных фронтенд задач: работа с API, состояние, фильтрация, избранное, маршрутизация.

---

## 🚀 Стек

- React (Vite)
- React Router
- Zustand (state management)
- Tailwind CSS
- TMDB API
- LocalStorage (persist)
- JavaScript (JSX)

---

## 🎬 Основной функционал

### 📌 Главная страница
- список популярных фильмов
- поиск фильмов (debounce)
- пагинация
- фильтры:
  - сортировка (popular / top rated / newest)
  - жанры
  - год выпуска
- trending секция

---

### 📄 Страница фильма (MovieDetails)
- backdrop как hero фон с затемнением
- постер фильма
- рейтинг
- длительность
- бюджет
- дата выхода
- жанры
- описание
- актёры (grid)
- похожие фильмы (кликабельные карточки)
- переход на другой фильм без перезагрузки
- кнопка назад

---

### ❤️ Избранное (Favorites)
- добавление / удаление фильмов
- Zustand store + persist (localStorage)
- отдельная страница избранного
- отображение карточек фильмов
- кнопка назад
- пустое состояние

---

## 🧠 Архитектура проекта
- src/
- api/ # TMDB API endpoints и конфиг
components/ # UI компоненты (MovieCard, Search, Select, Spinner)
- pages/ # Home, MovieDetails, Favorites
- store/ # Zustand (favorites store)
- hook/ # useDebounce

---

## 🔑 API (TMDB)

Проект использует The Movie Database API.

Сайт:
https://www.themoviedb.org/

---

### 📦 .env файл

Создай файл `.env`: VITE_TMDB_API_KEY=your_api_key

---

## ▶️ Запуск проекта

### Установка зависимостей

```bash
npm install
npm run dev