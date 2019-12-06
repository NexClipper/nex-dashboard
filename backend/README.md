# How to run (production-docker)

1. Make docker image : `docker build --tag nexclipper/nex-dashboard-backend:0.3.0 .`
2. Run docker container : `docker run --name nex-dashboard-backend -p 8080:8080 nexclipper/nex-dashboard-backend:0.3.0`

# How to run (development)

1. Install node.js LTS. (https://nodejs.org/en/download/package-manager/)
2. Project install : `npm i`
3. Add api environment variable
4. Project run : `npm run dev`
