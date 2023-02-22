//Código modificado de https://barcelonageeks.com/como-obtener-la-desviacion-estandar-de-una-matriz-de-numeros-usando-javascript/
function datosEstadisticos(arr){
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr)=>{
      return acc + curr
    }, 0) / arr.length;
     
    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k)=>{
      return (k - mean) ** 2
    })
    console.log(`La media es: ${mean} [DIAS]`);
     
    // Calculating the sum of updated array
   let sum = arr.reduce((acc, curr)=> acc + curr, 0);
    
   // Calculating the variance
   let variance = sum / arr.length
   console.log(`La varianza es: ${variance} [DIAS]`);
    
   // Returning the Standered deviation
   console.log(`La desviación estándar es: ${Math.sqrt(sum / arr.length)} [DIAS]`);
  }

fetch('https://api.datos.gob.mx/v1/inai.solicitudes')
  .then(response => response.json())
  .then(jsonRsponse => {
    let solicitudes = {};
    let totalDaysNacional=[];
    let totalDaysEstatales = {};
    let diasPorMedio={};
    //DEPENDENCIA CON MÁS SOLICITUDES
    jsonRsponse.results.forEach(obj => {
        if(obj.PAIS == 'México'){
            let fechaInicio = new Date('2003-06-12').getTime();
            let fechaFin    = new Date(`${obj.FECHARESPUESTA.substring(0,10).substring(6,10)}-${obj.FECHARESPUESTA.substring(0,10).substring(3,5)}-${obj.FECHARESPUESTA.substring(0,10).substring(0,2)}`).getTime();
            let diff = fechaFin - fechaInicio;
            totalDaysNacional.push(diff/(1000*60*60*24)); //millisegundos a dias
            if (totalDaysEstatales[obj.ESTADO]) {
                totalDaysEstatales[obj.ESTADO].push(diff/(1000*60*60*24));
            }
            else{
                totalDaysEstatales[obj.ESTADO]=[diff/(1000*60*60*24)];
            }
            if(solicitudes[obj.DEPENDENCIA]){
                solicitudes[obj.DEPENDENCIA]+=1;
            }
            else{
                solicitudes[obj.DEPENDENCIA]=1;
            }
            if(diasPorMedio[obj.MEDIOENTREGA]){
                diasPorMedio[obj.MEDIOENTREGA]+=diff/(1000*60*60*24);
            }
            else{
                diasPorMedio[obj.MEDIOENTREGA] = diff/(1000*60*60*24);
            }
        }
    });
    console.log("********************************************************************************************************************");
    let masSolicitudes = '';
    let cantidadMasSolicitudes = 0;
    for (const key in solicitudes) {
        if(solicitudes[key]>cantidadMasSolicitudes){
            cantidadMasSolicitudes = solicitudes[key];
            masSolicitudes = key;
        }
    }
    console.log(`La dependencia con más solicitudes es ${masSolicitudes} con: ${cantidadMasSolicitudes} solicitudes`);
    //TIEMPO DE RESPUESTA NACIONAL
    console.log("********************************************************************************************************************");
    console.log("A nivel Nacional");
    datosEstadisticos(totalDaysNacional);
    //TIEMPO DE RESPUESTA ESTATAL
    console.log("********************************************************************************************************************");
    console.log("A nivel Estatal");
    for (const key in totalDaysEstatales) {
        console.log(`\n Estado: ${key}`);
        datosEstadisticos(totalDaysEstatales[key]);
    }
    console.log("********************************************************************************************************************");
    let menosDiasPorMedio = Object.entries(diasPorMedio).reduce(function(prev, curr){
        return prev[1] < curr[1] ? prev : curr;
    });
    console.log(`El medio de entrega con menos tiempo de de resolución es: ${menosDiasPorMedio[0]}`);
  });