class orderHelper{
    static quatroQueijos(pizzas, numeros){
        let contQuatro = 0;
        for(let i = 0; i < pizzas.length; i++){
            if(pizzas[i] == "Quatro queijos"){
              if(numeros){
                if(numeros.length == 1 && numeros[0] == 4){
                  numeros = undefined;
                }
                for(let j = 0; j < numeros.length; j++){
                  if(numeros[j] == 4) contQuatro++;
                }
                if(contQuatro == 1){
                  for(let j = 0; j < numeros.length; j++){
                    if(numeros[j] == 4) {
                      numeros.splice(j, 1);
                    }
                  }
                }
                if(numeros.length >= pizzas.length && contQuatro > 1){
                  if(numeros[i + 1] == 4) {
                    numeros.splice(i + 1, 1);
                  }
                }
              }
            }
        }
      return numeros;
    }

}

module.exports = orderHelper;