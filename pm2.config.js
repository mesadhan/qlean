module.exports = {
  apps: [
    {
      name: "qlean-dev",
      script: "npm",
      args: "run dev",
      cwd: "/home/ubuntu/services/qlean",
      
      autorestart: true,
      watch: false,
      restart_delay: 5000,

      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
