// worker.js（worker线程）
self.addEventListener('message', e => {
    setInterval(function() {
        console.log(e.data);
        self.postMessage('success from Worker.js');
    }, 20);

});