import { execSync } from "node:child_process"

function run(...commands) {
    execSync(commands.join(' && '), {
        stdio: 'inherit'
    })
}

run(
    'git submodule init',
    'git submodule update',
    'cd Inwose-server',
    'npm ci',
    'cd zavod/web && npx tsc && cd ../..',
    'cd zavod/pulse && npx tsc && cd ../..',
    'cd server && npm run build'
)
