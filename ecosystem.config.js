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
      'post-deploy' : 'source /home/robin/.bashrc && npm install && pm2 restart ecosystem.config.js --env production'
    }
  }
};
