const mongoose = require('mongoose');

const databaseConnection = () => {
    // connection 
    mongoose.connect(process.env.URL)
        .then(data => {
            // if connected 
            console.log(`you are connected to the database`);
        })

}


module.exports = databaseConnection;