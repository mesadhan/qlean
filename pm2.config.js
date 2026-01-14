module.exports = {
  apps: [
    {
      name: "qlean",
      script: "npm",
      args: "run dev",
      cwd: "/home/ubuntu/qlean",
      
      autorestart: true,
      watch: false,
      restart_delay: 5000,

      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
