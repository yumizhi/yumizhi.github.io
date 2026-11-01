import {spawn} from 'node:child_process';
import fs from 'node:fs';
// Translate the managed preview daemon's Vite-shaped flags for actual Next.js.
// A built export is served for final preview; ordinary `npm run dev` runs Next.
const args=process.argv.slice(2);let host='0.0.0.0',port=process.env.PORT||'3000';
for(let i=0;i<args.length;i++){if(args[i]==='--host'||args[i]==='--hostname')host=args[++i];else if(args[i]==='--port')port=args[++i];}
const useExport=args.includes('--strictPort')&&fs.existsSync('out/index.html');
const command=useExport?['node_modules/serve/build/main.js','out','--listen',`tcp://${host}:${port}`,'--no-clipboard']:['node_modules/next/dist/bin/next','dev','--hostname',host,'--port',port];
const child=spawn(process.execPath,command,{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
