# How to run (production-docker)

1. `export REACT_APP_API_URL_PROD=${your production server api}`
2. `docker-compose -f docker-compose.yml up -d --build`

# How to run (development)

1. Install node.js LTS. (https://nodejs.org/en/download/package-manager/)
2. Project install : `npm i`
3. Add api environment variable (https://create-react-app.dev/docs/adding-custom-environment-variable)
4. Project run : `npm run start`
