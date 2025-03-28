# Bad-IceCream
Repo for Bad-IceCream 

### To create this scaffold, I used the following command:
_Powershell Windows 11_
``` powershell
mkdir src; cd ./src;  mkdir 'controllers', 'services', 'routes', 'plugins', 'utils', 'schemas'; cd ../; mkdir test; cd ./test; mkdir 'controllers', 'services', 'routes'; cd ../;
```
### Structure

```
├── src/
│   ├── controllers/      # Controllers to handle routes and logic
│   ├── services/         # Business logic and services (e.g., interacting with databases)
│   ├── routes/           # API route definitions
│   ├── plugins/          # Fastify plugins (e.g., JWT, CORS, etc.)
│   ├── utils/            # Helper utilities and functions
│   ├── schemas/          # Validation schemas (e.g., using Fastify's schema system)
├── test/                 # Unit and integration tests
│   ├── controllers/      # Tests for controllers
│   ├── services/         # Tests for services
│   └── routes/           # Tests for routes
```

Other examples of how to setup the scaffolding : [Effortless File Structure Setup for Node.js Fastify Projects](https://mbebars.medium.com/effortless-file-structure-setup-for-node-js-fastify-projects-481561df51a1)

### Docker Implementation

To run this project with local redis instance, you have to start docker (you can run it with [Docker Desktop](https://www.docker.com/products/docker-desktop/)).

Then open a powershell terminal in the `The-Matrix-Back` directory.
Run the command:

```
docker-compose up
```

It will run the docker image of redis.

You can stop the redis instance with:
```
Crl + C
```
