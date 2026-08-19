import { Template, waitForURL } from 'e2b'

export const template = Template()
  // Use an official Debian/Node base image
  .fromDockerfile(`FROM node:20-slim
RUN npm install -g serve
WORKDIR /home/user
`)
  // Scaffold the default project structure
  .runCmd('mkdir -p /home/user/pages')
  // index.html
  .runCmd(`cat > /home/user/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Welcome</h1>
  <script src="script.js"></script>
</body>
</html>
HTMLEOF`)
  // style.css
  .runCmd(`cat > /home/user/style.css << 'CSSEOF'
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f9fafb; color: #111; }
CSSEOF`)
  // script.js
  .runCmd(`cat > /home/user/script.js << 'JSEOF'
console.log('App ready');
JSEOF`)
  // Start the static server on port 3000
  .setStartCmd('serve /home/user -l 3000 --no-clipboard', waitForURL('http://localhost:3000'))
