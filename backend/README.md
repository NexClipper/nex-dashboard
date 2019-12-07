# How to run (production)

1. Install node.js LTS. (https://nodejs.org/en/download/package-manager/)
2. Project install : `npm i`
3. Project run : `npm run start`

# How to run (production-docker)

1. Make Docker image : `docker build --tag nexclipper/nex-dashboard-backend:0.3.0 .`
2. Run Docker image : `docker run --name nex-dashboard-backend-instance -p 3065:3065 -d nexclipper/nex-dashboard-backend:0.3.0`

# How to run (development)

1. Install node.js LTS. (https://nodejs.org/en/download/package-manager/)
2. Project install : `npm i`
3. Add api environment variable
4. Project run : `npm run dev`
