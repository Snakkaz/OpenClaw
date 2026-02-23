module.exports = {
  apps: [
    {
      name: "petersen-digital",
      script: "./node_modules/.bin/next",
      args: "start",
      cwd: "/opt/petersen-digital",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/var/log/petersen-digital/error.log",
      out_file: "/var/log/petersen-digital/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
