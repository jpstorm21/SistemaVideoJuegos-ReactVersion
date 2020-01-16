CREATE TABLE session (
  sid VARCHAR NOT NULL,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,

  CONSTRAINT pk_session PRIMARY KEY (sid)
);

CREATE TABLE menu_group (
  id serial NOT NULL,
  text VARCHAR,
  menu_order INTEGER,

  CONSTRAINT "pk_menuGroup" PRIMARY KEY (id)
);

CREATE TABLE system_page (
  id serial NOT NULL,
  text VARCHAR,
  link VARCHAR,
  icon VARCHAR,

  CONSTRAINT "pk_systemPage" PRIMARY KEY (id)
);

CREATE TABLE user_type (
  id VARCHAR,
  name VARCHAR,

  CONSTRAINT "pk_userType" PRIMARY KEY (id)
);

CREATE TABLE "user" (
  id SERIAL,
  user_id VARCHAR,
  user_type_id VARCHAR,
  name VARCHAR,
	email VARCHAR,
  phone VARCHAR,
  password_hash VARCHAR,
  password_salt VARCHAR,

  CONSTRAINT pk_user PRIMARY KEY (id),
  CONSTRAINT "fk_user_userType" FOREIGN KEY (user_type_id) REFERENCES user_type (id),
  CONSTRAINT uq_user UNIQUE (user_id)
);

CREATE TABLE user_permission (
  user_type_id VARCHAR NOT NULL,
  system_page_id INTEGER NOT NULL,
  menu_group_id INTEGER,
  in_menu boolean DEFAULT false,
  menu_order INTEGER,

  CONSTRAINT "pk_userPermission" PRIMARY KEY (user_type_id, system_page_id),
  CONSTRAINT "fk_userPermission_menuGroup" FOREIGN KEY (menu_group_id) REFERENCES menu_group (id),
  CONSTRAINT "fk_userPermission_systemPage" FOREIGN KEY (system_page_id) REFERENCES system_page (id),
  CONSTRAINT "fk_userPermission_userType" FOREIGN KEY (user_type_id) REFERENCES user_type (id)
);

------------------------------------------------------------------------------------------------

-- DATA INSERTS
INSERT INTO user_type (id, name) VALUES ('ADM', 'Administrador');
INSERT INTO user_type (id, name) VALUES ('USR', 'Usuario');

INSERT INTO "user" (id, name) VALUES (0, 'Sistema');

INSERT INTO menu_group (id, text, menu_order) VALUES (1, 'Configuraciones', 9999);
SELECT pg_catalog.setval('menu_group_id_seq', 1, TRUE);

INSERT INTO system_page (id, text, link, icon) VALUES (1, 'Inicio', '/', 'home');
SELECT pg_catalog.setval('system_page_id_seq', 1, TRUE);

INSERT INTO user_permission (user_type_id, system_page_id, menu_group_id, in_menu, menu_order) VALUES ('ADM', 1, NULL, TRUE, 1);
INSERT INTO user_permission (user_type_id, system_page_id, menu_group_id, in_menu, menu_order) VALUES ('USR', 1, NULL, TRUE, 1);


--DB 



create table categoria (
    nombrecategoria varchar,
    idcategoria serial,
    primary key (idcategoria) 
);

create table plataforma(
    idplataforma serial,
    nombreplataforma varchar,
    primary key (idplataforma)
);

create table juegos(
    idjuego serial,
    nombrejuego varchar,
    idcategoria int,
    primary key (idjuego),
    foreign key (idcategoria) references categoria(idcategoria)
); 


create table usuarioJuego(
    idjuego int,
    estado boolean,
    nombreusuario varchar,
    instalado boolean,
    primary key (nombreusuario,idjuego),
    foreign key (nombreusuario) references  "user"(user_id),
    foreign key (idjuego) references juegos(idjuego)
);

create table plataformajuego(
    idjuego int,
    idplataforma int,
    primary key (idjuego,idplataforma),
    foreign key (idjuego) references juegos(idjuego),
    foreign key(idplataforma) references plataforma(idplataforma)
);



--INSERTS

INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (1,'stars wars batlefront',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(1,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(1,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (2,'resident evil revelations 2',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(2,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(2,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (3,'the evil whitin',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(3,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(3,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (4,'dragon ball xenverse',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(4,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(4,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (5,'gta v',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(5,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(5,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (6,'ac unity',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(6,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(6,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (7,'nba 2k15',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(7,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(7,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (8,'litle big planet 3',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(8,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(8,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (9,'fifa 15',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(9,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(9,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (10,'the last of us',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(10,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(10,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (11,'god of war 3',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(11,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(11,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (12,'bloodborne',6);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(12,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(12,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (13,'naruto shippuden st4',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(13,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(13,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (14,'nba 2k16',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(14,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(14,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (15,'nba 2k18',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(15,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(15,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (16,'uncharted 4',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(16,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(16,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (17,'resident evil 5',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(17,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(17,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (18,'resident evil 6',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(18,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(18,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (19,'resident evil 4',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(19,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(19,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (20,'ratchet',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(20,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(20,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (21,'batman arkham knigth',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(21,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(21,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (22,'one piece burning blood',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(22,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(22,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (23,'nba 2k17',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(23,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(23,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (24,'dragon ball xenoverse 2',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(24,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(24,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (25,'resident evil 7',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(25,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(25,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (26,'injustice 1',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(26,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(26,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (27,'resident evil 1',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(27,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(27,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (28,'titanfall 2',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(28,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(28,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (29,'batlefield 1',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(29,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(29,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (30,'rise of the tom raider',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(30,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(30,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (31,'horizon zero dawn',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(31,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(31,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (32,'uncharted collection',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(32,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(32,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (33,'outlast',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(33,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(33,'1','19.042.481-2',false);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (34,'crash bandicoot',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(34,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(34,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (35,'shadow of mordor',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(35,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(35,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (36,'naruto sh storm trilogy',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(36,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(36,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (37,'destiny 2',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(37,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(37,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (38,'cod ghost',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(38,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(38,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (39,'kingdom hearts 1.5+2.5',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(39,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(39,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (40,'uncharted lost legacy',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(40,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(40,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (41,'shadow war',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(41,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(41,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (42,'the evil whitin 2',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(42,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(42,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (43,'cod ww2',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(43,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(43,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (44,'mortal kombat x',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(44,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(44,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (45,'worms batleground',7);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(45,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(45,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (46,'street figther v',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(46,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(46,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (47,'dragon ball figthers z',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(47,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(47,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (48,'the order 1886',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(48,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(48,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (49,'monopoly',7);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(49,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(49,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (50,'metal slug antology',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(50,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(50,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (51,'the warriors',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(51,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(51,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (52,'star wars batlefront 2',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(52,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(52,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (53,'infamous second son',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(53,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(53,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (54,'tom raider',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(54,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(54,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (55,'god of war',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(55,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(55,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (56,'plantas vs zombis 2',4);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(56,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(56,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (57,'nba 2k19',3);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(57,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(57,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (58,'marvel spiderman',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(58,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(58,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (59,'red dead redemption 2',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(59,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(59,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (60,'my hero academia',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(60,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(60,'1','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (61,'kingdom hearts 3',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(61,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(61,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (62,'resident evil 2',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(62,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(62,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (63,'resident evil revelations',1);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(63,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(63,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (64,'jump force',2);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(64,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(64,'0','19.042.481-2',true);
INSERT INTO juegos(idjuego,nombrejuego, idcategoria) VALUES (65,'the witcher 3',6);
INSERT INTO plataformajuego(idjuego,idplataforma) VALUES(65,1);
INSERT INTO usuariojuego(idjuego,estado,nombreusuario,instalado) VALUES(65,'0','19.042.481-2',true);