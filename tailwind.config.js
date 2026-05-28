/** @type {import('tailwindcss').Config} */

module.exports = {

  content: [
    "./src/**/*.{html,ts}",
  ],

  theme: {

    extend: {

      colors: {

        primario: '#1F6E43',

        secundario: '#2E8B57',

        verdeSuave: '#DFF5E8',

        fondo: '#F7FAF8',

        texto: '#374151',

        alerta: '#DC2626'

      },

      boxShadow: {

        suave: '0 4px 20px rgba(0,0,0,0.05)',

        card: '0 8px 30px rgba(0,0,0,0.06)'

      },

      borderRadius: {

        premium: '24px'

      }

    }

  },

  plugins: []

}