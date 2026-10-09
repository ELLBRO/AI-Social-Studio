import subprocess
from dotenv import dotenv_values

env = dotenv_values('.env')
vars_to_sync = [
    'DATABASE_URL',
    'SECRET_KEY',
    'JWT_SECRET_KEY',
    'ENCRYPTION_KEY',
    'APP_NAME',
    'APP_URL',
    'API_URL',
    'DEFAULT_AI_PROVIDER',
    'DEFAULT_VIDEO_PROVIDER',
    'CORS_ORIGINS'
]

for k in vars_to_sync:
    val = env.get(k)
    if val:
        print(f"Adding {k}...")
        cmd = [
            "cmd.exe", "/c",
            "vercel", "env", "add", k, "production",
            "--value", val,
            "--force",
            "--yes",
            "--project", "ai-social-studio-cxkr",
            "--cwd", "C:\\Users\\HP\\.gemini"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"Successfully added {k}")
        else:
            print(f"Error adding {k}: {res.stderr or res.stdout}")
