// export const API_ROOT = 'http://localhost:8017'
let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
} else if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-7149.onrender.com'
}
export const API_ROOT = apiRoot
