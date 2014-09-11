app.factory 'BankAccount', ($resource) ->
    BankAccount = $resource(
        '/api/1/bank-account/:id/?format=json', {id:'@id'},
        { update: { method: 'PUT' } }, false,
    )
    return BankAccount


app.factory 'User', ($resource) ->
    User = $resource(
        '/api/1/user/:id/?format=json', {id:'@id'},
        { update: { method: 'PUT' } }, false,
    )   
    return User

