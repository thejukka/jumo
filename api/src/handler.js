import Movies from './core';

/**
 * Add a batch of entries into the database
 * (not public, accessed only by administrators)
 *   
 * @param evt Lambda request event
 * @param ctx Lambda request context
 * @param cb  Callback function
 */
export const addBatch = (evt, ctx, cb) =>
  cb(null, Movies.addBatch(JSON.parse(evt.body)));

// Get all entries
export const getAll = (evt, ctx, cb) =>
  cb(null, Movies.getAll());

// Get an entry by ID
export const movieGet = (evt, ctx, cb) => 
  cb(null, Movies.getById(evt.pathParameters.id));

// Add an entry. Notice: body is not yet parsed for being validated
export const movieAdd = (evt, ctx, cb) => 
  cb(null, Movies.add(evt.body));

// Delete an entry by an ID
export const movieDelete = (evt, ctx, cb) => 
  cb(null, Movies.deleteById(evt.pathParameters.id));