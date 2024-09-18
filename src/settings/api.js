export default {
  baseUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : 'https://api.lunegravacoes.com.br'
}
