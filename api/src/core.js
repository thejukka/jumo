import Ajv from 'ajv';            // Import validator
import * as uuid from 'uuid';     // Import UUID generator
import * as db from './dynamodb'; // Import DynamoDB routines
import movieRequestSchema 
  from './schemas/movieRequest';  // Import the validation schema


const Movies = {
  // Get all movie entries
  getAll: () => 
    db.getAll()
      .then(res => Response.OK({body: res.Items}))
      .catch(err => Response.error({msg: 'Unable to get entries'}, err)),

  // Get movie entry by ID
  getById: (id) =>
    db.getById(id)
      .then(res => (
          res.Item 
            ? Response.OK({body: res.Item}) 
            : Response.error({code: 404,  msg: 'Entry not found by ID'})
      ))
      .catch(err => Response.error({msg: 'Unable to get entry by ID'}, err)),

  // Delete movie entry by ID
  deleteById: (id) =>         
    db.removeById(id)
      .then(Response.OK({code: 204})) // 204: successfully deleted
      .catch(err => Response.error({msg: 'Unable to delete entry'}, err)),
  
  // Validate and add a movie entry with an ID
  add: (data) => {
    // Validate before adding into the database
    if (!entryValid(data)) {
        return Response.error({code: 400, msg: 'Movie entry validation failed'});
    }    
    const entry = { id: uuid.v1(), ...JSON.parse(data) };
    return db.add(entry)
             .then(() => Response.OK({code: 201, body: entry}))
             .catch(err => Response.error({msg: 'Unable to add entry'}, err));
  },

  // Add a batch of movie entries with IDs into the database.
  // Since this is a tool for developers/test only, no validations are applied
  addBatch: (data) => {
    const batch = data.map(entry => ({ id: uuid.v1(), ...entry }));
    return db.addBatch(batch)
             .then(() => Response.OK({body: batch}))
             .catch(err => Response.error({msg: 'Unable to add a batch of entries'}, err));
  }
}

// Create common responses
const Response = {
  // Optionally set success code and optional body
  OK: (opt, data) => ({
    statusCode: opt && opt.code ? opt.code : 200,
    body: opt && opt.body ? JSON.stringify(opt.body) : ''
  }),
  // Optionally set error code, message and/or error data (json)
  error: (opt, errData) => ({
    statusCode: opt && opt.code ? opt.code : 500,
    body: JSON.stringify({ 
      message: opt && opt.msg ? opt.msg : '',
      data: errData ? errData : false
    })
  })
}

// Validate JSON body
function bodyValid(body) {
  try { 
    const json = JSON.parse(body);
  } catch (err) { 
    return false; 
  }
  return true;
}

// First validate JSON, then schema. Also prevent multiple movie entry addition
function entryValid(entry) {
  const ajv = new Ajv();
  const validation = ajv.compile(movieRequestSchema);
  return bodyValid(entry) ? validation(entry) : false;
};

export default Movies;