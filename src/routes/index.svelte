<script>
  if (window.Worker) {
    const imageProcessingWorker = new Worker('./image-processing-worker.js');
    imageProcessingWorker.postMessage([21, 31]);
    imageProcessingWorker.onmessage = function(e) {
      console.log(`Received: ${e.data}`);
    }
  }
</script>