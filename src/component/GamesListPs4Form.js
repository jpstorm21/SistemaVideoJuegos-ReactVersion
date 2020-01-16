import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CreateIcon from '@material-ui/icons/Create';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import DynamicTable from './DynamicTable';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import empty from 'is-empty';
import CustomSelect from './CustomSelect';

export const EditButton = ({ rowData,metadata }) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={metadata.onClick(rowData)}
    >
      Editar
      <CreateIcon/>
    </Button>
); 

export const DeleteButton = ({ rowData,metadata }) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={metadata.onClick(rowData)}
    >
      Eliminar
      <Delete/>
    </Button>
); 

const Ps4FormModal = observer(({
  open,
  onClose,
  gameId,
  onSubmit,
  data,
  errors,
  onChange,
  categoriaList,
  plataformList
}) =>(
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="lg"
    fullWidth
  >
    <DialogTitle>
      {gameId == null ? 
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
        >
        Nuevo Juego PS4
        </Typography>
        :
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
        >
        Edición Juego PS4
        </Typography>
        }
    </DialogTitle>

    <DialogContent>
      <div className="row">
        <div className="col-12 col-md-9">
          <TextField 
            id="name"
            name = "name"
            label="Nombre del Juego"
            margin="dense"
            variant="outlined"
            helperText={errors.name}
            error={!empty(errors.name)}
            value={data.name}
            onChange={onChange}
            fullWidth
            required
          />
        </div>
        <div className="col-12 col-md-3">
          <CustomSelect
            id="plataform"
            name="plataform"
            label="Plataforma"
            options={plataformList}
            value={data.plataform}
            onChange={onChange}
            error={!empty(errors.plataform)}
            helperText ={errors.plataform}
            margin="dense"
            withBorder
            fullWidth
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-4">
          <CustomSelect
              id="estado"
              name="estado"
              label="Estado"
              options={[{name:'Terminado',id:true},{name:'En Progreso',id:false}]}
              value={data.estado}
              onChange={onChange}
              error={!empty(errors.estado)}
              helperText ={errors.estado}
              margin="dense"
              withBorder
              fullWidth
          />
        </div>
        <div className="col-12 col-md-4">
          <CustomSelect
            id="categoria"
            name="categoria"
            label="Categoria"
            options={categoriaList}
            value={data.categoria}
            onChange={onChange}
            error={!empty(errors.categoria)}
            helperText={errors.categoria}
            margin="dense"
            withBorder
            fullWidth
          />
        </div>
        <div className="col-12 col-md-4">
          <CustomSelect
              id="instalado"
              name="instalado"
              label="Instalado Si o No"
              options={[{name:'Si',id:true},{name:'No',id:false}]}
              value={data.instalado}
              onChange={onChange}
              error={!empty(errors.instalado)}
              helperText ={errors.instalado}
              margin="dense"
              withBorder
              fullWidth
          />
        </div>
      </div>
    </DialogContent>

    <DialogActions>
      <Button
        className="ml-auto"
        variant="contained"
        color="secondary"
        type="submit"
        onClick={onSubmit}
      >
        {gameId == null ? 'Registrar':'Actualizar'}
      </Button>
    </DialogActions>
  </Dialog>
));

const GameListPs4Form = observer(({ 
  GamePs4List, 
  tableColumn,
  onDialogClose,
  dialog,
  openDialog,
  register,
  onChange,
  pdfGenerate
}) => (
  <Fragment>
    <Card className="py-3 px-4">
      <CardHeader
        title={
          <Typography
            variant="h5"
            color="primary"
            gutterBottom
          >
            Lista de Juegos PS4
          </Typography>
        }
        disableTypography
      />

      <CardContent>
        <DynamicTable
          id="gamePs4List"
          name="gamePs4List"
          results={GamePs4List}
          columnMetadata={tableColumn}
        />
      </CardContent>

      <CardActions>
        <Button
          className="mr-auto bg-info"
          variant="contained"
          color="secondary"
          onClick={pdfGenerate}
        >
          Generar Reporte
          <PictureAsPdfIcon/>
        </Button>
        <Button
          className="ml-auto"
          variant="contained"
          color="secondary"
          onClick={openDialog}
        >
          Agregar Juego
          <AddIcon/>
        </Button>
      </CardActions>
    </Card>

    <Ps4FormModal
        onClose={onDialogClose}
        onSubmit={register}
        onChange={onChange}
        {...dialog}
    />
  </Fragment>
));

GameListPs4Form.propTypes = {
    GamePs4List: PropTypes.array.isRequired
};

export default GameListPs4Form;