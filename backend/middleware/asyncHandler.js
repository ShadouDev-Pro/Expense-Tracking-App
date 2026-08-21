// Envuelve una función async de controlador para que, si lanza un error,
// Express lo reciba correctamente en vez de dejar la petición colgada.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;