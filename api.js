fetch('https://api.datos.gob.mx/v1/inai.solicitudes')
  .then(response => response.json())
  .then(jsonRsponse => {
    let solicitudes = {};
    jsonRsponse.results.forEach(obj => {
        if(solicitudes[obj.DEPENDENCIA]){
            solicitudes[obj.DEPENDENCIA]+=1;
        }
        else{
            solicitudes[obj.DEPENDENCIA]=1;
        }
    });
    //console.log(jsonRsponse.results[0]);
    let totalDays=0;
    jsonRsponse.results.forEach(obj => {
        var first = obj.FECHASOLICITUD;
        var second = obj.FECHARESPUESTA;
        
        var x = new Date(first);
        var y = new Date(second);
        
            
        const diffInDays = Math.floor((x - y) / (1000 * 60 * 60 * 24));
        if(diffInDays !== NaN);x
            totalDays+=diffInDays;
    });
    console.log(totalDays);
  });