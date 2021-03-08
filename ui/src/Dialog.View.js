import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogView = (props) => {    
  const [viewOpen, setOpen] = React.useState(false);
  const [movieDetails, setDetails] = React.useState(null)

  // Fetch movie information from the backend by given ID
  const movieGet = () => 
    fetch(props.uri)
      .then(resp => resp.json())
      .then(resp => setDetails(resp))
      .then(
        (resp) => setOpen(true),
        (error) => { window.alert('😮 Could not get movie information! It might be deleted... ?') }
      );

  // Open the movie details dialog, inform if no movies is selected
  const handleClickOpen = () => {
    setDetails(null);
    if (!props || !props.uri)
      setOpen(true);
    else movieGet();
  };

  // Create a row of information, e.g. '*Year..[spacing]..1984'
  // for the dialog
  const info = (caption, text) =>
    <div className="infoRow">
      <span className="caption">{caption}</span>
      <span className="text">{text}</span>
    </div>

  // Name of a person is 'firstName lastName' (well duh!)
  const firstLastName = (firstname, lastname) =>
    firstname + ' ' + lastname;

  // Convert name objects/arrays into name strings separated 
  // with a comma (heck of a hack!)
  const namesToInfo = (objArr) => (
    objArr instanceof Array ? 
      objArr.map(obj => (
        firstLastName(
          obj.firstName ?? '', 
          obj.lastName ?? '')))
        .join(', ') 
      : firstLastName(
          objArr.firstName ?? '', 
          objArr.lastName ?? ''
        ));
  
  // Collect all needed data and present it in the dialog
  const collectInfo = (data) => ([
    data.director !== '' ? info('Director', namesToInfo(data.director)) : '',
    data.year     !== '' ? info('Year', data.year) : '',
    data.genres   !== '' ? info('Genres', data.genres.map((genre) => genre).join(', ')) : '',
    data.actors   !== '' ? info('Actors', namesToInfo(data.actors)) : '',
    info('Age limit', data.ageLimit),
    info('Rating',    data.rating)
  ]);

  // Close the dialog
  const handleClose = () => setOpen(false);

  return (
    <div style={{display: 'inline'}}>
      <Button className="operationButton" variant="outlined" color="primary" onClick={handleClickOpen}>
        view movie details
      </Button>

      <Dialog open={viewOpen} onClose={handleClose} aria-labelledby="">
      <DialogTitle id="viewDialog"><b>{movieDetails?.name ?? 'No movie selected'}</b></DialogTitle>
        <DialogContent>
          <DialogContentText>{movieDetails?.synopsis ?? ''}</DialogContentText>

          { movieDetails ? collectInfo(movieDetails) : '' }          
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogView;