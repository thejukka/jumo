import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DialogEdit = (props) => {    
  const classes = useStyles;
  const [viewOpen, setOpen] = React.useState(false);
  const [age,       setAge]      = React.useState(0);
  const [rating,    setRating]   = React.useState(1);
  const [movieName, setName]     = React.useState('');
  const [synopsis,  setSynopsis] = React.useState('');
  const [actors,    setActors]   = React.useState('');
  const [director,  setDirector] = React.useState('');
  const [genres,    setGenres]   = React.useState('');
  const [year,      setYear]     = React.useState('');
  
  // Update the movies list when ready:
  const [items,     setItemData] = React.useState({data: props.list});

  const handleAge = (evt) =>
    setAge(evt.target.value);
  const handleRate = (evt) =>
    setRating(evt.target.value);  
  const handleName = (evt) =>
    setName(evt.target.value);  
  const handleSynopsis = (evt) =>
    setSynopsis(evt.target.value);  
  const handleDirector = (evt) =>
    setDirector(evt.target.value);  
  const handleActors = (evt) =>
    setActors(evt.target.value);  
  const handleGenres = (evt) =>
    setGenres(evt.target.value);   
  const handleYear = (evt) =>
    setYear(evt.target.value);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Lazy man's (that's me!) name object creation
  const meddleName = (name) => {
    if (name.indexOf(' ') === -1)
      return name.trim();
    const nameArr = name.trim().split(' ');
    let result = { firstName: nameArr[0].trim(), lastName: ''}
    for (let i=1; i < nameArr.length; i++)
      result.lastName += nameArr[i].trim();
    return result;
  };

  // Upload the movie data and refresh the list
  const sendMovieData = () =>
    fetch(props.uri, { method: "POST", body: JSON.stringify(formBody())})
      .then(resp => resp.json())
      .then((resp) => {
        setItemData({ data: { ...items.data, resp }});
        handleClose();
      })

  const formBody = () => ({
    name: movieName,
    year: year,
    synopsis: synopsis,
    genres: genres !== '' ? genres.split(',').map(str => str.trim()) : '',
    ageLimit: age,
    rating: rating,
    actors: actors !== '' ? actors.split(',').map(actor => meddleName(actor)) : '',
    director: meddleName(director)  
  });

  const handleSend = () => {
    if (!movieName || movieName.trim() === '') {
      window.alert("☝️ At least movie name must be given");
    } else {
      sendMovieData();
      handleClose();
    }
  }

  // Close the dialog
  const handleClose = () => setOpen(false);

  return (
    <div style={{display: 'inline'}}>
      <Button className={classes.formControl} variant="outlined" color="primary" onClick={handleClickOpen}>
        add movie
      </Button> 

      <Dialog open={viewOpen} onClose={handleClose} maxWidth="xs">
      <DialogTitle id="form-dialog-title"><b>Add a movie</b></DialogTitle>
        <DialogContent>
          <form id="movieAddForm" noValidate autoComplete="off">
            <TextField 
              onChange={handleName} 
              id="name" 
              label="Movie name" 
              value={movieName}
              fullWidth /><br/><br/>
            
            <TextField
              id="synopsis"
              label="Synopsis"
              multiline
              rows={2}
              fullWidth
              onChange={handleSynopsis}
              value={synopsis}
              defaultValue=""
              variant="outlined"
            />      
            
            <TextField onChange={handleDirector} id="director" label="Director" value={director} fullWidth />
            <TextField onChange={handleYear} id="year" label="Year" value={year} fullWidth />
            <TextField onChange={handleGenres} id="genres" label="Genres (comma separated" value={genres} fullWidth />
            <TextField onChange={handleActors} id="actors" label="Actors (comma separated)" value={actors} fullWidth />

            <InputLabel htmlFor="age-native-helper" fullWidth>Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="ageLimit"
              fullWidth
              onChange={handleAge}
              value={age}
            >
              { [0,4,6,12,16,18].map(age => (<MenuItem value={age}>{age}</MenuItem>)) }
            </Select>

            <InputLabel htmlFor="rating-native-helper">Rating</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="rating" 
              fullWidth
              onChange={handleRate}
              value={rating}
            >
              { [1,2,3,4,5].map(rate => (<MenuItem value={rate}>{rate}</MenuItem>)) }
            </Select>        
          </form>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSend} color="primary">
          Add
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogEdit;