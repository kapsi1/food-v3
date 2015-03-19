'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
      uri: 'mongodb://konik:konik@ds039311.mongolab.com:39311/food3'
    //uri:    process.env.MONGOLAB_URI ||
    //        process.env.MONGOHQ_URL ||
    //        process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
    //        'mongodb://localhost/fooddiary'
  }
};