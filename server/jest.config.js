module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/jest.config.js/**',
    '!**/index.js**',
    '!**/coverage/**',
    '!**/app/index.js**',
    '!**/env/index.js**',
    '!**/middlewares/index.js**',
    '!**/resource/database/**',
    '!**/resource/index.js**',
    '!**/resource/repositories/index.js**',
  ],
  testEnvironment: 'node',
};
