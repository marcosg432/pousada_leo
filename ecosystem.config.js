module.exports = {
  apps: [{
    name: 'pousada-leo',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3006',
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Configurações adicionais
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
}

