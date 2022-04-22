import { transformAsync } from '@babel/core';
import { readFileSync, removeSync, outputFileSync } from 'fs-extra';
import { replaceExt } from '../common';
import { getVantConfig } from '../common/constant';
import { replaceCssImportExt } from '../common/css';
import { replaceScriptImportExt } from './get-deps';
import JavaScriptObfuscator from 'javascript-obfuscator'

export function compileJs(filePath: string): Promise<undefined> {
  return new Promise((resolve, reject) => {
    let code = readFileSync(filePath, 'utf-8');

    code = replaceCssImportExt(code);
    code = replaceScriptImportExt(code, '.vue', '');

    const config = getVantConfig()

    transformAsync(code, { filename: filePath })
      .then((result) => {
        if (result) {
          const jsFilePath = replaceExt(filePath, '.js');
          removeSync(filePath);

          let resultCode = result?.code
          if (config.obfuscator) {
            const joCode = JavaScriptObfuscator.obfuscate(result?.code || '', {
              compact: false,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 1,
              numbersToExpressions: true,
              simplify: true,
              stringArrayShuffle: true,
              splitStrings: true,
              stringArrayThreshold: 1
            })
            resultCode = joCode.getObfuscatedCode()
          }
          
          outputFileSync(jsFilePath, resultCode);
          resolve();
        }
      })
      .catch(reject);
  });
}
