addEventListener('message', (event: MessageEvent<string>) => {
  console.log('in worker', event);
  postMessage(event.data.toUpperCase());
});
