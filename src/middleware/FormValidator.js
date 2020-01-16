import empty from 'is-empty';
import { isEmail, isInt } from 'validator';
import Rut from 'rutjs';

const validationFunctions = {};

export const validateUserForm = validationFunctions.userForm = (payload, method) => {
  let errors = {};
  let isValid = true;
  let message = '';

  if (payload) {
    if (method == 'POST') {
      let rut = new Rut(payload.rut);
      if (empty(payload.rut) || !rut.isValid) {
        isValid = false;
        errors.rut = 'Debe ingresar un rut válido';
      }
  
      if (empty(payload.password)) {
        isValid = false;
        errors.password = 'Debe ingresar una contraseña';
      }

      if (empty(payload.confirmPassword)) {
        isValid = false;
        errors.confirmPassword = 'Debe ingresar la confirmación de la contraseña';
      } else if (!empty(payload.password) && payload.password != payload.confirmPassword) {
        isValid = false;
        errors.password = 'Contraseñas no coinciden';
        errors.confirmPassword = 'Contraseñas no coinciden';
      }
    }

    if (empty(payload.name)) {
      isValid = false;
      errors.name = 'Debe ingresar un nombre de usuario';
    }

    if (empty(payload.email) || !isEmail(payload.email)) {
      isValid = false;
      errors.email = 'Debe ingresar un email válido';
    }

    if (empty(payload.phone) || !isInt(payload.phone)) {
      isValid = false;
      errors.phone = 'Debe ingresar un telefono válido';
    }

    if (empty(payload.userType)) {
      isValid=false;
      errors.userType = 'Debe seleccionar un tipo de usuario';
    }

    if (!isValid)
      message = 'Verifique los errores del formulario.';
  } else {
    isValid = false;
    message = 'Error al recibir los datos del formulario.';
  }

  return { isValid, message, errors };
};
export const validateGameForm = validationFunctions.gameForm = (payload) => {
  let errors = {};
  let isValid = true;
  let message = '';

  if (payload) {
    if (empty(payload.name)) {
      isValid = false;
      errors.name = 'Debe ingresar un nombre';
    }

    if (empty(payload.plataform) || payload.plataform == 0) {
      isValid = false;
      errors.plataform = 'Dede Seleccionar una plataforma';
    }

    if (empty(payload.estado)) {
      isValid = false;
      errors.estado = 'Debe Selecionar un estado';
    }

    if (empty(payload.instalado)) {
      isValid = false;
      errors.instalado = 'Debe Selecionar una opción';
    }

    if (empty(payload.categoria) || payload.categoria == 0) {
      isValid = false;
      errors.categoria = 'Debe Selecionar una categoria';
    }

    if (!isValid)
      message = 'Verifique los errores del formulario.';
  } else {
    isValid = false;
    message = 'Error al recibir los datos del formulario.';
  }

  return { isValid, message, errors };
};

export default validationFunctions;