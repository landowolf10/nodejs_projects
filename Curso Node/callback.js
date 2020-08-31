let getUsuarioByID = (id, callback) => {
    let usuario = {
        nombre: 'Orlando',
        id
    }

    if (id === 20)
        callback(`El usuario con id ${id} no existe en la BD`);
    else
        callback(null, usuario);
}

getUsuarioByID(1, (err, usuario) => {
    if (err)
        return console.log(err);

    console.log('Usuario de base de datos', usuario);
})