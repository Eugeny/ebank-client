app.factory 'Hotkeys', ($timeout, $rootScope) ->
    $timeout () ->
        $(document).on 'keypress', (e) ->
            if not e.metaKey and not e.ctrlKey
                if $('input:focus').length == 0 and $('textarea:focus').length == 0
                    $timeout () ->
                        $rootScope.$apply () ->
                            char = String.fromCharCode(e.which)
                            $rootScope.$broadcast 'keypress', char, e
                    return false


    
