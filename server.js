const app = require('./app');
const dotEnv = require('dotenv');

// handling uncought exceptions  
process.on('uncaughtException', error => {
    console.log(`Error: ${error.message}`);
    console.log(`shutting down the server due to uncought exceptions`);

    server.close(() => {
        process.exit();
    })
})

// config 
dotEnv.config({ path: './config/config.env' })

// database connection 
const databaseConnection = require('./config/databaseConnection');
databaseConnection();





const server = app.listen(process.env.PORT, () => {
    console.log(`you server is runing at port http://localhost:${process.env.PORT}`)
})


// unhandled promise rejection 
process.on('unhandledRejection', error => {
    console.log(`Error: ${error.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);

    server.close(() => {
        process.exit();
    })
})

