Date.prototype.fromISO = (iso) ->
    return new Date(iso)


Array.prototype.remove = (args...) ->
    output = []
    for arg in args
        index = @indexOf arg
        output.push @splice(index, 1) if index isnt -1
    output = output[0] if args.length is 1
    output


String.prototype.lpad = (padString, length) ->
    str = this
    while (str.length < length)
        str = padString + str
    return str