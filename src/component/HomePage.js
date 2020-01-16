import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import  { basename } from '../routes/routes.json';
import Typography from '@material-ui/core/Typography';

@observer class HomePage extends React.Component {
  @observable pageState = {};

  constructor (props) {
    super(props);
    this.pageState = {
      data: {
        "ps4terminados": "",
        "ps4noterminados": "",
        "switchterminados": "",
        "switchnoterminados": "",
        "cantjuegosps4": "",
        "cantjuegosswitch": "",
        "cantjuegos": ""
      }
    };
    this.sumaryData();
  }

  sumaryData = () =>{
    const { user } = this.props.parentState;
    let xhr = new XMLHttpRequest();
    xhr.open('get',`${basename}/api/sumaryGames/${user.userId}`);
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
      if(xhr.status === 200){
        let {data} =  xhr.response;
        this.pageState.data= data;
      }else{
        this.props.showScreenMessage(xhr.response.message);
      }
    });
    xhr.send();
  }


  render () {

    return (
      <Card className="py-3 px-4">
        <CardHeader
          className="text-center"
          title="Sistema Administración de VideoJuegos"
          subheader="Desarrollado por Juan Pablo Martínez Romero"
        />
        <div class="col-md-12 mb-3" id="panelPrincipal">
          <div class="card">
              <div class="card-header mb-2"><Typography variant="h6"><strong>Resumen general</strong></Typography></div>
                <div class="body">
                  <div class="col-sm-12">
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de Total de juegos: {this.pageState.data.cantjuegos}</strong>} 
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de Total de juegos Playstation 4: {this.pageState.data.cantjuegosps4}</strong>} 
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de Total de juegos Nintendo Switch : {this.pageState.data.cantjuegosswitch}</strong>}
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de juegos terminados Playstation 4: {this.pageState.data.ps4terminados}</strong>}
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de juegos por terminar Playstation 4: {this.pageState.data.ps4noterminados}</strong>}
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de juegos terminados Nintendo Switch: {this.pageState.data.switchterminados}</strong>}
                    </Typography>
                    <Typography variant="body1" gutterBottom paragraph>
                      {<strong>Cantidad de juegos por terminar Nintendo Switch: {this.pageState.data.switchnoterminados}</strong>}
                    </Typography>
                  </div>
                </div>
          </div> 
        </div>  
      </Card>
    )
  }
}

export default HomePage;