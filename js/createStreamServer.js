const http = require('http');

module.exports = function cerateStreamServer(stream, port = 8888, host) {
  let server
  const requestListener = function (req, res) {
    console.log('Received request', req)
    res.status = 200
    if (req.method === 'HEAD') {
      return res.end()
    }
    res.writeHead(200, {
      'Content-Type': 'video/webm',
      //'Content-Disposition': 'attachment'
    });
    stream.pipe(res)
  }
  
  server = http.createServer(requestListener);
  server.listen(port, () => {
    console.log('Server listening at ' + 'http://' + server.address().address + ':' + port)
  });
  return server
}