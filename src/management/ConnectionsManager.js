var RestClient = require('rest-facade').Client;
var ArgumentError = require('../exceptions').ArgumentError;
var utils = require('../utils');


/**
 * @class ConnectionsManager
 * Represents the relationship between Auth0 and an Identity provider.
 * @constructor
 * @memberOf module:management
 *
 * @param {Object} options            The client options.
 * @param {String} options.baseUrl    The URL of the API.
 * @param {Object} [options.headers]  Headers to be included in all requests.
 */
var ConnectionsManager = function (options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide client options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  /**
   * Options object for the Rest Client instance.
   *
   * @type {Object}
   */
  apiOptions = {
    headers: options.headers,
    query: { repeatParams: false }
  };

  /**
   * Provides an abstraction layer for performing CRUD operations on
   * [Auth0 Connections]{@link https://auth0.com/docs/api/v2#!/ConnectionsManagers}.
   *
   * @type {external:RestClient}
   */
  this.resource = new RestClient(options.baseUrl + '/connections/:id ', apiOptions);
};


/**
 * Create a new connection.
 *
 * @method    create
 * @memberOf  module:management.ConnectionsManager.prototype
 *
 * @example
 * // Using auth0 instance.
 * auth0.createConnection(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Conection created.
 * });
 *
 *
 * // Using the connections manager directly.
 * auth0.connections.create(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Conection created.
 * });
 *
 * @param   {Object}    data     Connection data object.
 * @param   {Function}  [cb]     Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(ConnectionsManager, 'create', 'resource.create');


/**
 * Get all connections.
 *
 * @method    getAll
 * @memberOf  module:management.ConnectionsManager.prototype
 *
 * @example
 * // Using auth0 instance.
 * auth0.getConnections(function (err, connections) {
 *   console.log(connections.length);
 * });
 *
 *
 * // Using the connections manager directly.
 * auth0.connections.getAll(function (err, connections) {
 *   console.log(connections.length);
 * });
 *
 * @param   {Function}  [cb]    Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(ConnectionsManager, 'getAll', 'resource.getAll');


/**
 * Get an Auth0 connection.
 *
 * @method    get
 * @memberOf  module:management.ConnectionsManager.prototype
 *
 * @example
 * // Using auth0 instance.
 * auth0.getConnection({ id: CONNECTION_ID }, function (err, connection) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(connection);
 * });
 *
 *
 * // Using the connections manager directly.
 * auth0.connections.get({ id: CONNECTION_ID }, function (err, connection) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(connection);
 * });
 *
 * @param   {Object}    params          Connection parameters.
 * @param   {String}    params.id       Connection ID.
 * @param   {Function}  [cb]            Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(ConnectionsManager, 'get', 'resource.get');


/**
 * Update an existing connection.
 *
 * @method    update
 * @memberOf  module:management.ConnectionsManager.prototype
 *
 * @example
 * var data = { name: 'newConnectionName' };
 * var params = { id: CONNECTION_ID };
 *
 *
 * // Using auth0 instance.
 * auth0.updateConnection(params, data, function (err, connection) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(connection.name);  // 'newConnectionName'
 * });
 *
 *
 * // Using the connections manager directly.
 * auth0.connections.update(params, data, function (err, connection) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(connection.name);  // 'newConnectionName'
 * });
 *
 * @param   {Object}    params        Conneciton parameters.
 * @param   {String}    params.id     Connection ID.
 * @param   {Object}    data          Updated connection data.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return    {Promise|undefined}
 */
utils.wrapPropertyMethod(ConnectionsManager, 'update', 'resource.patch');


/**
 * Delete an existing connection.
 *
 * @method    delete
 * @memberOf  module:management.ConnectionsManager.prototype
 *
 * @example
 * // Using auth0 instance.
 * auth0.deleteConnection({ id: CONNECTION_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Conection deleted.
 * });
 *
 *
 * // Using the connections manager directly.
 * auth0.connections.delete({ id: CONNECTION_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Conection deleted.
 * });
 *
 * @param   {Object}    params          Connection parameters.
 * @param   {String}    params.id       Connection ID.
 * @param   {Function}  [cb]            Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(ConnectionsManager, 'delete', 'resource.delete');


module.exports = ConnectionsManager;
