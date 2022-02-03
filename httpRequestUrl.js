const httpRequestUrl = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:3000';
module.exports = httpRequestUrl