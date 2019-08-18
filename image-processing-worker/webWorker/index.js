console.log('image-processing-worker');

import '../codecs/mozjpeg_enc';

onmessage = function(e) {
  console.log('Worker: Message received from main script', JSON.stringify(e.data));
  postMessage('Please write two numbers');
}