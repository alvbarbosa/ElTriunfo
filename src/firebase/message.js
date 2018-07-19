export const errFirebase = code => {
  let mess = ""
  switch (code) {
    case "auth/invalid-email":
      mess = "Correo Electronico invalido"
      break;
    case "auth/user-not-found":
      mess = "No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado."
      break;
    case "auth/email-already-in-use":
      mess = "El correo electronico ya esta en uso."
      break;
    case "auth/weak-password":
      mess = "La contraseña no es lo suficientemente fuerte"
      break;
    case "auth/user-disabled":
      mess = "El usuario esta deshabilitado"
      break;
    case "auth/wrong-password":
      mess = "La contraseña no es válida para el correo electrónico dado."
      break;
    default:
      console.log(code);
      mess = "Error en el servidor"
      break;
  }
  return mess
}