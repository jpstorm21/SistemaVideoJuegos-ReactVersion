import connection from './postgresConnection';
import { client } from '../routes/routes.json';
import User from '../models/user';
import {pdfPs4,pdfSwicth} from './pdfMake';

const functionQueries = {};

functionQueries.pdfPs4 = (req,res)=>{
  connection.any(`SELECT j.nombrejuego as nombre,c.nombrecategoria as categoria ,uj.estado,uj.instalado
                  FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                  INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                  INNER JOIN plataforma p ON p.idplataforma = pj.idplataforma
                  INNER JOIN categoria c ON c.idcategoria = j.idcategoria
                  WHERE uj.nombreusuario = $1 AND pj.idplataforma = $2`,[req.user['user_id'],1])
  .then(data => {
    pdfPs4(data)
    .then(output => res.status(200).download(output))
    .catch(err => res.status(500).json({ error: err, message: 'Error al generar el documento', datos: data }));
  })
  .catch(err => {
    res.status(400).json({
      error:err,
      message:'Error al generar el documento.'
    });
  });
}

functionQueries.pdfSwitch= (req,res)=>{
  connection.any(`SELECT j.nombrejuego as nombre,c.nombrecategoria as categoria ,uj.estado,uj.instalado
                  FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                  INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                  INNER JOIN plataforma p ON p.idplataforma = pj.idplataforma
                  INNER JOIN categoria c ON c.idcategoria = j.idcategoria
                  WHERE uj.nombreusuario = $1 AND pj.idplataforma = $2`,[req.user['user_id'],2])
  .then(data => {
    pdfSwicth(data)
    .then(output => res.status(200).download(output))
    .catch(err => res.status(500).json({ error: err, message: 'Error al generar el documento', datos: data }));
  })
  .catch(err => {
    res.status(400).json({
      error:err,
      message:'Error al generar el documento.'
    });
  });
}


functionQueries.getAuthenticatedUserData = (req, res) => {
  let user = {
    id: req.user.id,
    userId: req.user['user_id'],
    campus: req.user['campus_id'],
    name: req.user.name,
    type: req.user['user_type_id'],
  };
  let data = { type: user.type, pathname: req.body.pathname || '' };

  connection.tx(t => {
    let queries = [];

    let query = 'SELECT COUNT(*)\
                FROM user_permission INNER JOIN system_page ON user_permission.system_page_id = system_page.id\
                WHERE user_permission.user_type_id = ${type} AND system_page.link = ${pathname}';
    queries.push(t.one(query, data));

    query = 'SELECT menu_group.text, CASE WHEN menu_group.menu_order IS NULL THEN 0 ELSE menu_group.menu_order END AS menu_order,\
              json_agg(json_build_object(\'text\', system_page.text, \'link\', system_page.link, \'icon\', system_page.icon) ORDER BY user_permission.menu_order) AS link\
            FROM user_permission\
              INNER JOIN system_page ON user_permission.system_page_id = system_page.id\
              LEFT JOIN menu_group ON user_permission.menu_group_id = menu_group.id\
            WHERE user_type_id = ${type} AND in_menu\
            GROUP BY menu_group.menu_order, menu_group.text\
            ORDER BY menu_order';
    queries.push(t.any(query, data));

    return t.batch(queries);
  })
    .then(result => {
      let menu = [];

      result[1].map(row => {
        if (!row.text)
          row.link.map(menuItem => menu.push(menuItem));
        else
          menu.push(row);
      });

      let permission = [client.login, client.home, '*'].indexOf(data.pathname) != -1 || result[0].count > 0;

      res.status(permission ? 200 : 403).json({
        logged: true,
        hasPermission: permission,
        user,
        menu
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err, message: 'Error al obtener los datos del usuario.' });
    });
};


/**
 * 
 */
functionQueries.getUserById = (req, res) =>{
  let query = 'SELECT user_id as rut, user_type_id as user_type, name, email, phone FROM public.user WHERE user_id = $1';

  connection.oneOrNone(query, req.params.id)
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(400).json({
        error:err,
        message:'Error al obtener los datos del usuario.'
      });
    });
};

/**
 * 
 */
functionQueries.getUserList = (req, res) =>{
  let query = 'SELECT user_id AS rut, user_type_id AS user_type, name, email, phone FROM "user"';

  connection.any(query)
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error al obtener la lista de usuarios.'
      });
    });
};

/**
 * 
 */
functionQueries.getUserTypeList = (req, res) =>{
  connection.any('SELECT * FROM user_type')
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error al obtener la lista de tipos de usuario.'
      });
    });
};

functionQueries.getGamaByUser = (req,res) =>{
  connection.any(`SELECT j.nombrejuego,p.nombreplataforma,c.nombrecategoria,uj.estado,uj.instalado,j.idjuego
                  FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                  INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                  INNER JOIN plataforma p ON p.idplataforma = pj.idplataforma
                  INNER JOIN categoria c ON c.idcategoria = j.idcategoria
                  WHERE uj.nombreusuario = $1 AND pj.idplataforma = $2`,[req.params.id,req.params.plataform])
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Error al obtener la lista de juegos ps4 del usuario.'
      });
    });
}

functionQueries.getCategoryList =(req,res)=>{
  connection.any(`SELECT idcategoria,nombrecategoria FROM categoria`)
  .then(data => {
    res.status(200).json({ data });
  })
  .catch(err => {
    res.status(500).json({
      error: err,
      message: 'Error al obtener la lista de categorias.'
    });
  });
}

functionQueries.getPlataformList = (req,res) =>{
  connection.any(`SELECT idplataforma,nombreplataforma FROM plataforma`)
  .then(data => {
    res.status(200).json({ data });
  })
  .catch(err => {
    res.status(500).json({
      error: err,
      message: 'Error al obtener la lista de categorias.'
    });
  });
}

functionQueries.sumaryGames = (req,res) =>{
  let query = `SELECT x.ps4Terminados, y.ps4NoTerminados,z.switchTerminados,w.switchNoTerminados,k.cantjuegosPs4,m.cantjuegosSwitch,t.cantJuegos
               FROM 	(SELECT count(*) as ps4Terminados
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario = $1 AND pj.idplataforma = 1 AND uj.estado = true) x ,
                      
                      (SELECT count(*) as ps4NoTerminados
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario = $1 AND pj.idplataforma = 1 AND uj.estado = false) y ,
                      
                      (SELECT count(*) as switchTerminados
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario =  $1 AND pj.idplataforma = 2 AND uj.estado = true) z ,
                      
                      (SELECT COUNT(*) as cantJuegos
                      FROM usuariojuego uj
                      WHERE uj.nombreusuario = $1) t,
                      
                      (SELECT count(*) as switchNoTerminados
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario =  $1 AND pj.idplataforma = 2 AND uj.estado = false) w ,
                      
                      (SELECT COUNT(*) as cantjuegosPs4
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario = $1 AND pj.idplataforma = 1) k ,
                      
                      (SELECT COUNT(*) as cantjuegosSwitch
                      FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                      INNER JOIN plataformajuego pj ON j.idjuego = pj.idjuego
                      WHERE uj.nombreusuario = $1 AND pj.idplataforma = 2) m`;
  connection.one(query,req.params.id)
  .then(data => {
    res.status(200).json({ data });
  })
  .catch(err => {
    res.status(500).json({
      error: err,
      message: 'Error al obtener los reportes de los videojuegos.'
    });
  });
}

functionQueries.getInfoGame = (req,res) =>{
  let id = req.params.id;
  let user = req.params.user;
  connection.one(`SELECT j.nombrejuego as name, p.idplataforma as plataform, uj.estado,c.idcategoria as categoria,uj.instalado
                  FROM juegos j INNER JOIN usuariojuego uj ON j.idjuego = uj.idjuego
                       INNER JOIN plataformajuego pj ON pj.idjuego = uj.idjuego
                       INNER JOIN plataforma p ON p.idplataforma = pj.idplataforma
                       INNER JOIN categoria c ON c.idcategoria = j.idcategoria
                  WHERE uj.idjuego = $1 AND uj.nombreusuario = $2`,[id,user])
  .then(data => {
    res.status(200).json({ data });
  })
  .catch(err => {
    res.status(500).json({
      error: err,
      message: 'Error al obtener los datos del juego seleccionado.'
    });
  });
}

functionQueries.insertUser = (req, res) =>{
  User.register(
    {
      user_id: req.body.rut,
      user_type_id: req.body.userType,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    },
    req.body.password,
    err => {
      if (err) {
        let error = 'No se pudo procesar el formulario.';
        if (err.message.indexOf('User already exists') !== -1) {
          error = 'El usuario ingresado ya existe.'
        }

        return res.status(400).json({
          success: false,
          message: error,
          error: err.message
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Usuario ingresado con correctamente.'
        });
      }
    }
  );
};

functionQueries.insertGame = (req,res) => {
  let id;
  connection.tx(t =>{
    return t.sequence((order,data)=>{
      if(order == 0){
        let queryData = {
          nombrejuego: req.body.name,
          idcategoria: req.body.categoria
        }
        let query = 'INSERT INTO juegos (${this~}) VALUES(${nombrejuego},${idcategoria}) RETURNING idjuego';
        return t.one(query,queryData)
      }
      if(order == 1){
        id = data.idjuego
        let queryData = {
          idjuego : data.idjuego,
          estado : req.body.estado,
          nombreusuario: req.body.user,
          instalado: req.body.instalado
        }
        let query = 'INSERT INTO usuariojuego (${this~}) VALUES(${idjuego},${estado},${nombreusuario},${instalado})';
        return t.none(query,queryData)
      }
      if(order == 2){
        let queryData = {
          idjuego: id,
          idplataforma:req.body.plataform
        }
        let query = 'INSERT INTO plataformajuego(${this~}) VALUES (${idjuego},${idplataforma})';
        return t.none(query,queryData)
      }
    })
  })
  .then(() => {
    res.status(200).json({ success: true,
      message: 'Juego ingresado correctamente.' });
  })
  .catch(err => {
    res.status(400).json({
      error:err,
      message:'Error al ingresar el juego.'
    });
  });
};

functionQueries.updateGame = (req,res) =>{
  connection.tx(t =>{
    return t.sequence((order,data)=>{
      if(order == 0){
        let queryData = {
          nombrejuego: req.body.name,
          idcategoria: req.body.categoria,
          id:req.params.id
        }
        let query = 'UPDATE juegos SET nombrejuego = ${nombrejuego}, idcategoria = ${idcategoria} WHERE idjuego = ${id}';
        return t.none(query,queryData)
      }
      if(order == 1){
        let queryData = {
          idjuego : req.params.id,
          estado : req.body.estado,
          nombreusuario: req.body.user,
          instalado: req.body.instalado
        }
        let query = 'UPDATE usuariojuego SET estado = ${estado}, instalado = ${instalado} WHERE idjuego = ${idjuego} AND nombreusuario = ${nombreusuario}';
        return t.none(query,queryData)
      }
      if(order == 2){
        let queryData = {
          idjuego: req.params.id,
          idplataforma:req.body.plataform
        }
        let query = 'UPDATE plataformajuego SET idplataforma = ${idplataforma} WHERE idjuego = ${idjuego}';
        return t.none(query,queryData)
      }
    })
  })
  .then(() => {
    res.status(200).json({ success: true,
      message: 'Juego actualizado correctamente.' });
  })
  .catch(err => {
    res.status(400).json({
      error:err,
      message:'Error al actualizar el juego.'
    });
  });
};

functionQueries.updateUser = (req, res) =>{
  connection.tx(t => {
    let queryData = {
      user_id: req.params.id,
      name: req.body.name,
      user_type_id: req.body.userType,
      email: req.body.email,
      phone: req.body.phone
    };
    let query = 'UPDATE "user"\
                SET user_type_id = ${user_type_id}, name = ${name}, email = ${email}, phone = ${phone}\
                WHERE user_id = ${user_id}';

    return t.none(query, queryData);
  })
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      res.status(400).json({
        error:err,
        message:'Error al actualizar los datos del usuario.'
      });
    });
};

functionQueries.deleteGame = (req,res) =>{
  connection.tx(t =>{
    return t.sequence((order,data)=>{
      if(order == 0){
        let queryData = {
          idjuego: req.params.id,
        }
        let query = 'DELETE FROM plataformajuego WHERE idjuego = ${idjuego}';
        return t.none(query,queryData)
      }
      if(order == 1){
        let queryData = {
          idjuego : req.params.id,
          nombreusuario: req.params.user,
        }
        let query = 'DELETE FROM usuariojuego WHERE idjuego = ${idjuego} AND nombreusuario = ${nombreusuario}';
        return t.none(query,queryData)
      }
      if(order == 2){
        let queryData = {
          id:req.params.id
        }
        let query = 'DELETE FROM juegos WHERE idjuego = ${id}';
        return t.none(query,queryData)
      }
    })
  })
  .then(() => {
    res.status(200).json({ success: true,
      message: 'Juego eliminado correctamente.' });
  })
  .catch(err => {
    res.status(400).json({
      error:err,
      message:'Error al eliminar el juego.'
    });
  });
}


export default functionQueries;