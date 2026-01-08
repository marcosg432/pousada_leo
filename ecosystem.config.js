module.exports = {
  apps: [{
    name: 'pousada-leo',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/pousada-leo',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    },
    error_file: '/var/www/pousada-leo/logs/err.log',
    out_file: '/var/www/pousada-leo/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork'
  }]
}
