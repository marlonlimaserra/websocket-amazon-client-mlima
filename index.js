const socket = ((conf) => {

    if(typeof conf !== "object"){ console.error('O conf deve ser objeto.'); return false; }
    if(typeof conf.url !== "string"){ console.error('A url deve ser string.'); return false; }
    if(conf.enableLog === undefined){ conf.enableLog = false; }

    var socket = new WebSocket(conf.url);
    var eventsm = {};
    var logm = {};

    socket.on = ((name,func) => { 
    
        if(typeof func !== "function"){ return false; }
        eventsm[name] = func;
        return true;
    
    });

    socket.off = ((name) => { delete eventsm[name]; });

    const filterEvents = ((data) => {
        
        try{

            data = JSON.parse(data);
            
        }catch(error){ console.error('Não foi possível dar parse.',data); console.error(error); return false; }

        if(Array.isArray(data) === false){ console.error('Data não é array',data); }
        if(data.length !== 2){ console.error('Data length ('+data.length+') !== 2',data); }
        if(typeof data[0] !== 'string'){ console.error('Data[0] !== string',data); }

        if(eventsm[data[0]] !== undefined){ eventsm[data[0]](data[1]); }
        if(conf.enableLog === true){ logm.push(data); }

    });

    socket.addEventListener('message',(data) => { filterEvents(data.data); });
    socket.addEventListener('onclose',(data) => { filterEvents(data.data); });
    socket.addEventListener('onerror',(data) => { filterEvents(data.data); });
    socket.addEventListener('onopen',(data) => { filterEvents(data.data); });

    socket.filterEvents = filterEvents;
    socket.eventsm = eventsm;
    socket.logm = logm;
    
    return socket;

});

module.exports = socket;