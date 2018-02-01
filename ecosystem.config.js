module.exports = {
  apps : [
    {
      name      : 'matcha',
      script    : './api/server.js',
	cwd : './api'
    },
  ],
  deploy : {
    production : {
      user : 'robin',
      host : 'demo.km',
      ref  : 'origin/master',
      repo : 'https://github.com/rmonnier/matcha.git',
      path : '/home/robin/matcha',
      'post-deploy' : 'PATH=$PATH:/home/robin/.nvm/versions/node/v9.4.0/bin/:/home/robin/.nvm/versions/node/v9.4.0/bin/ npm install && pm2 restart ecosystem.config.js --env production'
    }
  }
};
