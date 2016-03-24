import expect from 'expect';
import hijack from '../dist/';
const babel = require('babel-core');
import path from 'path';

const babelOpts = {
  presets: ['es2015'],
  plugins: [
    [hijack, {
      './fixture2.js': './fixture2overrides.js',
      '**/fixture3.js': './fixture3overrides.js',
      fs: `${__dirname}/fsOverrides.js`,
    }],
  ],
};

suite('Babel-plugin-hijack tests', () => {
  test('Tests that required imports were overridden by hijack', () => {
    const parsed = babel.transformFileSync(path.resolve(__dirname, './fixture1.js'), babelOpts);
    const code = parsed.code;
    expect(code).toContain('./fixture2overrides');
    const evaledCode = eval(code); // eslint-disable-line no-eval
    expect(evaledCode.fixture2Imported()).toBe('fixture2overrides');
    expect(evaledCode.fixture2Required()).toBe('fixture2overrides');
    expect(evaledCode.fixture3()).toBe('fixture3overrides');
    expect(evaledCode.fs()).toBe('fsOverrides');
  });
});
