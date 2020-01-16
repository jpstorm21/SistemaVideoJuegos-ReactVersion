import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import  { basename } from '../routes/routes.json';
import GamesListPs4Form, { EditButton, DeleteButton } from '../component/GamesListPs4Form';
import extend from 'smart-extend';
import swal from 'sweetalert';
import { saveAs } from 'file-saver';

const fields = {
  name:'',
  plataform:'',
  estado:'',
  instalado:'',
  categoria:'',
  user:''
};

@observer class GamesListPs4Page extends React.Component {
    @observable pageState = {};

   /**
   * Class constructor.
   */
  constructor (props) {
    super(props);

    // Set the initial component state.
    this.pageState = {
      GamePs4List: [],
      tableColumn: [
        {
          displayName: 'Nombre',
          columnName: 'nombrejuego'
        },
        {
          displayName: 'Plataforma',
          columnName: 'nombreplataforma'
        },
        {
          displayName: 'Categoria',
          columnName: 'nombrecategoria'
        },
        {
          displayName: 'Estado',
          columnName: 'estado'
        },
        {
          displayName: 'Instalado',
          columnName: 'instalado'
        },
        {
          displayName: 'Editar',
          columnName: 'edit',
          customComponent: EditButton,
          onClick: this.handleDialogOpen
        },
        {
          displayName: 'Eliminar',
          columnName: 'delete',
          customComponent: DeleteButton,
          onClick: this.deleteGame
        }
      ],
      dialog: {
        open: false,
        gameId: null,
        categoriaList:[],
        plataformList:[],
        data: extend.clone(fields),
        errors: extend.clone(fields)
      }
    };
    this.getCategoryList();
    this.getPlataformList();
    this.gamePs4List();
  }

  changeData = event => {
    let { name, value } = event.target;
    this.pageState.dialog.data[name] = value;
  };


  handleDialogOpen = data => () => {
    const { user } = this.props.parentState;
    this.pageState.dialog.data.user =user.userId
    this.pageState.dialog.gameId = data.idjuego;
    this.getInfoGame();
    this.pageState.dialog.open = true;
  };

  handleDialogOpenRegister  = () => {
    let data = extend.clone(fields)
    extend.keys(fields)(this.pageState.dialog.data,data);
    this.pageState.dialog.gameId = null;
    const { user } = this.props.parentState;
    this.pageState.dialog.data.user =user.userId
    this.pageState.dialog.open = true;
  };

  handleDialogClose = () => {
    let data = extend.clone(fields)
    extend.keys(fields)(this.pageState.dialog.data,data);
    this.pageState.dialog.errors = extend.keys(fields).clone(fields,this.pageState.dialog.data);
    this.pageState.dialog.open = false;
    this.pageState.dialog.gameId = null;
  };

  deleteGame = data => () =>{
    swal({
      title: `Eliminar el juego: ${data.nombrejuego}`,
      text: "¿Esta seguro que desea eliminar este juego?",
      icon: "warning",
      buttons: {
        confirm: {
            text: 'Eliminar',
            value: 'exec'
        },
        cancel: {
            text: 'Cancelar',
            value: 'cancelar',
            visible: true
        }
      }
    })
    .then(action => {
      if(action == 'exec') {
          this.eliminarJuego(data.idjuego);
      } else {
          swal.close();
      }
    })
  }

  eliminarJuego = (id) =>{
    const { user } = this.props.parentState;
    let xhr = new XMLHttpRequest();
    xhr.open('delete',`${basename}/api/deleteGame/${encodeURIComponent(id)}/${encodeURIComponent(user.userId)}`)
    xhr.responseType = 'json';
    this.props.showLoadingScreen(true);
    xhr.addEventListener('load',()=>{
      this.props.showLoadingScreen(false);
      if(xhr.status === 200){
        swal({
          title: 'Éxito',
          icon: 'success',
          text: 'Se realizó con éxito la operación',
          buttons: true
        })
        .then ( () => {
            this.gamePs4List();
        })
      }
    });
    xhr.send();
  }

  gamePs4List = () => {
    const { user } = this.props.parentState;
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/GamesByUser/${user.userId}/1`)
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      if(xhr.status === 200){
        let {data} = xhr.response;
        this.pageState.GamePs4List = data.map(g =>{
          
          if(g.estado) g.estado = "Terminado"
          else g.estado = "En juego"
             
          if(g.instalado) g.instalado = "Si"
          else g.instalado ="No"

          return g
        });
      }else{
        this.props.showScreenMessage(xhr.response.message);
      }
    })
    xhr.send()
  };

  getCategoryList =() =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/CategoryList`)
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      if(xhr.status === 200){
        let {data} = xhr.response;
        this.pageState.dialog.categoriaList = data.map(c=>{
          return {id:c.idcategoria,name:c.nombrecategoria};
        });
      }else{
        this.props.showScreenMessage(xhr.response.message);
      }
    })
    xhr.send()
  }
  
  getPlataformList =() =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/PlataformList`)
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      if(xhr.status === 200){
        let {data} = xhr.response;
        this.pageState.dialog.plataformList = data.map(c=>{
          return {id:c.idplataforma,name:c.nombreplataforma};
        });
      }else{
        this.props.showScreenMessage(xhr.response.message);
      }
    })
    xhr.send()
  }

  getInfoGame = () => {
    const { user } = this.props.parentState;
    let id = this.pageState.dialog.gameId;
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/infoGame/${id}/${user.userId}`)
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      if(xhr.status === 200){
        let {data} = xhr.response;
        extend.keys(fields)(this.pageState.dialog.data,data);
      }else{
        this.props.showScreenMessage(xhr.response.message);
      }
    })
    xhr.send()
  };

  processForm = () =>{
    event.preventDefault()
    this.props.showLoadingScreen(true);
    let formData = `data=${encodeURIComponent(JSON.stringify(this.pageState.dialog.data))}`;
    let xhr = new XMLHttpRequest();
    if (this.pageState.dialog.gameId){
      xhr.open('put',`${basename}/api/updateGame/${encodeURIComponent(this.pageState.dialog.gameId)}`);
    }else{
      xhr.open('post', `${basename}/api/insertGame`);
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load' , () => {
      this.props.showLoadingScreen(false);
      this.pageState.dialog.errors = extend.keys(fields).clone(fields, xhr.response.errors);
      if (xhr.status === 200){
        this.props.showScreenMessage(xhr.response.message);
        this.gamePs4List();
        this.handleDialogClose();
      }
    });
    xhr.send(formData);
  }

  processPdf =() =>{
    event.preventDefault()
    this.props.showLoadingScreen(true);
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/pdfps4`)
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      this.props.showLoadingScreen(false);
      if(xhr.status === 200){
        saveAs(`${basename}/api/pdfps4`);
        this.props.showScreenMessage('PDF generado exitosamente.');
      }else{
        this.props.showScreenMessage('Error al generar el PDF.');
      }
    })
    xhr.send()
  }


  render () {
    return (
      <GamesListPs4Form
        onDialogClose={this.handleDialogClose}
        openDialog={this.handleDialogOpenRegister}
        register = {this.processForm}
        onChange={this.changeData}
        pdfGenerate={this.processPdf}
        {...this.pageState}
      />
    );
  }
}

export default GamesListPs4Page;