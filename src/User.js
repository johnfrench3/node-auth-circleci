var RestClient = require('rest-facade').Client;
var MetadataUpdater = require('./MetadataUpdater');

/**
 * @class
 * Abstracts interaction with the users endpoint.
 * @constructor
 */
var Users = function (options){
  var clientOptions = {
    headers: {
      'Authorization': 'Bearer ' + options.accessToken
    }
  };

  this.resource = new RestClient(options.baseUrl + '/users/:userId', clientOptions);
  this.metadataUpdater = new MetadataUpdater(options);
};

/**
 * Create a new user.
 *
 * @method
 * @param   {Object}    data    User data.
 * @param   {Function}  [cb]    Callback function.
 * @return  {Promise}           User creation promise.
 */
Users.prototype.create = function (data, cb) {
  return this.resource.create(data, cb);
};

/**
 * Get all users.
 *
 * @method
 * @param   {Function}  [cb]  Callback function.
 * @return  {Promise}         Users retrieval promise.
 */
Users.prototype.getAll = function () {
  return this.resource.getAll.apply(this.resource, arguments);
};

/**
 * Get a user by its id.
 *
 * @method
 * @param   {any}       id    The user id.
 * @param   {Function}  [cb]  Callback function.
 * @return  {Promise}         User retrieval promise.
 */
Users.prototype.get = function () {
  return this.resource.get.apply(this.resource, arguments);
};

/**
 * Update a user by its id.
 *
 * @method
 * @param   {any}       params  The user id.
 * @param   {Object}    data    New user data.
 * @param   {Function}  [cb]    Callback function
 * @return  {Promise}           User update promise.
 */
Users.prototype.update = function () {
  return this.resource.update.apply(this.resource, arguments);
};

/**
 * Delete a user by its id.
 *
 * @method
 * @return  {Promise}           User delete promise.
 */
Users.prototype.delete = function () {
  return this.resource.delete.apply(this.resource, arguments);
};

Users.prototype.updateAppMetadata = function(id, updatedMetadata, cb){
  return this.metadataUpdater.update(id, {
    updatedMetadata: updatedMetadata,
    type: 'app_metadata'
  }, cb);
};

Users.prototype.updateUserMetadata = function(id, updatedMetadata, cb){
  return this.metadataUpdater.update(id, {
    updatedMetadata: updatedMetadata,
    type: 'user_metadata'
  }, cb);
};

module.exports = Users;
