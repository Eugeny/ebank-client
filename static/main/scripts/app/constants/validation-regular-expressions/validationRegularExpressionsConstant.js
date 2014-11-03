angular.module('constants')
    .constant('validationRegularExpressions', {
        //change password regular expressions
        password: /^[a-zA-Z0-9]{6,20}$/,
        passwordLength: /^.{6,20}$/,
        passwordCharacters: /^[a-zA-Z0-9]+$/,
        integerNumberRegularExpression: /^[1-9][0-9]*$/
    });