Node.js client library for the Auth0 platform.

## Instalation

	npm install auth0

## Usage

Initialice your client class with the credentials in the [settings section](https://app.auth0.com/#/settings) of the dashboard.

~~~js
var Auth0 = require('auth0');

var client = new Auth0({
  domain:       'yourdomain.auth0.com',
  clientID:     'your-client-id',
  clientSecret: 'your-client-secret'
});
~~~

### client.getConnections(callback)

Return a list of all the connections in your application:

~~~js
client.getConnections(function (err, connections){
  //.....
});
~~~

### client.createConnection(callback)

Normally you will create what we call **enterprise connections** from your application. 

When a new customer sign up to your product, you will ask him for his **directory's** credentials. Then you will be able to create the connection by using our API or in this case this client library: 

~~~js
var myNewConnection =  {
    //a friendly name to identify the connection
    'name': 'thesuperstore-connection',

    //this is the strategy: office365, google-apps, adfs
    'strategy': 'office365', 
    'options': {
      
      // these are the credentials of your application in the provider
      'app_domain':    'your-app-domain.com',
      'client_id':     'xxx',       
      'client_secret': 'xxx',
      
      // this field is provided by the user when he registers:
      'tenant_domain': 'your tenants domain',
      
      // these are the grants you want:
      'user_id':          true,
      'email':            true,
      'ext_profile':      true
    };

client.createConnection(myNewConnection, function (err, connection) {
  //.....
});
~~~

The returned connection will have a ```provisioning_ticket_url``` field to which you have to redirect the client in order to complete the authorization process.


### client.getUsers({[connection: connection], [per_page: 10]}, callback)

This method returns a list of users.

If ```connection``` name is passed on the options, it will search the users on the directory of the connection. Suppose it is a **Windows Azure Active Directory** connection it will fetch all the users from the directory. If the connection doesn't have a directory or it is a Social connection like **Google Auth 2** it will return all the users that have logged in to your application at least once.

The amount of items per page is optional (defaults to 100) and it is not supported for all directories, eg: connections using **Google Apps** ignores this argument and uses 100.

~~~js
client.getUsers({connection: 'a-waad-connection'}, function (err, result) {
  //result is an array with the user objects
});
~~~

The callback has the common signature for node.js method [err, result] where result is an array of users with an special hidden property called ```nextPageLink```. These links are safe to be shared since they will work for a short period of time and have an special signature that make them safe. 

Although you can do a simple GET to that link to fetch the next page, you can use the library as well:

~~~js
client.getUsers({connection: 'a-waad-connection'}, function (err, firstPageOfResults) {
  client.getUsers({page: firstPageOfResults.nextPageLink}, function (err, secondPageOfResults) {
  });
});
~~~


### client.getSocialUsers({[per_page: 10]}, callback)

The same than ```getUsers``` but this method returns users for all social connections, ie: not enterprise connections.

### client.getConnection(name, callback)

~~~js
client.getConnection('my-connection', function (err, connection){
  //.....
});
~~~