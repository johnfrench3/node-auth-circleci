var ArgumentError = require('rest-facade').ArgumentError;
var Auth0RestClient = require('../Auth0RestClient');
var RetryRestClient = require('../RetryRestClient');
var sanitizeArguments = require('../utils').sanitizeArguments;

/**
 * Simple facade for consuming a REST API endpoint.
 * @external RestClient
 * @see https://github.com/ngonzalvez/rest-facade
 */

/**
 * @class
 * Abstracts interaction with the users endpoint.
 * @constructor
 * @memberOf module:management
 *
 * @param {Object} options            The client options.
 * @param {String} options.baseUrl    The URL of the API.
 * @param {Object} [options.headers]  Headers to be included in all requests.
 * @param {Object} [options.retry]    Retry Policy Config
 */
var UsersManager = function(options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide manager options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  var clientOptions = {
    errorFormatter: { message: 'message', name: 'error' },
    headers: options.headers,
    query: { repeatParams: false }
  };

  var usersAuth0RestClient = new Auth0RestClient(
    options.baseUrl + '/users/:id',
    clientOptions,
    options.tokenProvider
  );
  this.users = new RetryRestClient(usersAuth0RestClient, options.retry);

  /**
   * Provides an abstraction layer for consuming the
   * {@link https://auth0.com/docs/api/v2#!/Users/delete_multifactor_by_provider
   * Multifactor Provider endpoint}.
   *
   * @type {external:RestClient}
   */
  var multifactorAuth0RestClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/multifactor/:provider',
    clientOptions,
    options.tokenProvider
  );
  this.multifactor = new RetryRestClient(multifactorAuth0RestClient, options.retry);

  /**
   * Provides a simple abstraction layer for linking user accounts.
   *
   * @type {external:RestClient}
   */
  var identitiesAuth0RestClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/identities/:provider/:user_id',
    clientOptions,
    options.tokenProvider
  );
  this.identities = new RetryRestClient(identitiesAuth0RestClient, options.retry);

  /**
   * Provides a simple abstraction layer for user logs
   *
   * @type {external:RestClient}
   */
  var userLogsAuth0RestClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/logs',
    clientOptions,
    options.tokenProvider
  );
  this.userLogs = new RetryRestClient(userLogsAuth0RestClient, options.retry);

  /**
   * Provides an abstraction layer for retrieving Guardian enrollments.
   *
   * @type {external:RestClient}
   */
  var enrollmentsAuth0RestClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/enrollments',
    clientOptions,
    options.tokenProvider
  );
  this.enrollments = new RetryRestClient(enrollmentsAuth0RestClient, options.retry);

  /**
   * Provides an abstraction layer for the new "users-by-email" API
   *
   * @type {external:RestClient}
   */
  var usersByEmailClient = new Auth0RestClient(
    options.baseUrl + '/users-by-email',
    clientOptions,
    options.tokenProvider
  );
  this.usersByEmail = new RetryRestClient(usersByEmailClient, options.retry);

  /**
   * Provides an abstraction layer for regenerating Guardian recovery codes.
   *
   * @type {external:RestClient}
   */
  var recoveryCodeRegenerationAuth0RestClients = new Auth0RestClient(
    options.baseUrl + '/users/:id/recovery-code-regeneration',
    clientOptions,
    options.tokenProvider
  );
  this.recoveryCodeRegenerations = new RetryRestClient(
    recoveryCodeRegenerationAuth0RestClients,
    options.retry
  );

  /**
   * Provides an abstraction layer for invalidating all remembered browsers for MFA.
   *
   * @type {external:RestClient}
   */
  var invalidateRememberBrowserAuth0RestClients = new Auth0RestClient(
    options.baseUrl + '/users/:id/multifactor/actions/invalidate-remember-browser',
    clientOptions,
    options.tokenProvider
  );
  this.invalidateRememberBrowsers = new RetryRestClient(
    invalidateRememberBrowserAuth0RestClients,
    options.retry
  );

  /**
   * Provides an abstraction layer for CRD on roles for a user
   *
   * @type {external:RestClient}
   */
  var userRolesClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/roles',
    clientOptions,
    options.tokenProvider
  );
  this.roles = new RetryRestClient(userRolesClient, options.retry);

  /**
   * Provides an abstraction layer for CRD on permissions directly on a user
   *
   * @type {external:RestClient}
   */
  var userPermissionsClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/permissions',
    clientOptions,
    options.tokenProvider
  );
  this.permissions = new RetryRestClient(userPermissionsClient, options.retry);

  var organizationsClient = new Auth0RestClient(
    options.baseUrl + '/users/:id/organizations',
    clientOptions,
    options.tokenProvider
  );
  this.organizations = new RetryRestClient(organizationsClient, options.retry);
};

/**
 * Create a new user.
 *
 * @method    create
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.create(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // User created.
 * });
 *
 * @param   {Object}    data    User data.
 * @param   {Function}  [cb]    Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.create = function(data, cb) {
  if (cb && cb instanceof Function) {
    return this.users.create(data, cb);
  }

  return this.users.create(data);
};

/**
 * Get all users.
 *
 * @method    getAll
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example <caption>
 *   This method takes an optional object as first argument that may be used to
 *   specify pagination settings and the search query. If pagination options are
 *   not present, the first page of a limited number of results will be returned.
 * </caption>
 *
 * // Pagination settings.
 * var params = {
 *   per_page: 10,
 *   page: 0
 * };
 *
 * management.users.getAll(params, function (err, users) {
 *   console.log(users.length);
 * });
 *
 * @param   {Object}    [params]          Users params.
 * @param   {Number}    [params.per_page] Number of results per page.
 * @param   {Number}    [params.page]     Page number, zero indexed.
 * @param   {Function}  [cb]              Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getAll = function(params) {
  return this.users.getAll.apply(this.users, arguments);
};

/**
 * Get Users by an Email Address
 *
 * @method    getByEmail
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example <caption>
 *   This method takes a first argument as the Email address to look for
 *   users, and uses the /users-by-email API, not the search API
 * </caption>
 *
 * management.users.getByEmail('email@address', function (err, users) {
 *   console.log(users);
 * });
 *
 * @param   {String}    [email]                     Email address of user(s) to find
 * @param   {Object}    [options]                   Additional options to pass to the endpoint
 * @param   {String}    [options.fields]            Comma-separated list of fields to include or exclude in the result
 * @param   {Boolean}   [options.include_fields]    Whether specified fields are to be included (true) or excluded (false). Defaults to true.
 * @param   {Function}  [cb]                        Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getByEmail = function(email, options, cb) {
  var { options, cb } = sanitizeArguments(options, cb);

  return this.usersByEmail.getAll({ email, ...options }, cb);
};

/**
 * Get a user by its id.
 *
 * @method    get
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.get({ id: USER_ID }, function (err, user) {
 *   console.log(user);
 * });
 *
 * @param   {Object}    data      The user data object.
 * @param   {String}    data.id   The user id.
 * @param   {Function}  [cb]      Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.get = function() {
  return this.users.get.apply(this.users, arguments);
};

/**
 * Update a user by its id.
 *
 * @method    update
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID };
 *
 * management.users.update(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Updated user.
 *   console.log(user);
 * });
 *
 * @param   {Object}    params      The user parameters.
 * @param   {String}    params.id   The user id.
 * @param   {Object}    data        New user data.
 * @param   {Function}  [cb]        Callback function
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.update = function() {
  return this.users.patch.apply(this.users, arguments);
};

/**
 * Update the user metadata.
 *
 * @method    updateUserMetadata
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID };
 * var metadata = {
 *   address: '123th Node.js Street'
 * };
 *
 * management.users.updateUserMetadata(params, metadata, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Updated user.
 *   console.log(user);
 * });
 *
 * @param   {Object}    params      The user data object..
 * @param   {String}    params.id   The user id.
 * @param   {Object}    metadata    New user metadata.
 * @param   {Function}  [cb]        Callback function
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.updateUserMetadata = function(params, metadata, cb) {
  var data = {
    user_metadata: metadata
  };

  if (cb && cb instanceof Function) {
    return this.users.patch(params, data, cb);
  }

  return this.users.patch(params, data);
};

/**
 * Update the app metadata.
 *
 * @method    updateAppMetadata
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID };
 * var metadata = {
 *   foo: 'bar'
 * };
 *
 * management.users.updateAppMetadata(params, metadata, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Updated user.
 *   console.log(user);
 * });
 *
 * @param   {Object}    params      The user data object..
 * @param   {String}    params.id   The user id.
 * @param   {Object}    metadata    New app metadata.
 * @param   {Function}  [cb]        Callback function
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.updateAppMetadata = function(params, metadata, cb) {
  var data = {
    app_metadata: metadata
  };

  if (cb && cb instanceof Function) {
    return this.users.patch(params, data, cb);
  }

  return this.users.patch(params, data);
};

/**
 * Delete a user by its id.
 *
 * @method    delete
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.delete({ id: USER_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // User deleted.
 * });
 *
 *
 * @param   {Object}    params      The user data object..
 * @param   {String}    params.id   The user id.
 * @param   {Function}  [cb]        Callback function
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.delete = function(params) {
  if (typeof params !== 'object' || typeof params.id !== 'string') {
    throw new ArgumentError('You must provide an id for the delete method');
  }

  return this.users.delete.apply(this.users, arguments);
};

/**
 * Delete all users.
 *
 * @method    deleteAll
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.deleteAll(function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Users deleted
 * });
 *
 * @param   {Function}  [cb]        Callback function
 *
 * @return  {Promise|undefined}
 *
 * @deprecated This method will be removed in the next major release.
 */
UsersManager.prototype.deleteAll = function(cb) {
  if (typeof cb !== 'function') {
    var errorMsg = 'The deleteAll method only accepts a callback as argument';

    throw new ArgumentError(errorMsg);
  }

  return this.users.delete.apply(this.users, arguments);
};

/**
 * Delete a multifactor provider.
 *
 * @method    deleteMultifactorProvider
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID, provider: MULTIFACTOR_PROVIDER };
 *
 * management.users.deleteMultifactorProvider(params, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Users accounts unlinked.
 * });
 *
 * @param   {Object}    params            Data object.
 * @param   {String}    params.id         The user id.
 * @param   {String}    params.provider   Multifactor provider.
 * @param   {Function}  [cb]              Callback function
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.deleteMultifactorProvider = function(params, cb) {
  params = params || {};

  if (!params.id || typeof params.id !== 'string') {
    throw new ArgumentError('The id parameter must be a valid user id');
  }

  if (!params.provider || typeof params.provider !== 'string') {
    throw new ArgumentError('Must specify a provider');
  }

  if (cb && cb instanceof Function) {
    return this.multifactor.delete(params, cb);
  }

  return this.multifactor.delete(params);
};

/**
 * Link the user with another account.
 *
 * @method    link
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var userId = 'USER_ID';
 * var params = {
 *   user_id: 'OTHER_USER_ID',
 *   connection_id: 'CONNECTION_ID'
 * };
 *
 * management.users.link(userId, params, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Users linked.
 * });
 *
 * @param   {String}    userId                ID of the primary user.
 * @param   {Object}    params                Secondary user data.
 * @param   {String}    params.user_id        ID of the user to be linked.
 * @param   {String}    params.connection_id  ID of the connection to be used.
 * @param   {String}    params.provider       Identity provider of the secondary user account being linked.
 * @param   {String}    params.link_with      JWT for the secondary account being linked. If sending this parameter, provider, user_id, and connection_id must not be sent.
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.link = function(userId, params, cb) {
  var query = { id: userId };
  params = params || {};

  // Require a user ID.
  if (!userId) {
    throw new ArgumentError('The userId cannot be null or undefined');
  }
  if (typeof userId !== 'string') {
    throw new ArgumentError('The userId has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.identities.create(query, params, cb);
  }

  return this.identities.create(query, params);
};

/**
 * Unlink the given accounts.
 *
 * @method    unlink
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID, provider: 'auht0', user_id: OTHER_USER_ID };
 *
 * management.users.unlink(params, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Users accounts unlinked.
 * });
 *
 * @param   {Object}    params            Linked users data.
 * @param   {String}    params.id         Primary user ID.
 * @param   {String}    params.provider   Identity provider in use.
 * @param   {String}    params.user_id    Secondary user ID.
 * @param   {Function}  [cb]              Callback function.
 *
 * @return {Promise|undefined}
 */
UsersManager.prototype.unlink = function(params, cb) {
  params = params || {};

  if (!params.id || typeof params.id !== 'string') {
    throw new ArgumentError('id field is required');
  }

  if (!params.user_id || typeof params.user_id !== 'string') {
    throw new ArgumentError('user_id field is required');
  }

  if (!params.provider || typeof params.provider !== 'string') {
    throw new ArgumentError('provider field is required');
  }

  if (cb && cb instanceof Function) {
    return this.identities.delete(params, cb);
  }

  return this.identities.delete(params);
};

/**
 * Get user's log events.
 *
 * @method    logs
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * var params = { id: USER_ID, page: 0, per_page: 50, sort: 'date:-1', include_totals: true };
 *
 * management.users.logs(params, function (err, logs) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(logs);
 * });
 *
 * @param   {Object}    params                Get logs data.
 * @param   {String}    params.id             User id.
 * @param   {Number}    params.per_page       Number of results per page.
 * @param   {Number}    params.page           Page number, zero indexed.
 * @param   {String}    params.sort           The field to use for sorting. Use field:order where order is 1 for ascending and -1 for descending. For example date:-1.
 * @param   {Boolean}   params.include_totals true if a query summary must be included in the result, false otherwise. Default false;
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return {Promise|undefined}
 */
UsersManager.prototype.logs = function(params, cb) {
  params = params || {};

  if (!params.id || typeof params.id !== 'string') {
    throw new ArgumentError('id field is required');
  }

  return this.userLogs.get(params, cb);
};

/**
 * Get a list of Guardian enrollments.
 *
 * @method    getGuardianEnrollments
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.getGuardianEnrollments({ id: USER_ID }, function (err, enrollments) {
 *   console.log(enrollments);
 * });
 *
 * @param   {Object}    data      The user data object.
 * @param   {String}    data.id   The user id.
 * @param   {Function}  [cb]      Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getGuardianEnrollments = function() {
  return this.enrollments.get.apply(this.enrollments, arguments);
};

/**
 * Generate new Guardian recovery code.
 *
 * @method    regenerateRecoveryCode
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.regenerateRecoveryCode("USER_ID", function (err, result) {
 *   console.log(result.recovery_code);
 * });
 *
 * @param   {Object}    params                Get logs data.
 * @param   {String}    params.id             User id.
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.regenerateRecoveryCode = function(params, cb) {
  if (!params || !params.id) {
    throw new ArgumentError('The userId cannot be null or undefined');
  }

  if (cb && cb instanceof Function) {
    return this.recoveryCodeRegenerations.create(params, {}, cb);
  }

  return this.recoveryCodeRegenerations.create(params, {});
};

/**
 * Invalidate all remembered browsers for MFA.
 *
 * @method    invalidateRememberBrowser
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.invalidateRememberBrowser({ id: USER_ID }, function (err, result) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Invalidated all remembered browsers.
 * });
 *
 * @param   {Object}    params                The user data object.
 * @param   {String}    params.id             The user id.
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.invalidateRememberBrowser = function(params, cb) {
  if (!params || !params.id) {
    throw new ArgumentError('The userId cannot be null or undefined');
  }

  if (cb && cb instanceof Function) {
    return this.invalidateRememberBrowsers.create(params, {}, cb);
  }

  return this.invalidateRememberBrowsers.create(params, {});
};

/**
 * Get a list of roles for a user.
 *
 * @method    getUserRoles
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.getRoles({ id: USER_ID }, function (err, roles) {
 *   console.log(roles);
 * });
 *
 * @param   {Object}    data      The user data object.
 * @param   {String}    data.id   The user id.
 * @param   {Function}  [cb]      Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getRoles = function() {
  return this.roles.getAll.apply(this.roles, arguments);
};

/**
 * Assign roles to a user
 *
 * @method    assignRoles
 * @memberOf  module:management.RolesManager.prototype
 *
 * @example
 * var params =  { id : 'USER_ID';
 * var data = { "roles" : ["roleId1", "roleID2"]};
 *
 * management.users.assignRoles(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // roles added.
 * });
 *
 * @param   {Object}    params       params object
 * @param   {String}    params.id    user_id
 * @param   {String}    data         data object containing list of role IDs
 * @param   {String}    data.roles  Array of role IDs
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

UsersManager.prototype.assignRoles = function(params, data, cb) {
  var query = params || {};
  data = data || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The user_id cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The user_id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.roles.create(query, data, cb);
  }

  return this.roles.create(query, data);
};

/**
 * Remove roles from a user
 *
 * @method    removeRoles
 * @memberOf  module:management.RolesManager.prototype
 *
 * @example
 * var params =  { id : 'USER_ID';
 * var data = { "roles" : ["roleId1", "roleID2"]};
 *
 * management.users.removeRoles(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // roles removed.
 * });
 *
 * @param   {Object}    params       params object
 * @param   {String}    params.id    user_id
 * @param   {String}    data         data object containing list of role IDs
 * @param   {String}    data.roles  Array of role IDs
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

UsersManager.prototype.removeRoles = function(params, data, cb) {
  var query = params || {};
  data = data || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The user_id cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The user_id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.roles.delete(query, data, cb);
  }

  return this.roles.delete(query, data);
};

/**
 * Get a list of permissions for a user.
 *
 * @method    getPermissions
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.getPermissions({ id: USER_ID }, function (err, permissions) {
 *   console.log(permissions);
 * });
 *
 * @param   {Object}    data      The user data object.
 * @param   {String}    data.id   The user id.
 * @param   {Function}  [cb]      Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getPermissions = function() {
  return this.permissions.getAll.apply(this.permissions, arguments);
};

/**
 * Assign permissions to a user
 *
 * @method    assignPermissions
 * @memberOf  module:management.permissionsManager.prototype
 *
 * @example
 * var params =  { id : 'USER_ID';
 * var data = { "permissions" : [{"permission_name" :"do:something" ,"resource_server_identifier" :"test123" }]};
 *
 * management.users.assignPermissions(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // permissions added.
 * });
 *
 * @param   {Object}    params       params object
 * @param   {String}    params.id    user_id
 * @param   {String}    data         data object containing list of permissions
 * @param   {String}    data.permissions  Array of permission IDs
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

UsersManager.prototype.assignPermissions = function(params, data, cb) {
  var query = params || {};
  data = data || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The user_id cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The user_id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.permissions.create(query, data, cb);
  }

  return this.permissions.create(query, data);
};

/**
 * Remove permissions from a user
 *
 * @method    removePermissions
 * @memberOf  module:management.permissionsManager.prototype
 *
 * @example
 * var params =  { id : 'USER_ID';
 * var data = { "permissions" : [{"permission_name" :"do:something" ,"resource_server_identifier" :"test123" }]};
 *
 * management.users.removePermissions(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // permissions removed.
 * });
 *
 * @param   {Object}    params       params object
 * @param   {String}    params.id    user_id
 * @param   {String}    data         data object containing list of permission IDs
 * @param   {String}    data.permissions  Array of permission IDs
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

UsersManager.prototype.removePermissions = function(params, data, cb) {
  var query = params || {};
  data = data || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The user_id cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The user_id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.permissions.delete(query, data, cb);
  }

  return this.permissions.delete(query, data);
};

/**
 * Get a list of organizations for a user.
 *
 * @method    getUserOrganizations
 * @memberOf  module:management.UsersManager.prototype
 *
 * @example
 * management.users.getUserOrganizations({ id: USER_ID }, function (err, orgs) {
 *   console.log(orgs);
 * });
 *
 * @param   {Object}    data      The user data object.
 * @param   {String}    data.id   The user id.
 * @param   {Function}  [cb]      Callback function.
 *
 * @return  {Promise|undefined}
 */
UsersManager.prototype.getUserOrganizations = function() {
  return this.organizations.getAll.apply(this.organizations, arguments);
};

module.exports = UsersManager;
