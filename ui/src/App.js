import React from 'react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Button from '@material-ui/core/Button';
import { AgGridReact } from 'ag-grid-react';
import DialogView from './Dialog.View';
import DialogEdit from './Dialog.Edit';
import demoData from './samples/movies.sample.json';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      modules: AllCommunityModules,
      rowSelection: 'single',
      demoData: false,
      error: null,
      isLoaded: false,
      defaultColDef: {
        flex: 1,
        minWidth: 100,
      }
    }
  }

  componentDidMount() {
    this.moviesGet();
  }

  uploadDemoData = () =>
    fetch(`${this.props.api}/batch`, { 
      method: "POST", 
      body: JSON.stringify(demoData)
    })
      .then(resp => resp.json())
      .then((resp) => { 
        if (!this.state.demoData)
          this.setState({demoData: true, items: { data: resp }});
      });

  listModify = (entries) => entries.map(entry => ({
    ...entry,
    genres: entry.genres.length > 0 ? entry.genres.join(', ') : ''
  }));

  onRowSelected(evt) {
    if (evt.node.isSelected())
      this.setState({selected: evt.node.data.id});
  };

  // Get all movies from the backend and update the state
  moviesGet = () =>
    fetch(this.props.api)
      .then(resp => resp.json())
      .then(
        (resp) => 
          this.setState({isLoaded: true, items: { data: this.listModify(resp)}}),
        (error) => 
          this.setState({isLoaded: true, error})
      );

  // Call DELETE by ID on backend and update the state
  movieDelete = () =>
    fetch(`${this.props.api}/${this.state.selected}`, { method: 'DELETE' })
      .then(() => {  
        const currentItemsData = this.state.items.data.filter(
          each => (
            each.id !== this.state.selected
          )
        )
        this.setState({selected: false, items: { data: currentItemsData }});
      })

  confirmDelete = () => {
    if (this.state.selected) {
      if (window.confirm("😬 Are you sure you want to delete selected?")) {
        this.movieDelete();
      }
    }
  }

  // Every column automatically filterable and sortable
  setColumns = (columnArr) => columnArr.map(column => ({
    field: column,
    sortable: true,
    filter: true
  }));

  render() {  
    const { error, isLoaded, items, modules, rowSelection, selected } = this.state;
    if (error) {
      return <div className="box nou"> 🤬 Could not connect backend. Please refresh a bit later...</div>
    } else if (!isLoaded) {
      return <div className="box jees">Loading...</div>
    } else { 
      return (
        <div className="stage" style={{ width: '100%', height: '100%'}} >
          <h1><b>JUMO</b><sup>&trade;</sup> JukkaMovies service</h1>
          <div className="ag-theme-alpine" style={{ width: '100%', height: 500 }}>
            <AgGridReact 
              id="mainGrid"
              modules={modules}
              rowData={items.data} 
              rowSelection={rowSelection}
              columnDefs={this.setColumns(['name','year','genres','ageLimit','rating'])}
              defaultColDef={this.state.defaultColDef}
              onRowSelected={this.onRowSelected.bind(this)}
            />
          </div>

          {/* Edit dialog for a new movie entry */}
          <DialogEdit uri={this.props.api} list={items}/>

          {/* View dialog for the selected movie entry*/}
          <DialogView uri={selected ? this.props.api+'/' + selected : null}/>

          <Button variant="outlined" color="secondary" onClick={this.confirmDelete}>
            delete selected
          </Button>

          { /* Use demo button only when no entries on the list */}
          { !items.data || items.data < 1 ?
              <Button id="demoDataButton" variant="outlined" color="default" onClick={this.uploadDemoData}>
                use demo data
              </Button> : '' }
        </div>
      );
    }
  };
}

export default App;