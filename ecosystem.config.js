module.exports = {
  apps : [
    {
      name      : 'matcha',
      script    : './api/server.js',
	cwd : './api',
	'env_production': {}
    },
  ],
  deploy : {
    production : {
      user : 'robin',
      host : 'demo.km',
      ref  : 'origin/master',
      repo : 'https://github.com/rmonnier/matcha.git',
      path : '/home/robin/matcha',
      'post-deploy' : 'PATH=$PATH:/home/robin/.nvm/versions/node/v9.4.0/bin/ npm install --prefix ./api && PATH=$PATH:/home/robin/.nvm/versions/node/v9.4.0/bin/ pm2 restart ecosystem.config.js --env production'
    }
  }
};
