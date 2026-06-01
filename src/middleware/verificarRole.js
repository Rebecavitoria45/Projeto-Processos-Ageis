function verificaRole(rolesPermitidas = []) {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.role) {
      return res.status(403).json({ msg: 'Acesso negado: papel do usuário não identificado.' });
    }

    const hasPermission = rolesPermitidas.includes(req.usuario.role);
    if (!hasPermission) {
      return res.status(403).json({ msg: 'Acesso negado: permissão insuficiente.' });
    }

    next();
  };
}

module.exports = verificaRole;