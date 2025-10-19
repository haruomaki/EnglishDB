import { defineConfig } from 'vite'

export default defineConfig({
    base: '/EnglishDB', // これを追加！
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                flashcard: "flashcard.html",
            },
        },
    },
})
