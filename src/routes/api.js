import Express from 'express';
import db from '../middleware/postgresApi';
import FormValidator from '../middleware/FormValidator';

const router = new Express.Router();

/**
 * Handle request with form validation.
 *
 * @param {function} preValidation - form data validation function.
 * @param {function} callback - to do after a validation success.
 * @return {function} request handler.
 */
const requestFormValidation = (preValidation, callback) => {
  return (req, res, next) => {
    if (req.body && req.body.data)
      req.body = JSON.parse(req.body.data);

    const formValidation = preValidation(req.body, req.method);

    if (formValidation.isValid)
      return callback(req, res, next);

    res.status(400).json(formValidation);
  };
};


// Return logged user information request
router.get('/userInfo', (req, res) => {
  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    userId: req.user['user_id'],
    type: req.user['user_type_id'],
  });
});
router.post('/authenticatedUser', db.getAuthenticatedUserData);

// DELETE request
router.delete('/deleteGame/:id/:user',db.deleteGame);
// GET request
router.get('/user', db.getUserList);
router.get('/user/:id', db.getUserById);
router.get('/userType', db.getUserTypeList);
router.get('/GamesByUser/:id/:plataform',db.getGamaByUser);
router.get('/CategoryList',db.getCategoryList);
router.get('/PlataformList',db.getPlataformList);
router.get('/infoGame/:id/:user',db.getInfoGame);
router.get('/sumaryGames/:id',db.sumaryGames);
router.get('/pdfps4',db.pdfPs4)
router.get('/pdfswitch',db.pdfSwitch)
// POST request
router.post('/user', requestFormValidation(FormValidator.userForm, db.insertUser));
router.post('/insertGame',requestFormValidation(FormValidator.gameForm,db.insertGame))
// PUT request
router.put('/user/:id', requestFormValidation(FormValidator.userForm, db.updateUser));
router.put('/updateGame/:id',requestFormValidation(FormValidator.gameForm,db.updateGame))
// Handle invalid URI request.
router.all('*', (req, res) => {
  res.status(404).json({ message: 'La ruta de la solicitud HTTP no es reconocida por el servidor.' });
});

export default router;