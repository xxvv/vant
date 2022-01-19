import stylus from 'stylus';
import { readFileSync } from 'fs-extra';

const render = (source: string, filePath: string): Promise<string> => {
  return new Promise((resolve,reject) => {
    stylus.render(source, { filename: filePath }, function(err, css){
      if (err) reject(err);
      resolve(css)
    })
  })
}

export async function compileStylus(filePath: string) {
  const source = readFileSync(filePath, 'utf-8');
  const css = await render(source, filePath);

  return css;
}
