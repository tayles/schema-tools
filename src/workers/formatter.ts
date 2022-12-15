import parserBabel from 'prettier/esm/parser-babel.mjs';
import prettier from 'prettier';

addEventListener('message', (event: MessageEvent<string>) => {
  const formatted = prettier.format(event.data, {
    semi: false,
    filepath: 'x.json',
    // parser: 'babel',
    plugins: [parserBabel],
  });
  // console.log('in worker', event, formatted);

  postMessage(formatted);
});
