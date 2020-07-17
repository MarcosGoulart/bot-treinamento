class orderHelper{
    static quatroQueijos(pizzas, numeros){
        let contQuatro = 0;
        console.log(pizzas);
        console.log(numeros);
        if(pizzas){
          for(let i = 0; i < pizzas.length; i++){
            console.log("1")
              if(pizzas[i] == "Quatro queijos"){
                console.log("2")
                if(numeros){
                  console.log("3")
                  if(numeros.length == 1 && numeros[0] == 4){
                    console.log("4")
                    numeros = [];
                  }
                  if(numeros != []){
                    for(let j = 0; j < numeros.length; j++){
                      console.log("5")
                      if(numeros[j] == 4) {
                        console.log("6")
                        contQuatro++;
                      }
                    }
                  
                    if(contQuatro == 1){
                      console.log("7")
                      for(let j = 0; j < numeros.length; j++){
                        console.log("8")
                        if(numeros[j] == 4) {
                          console.log("9")
                          numeros.splice(j, 1);
                        }
                      }
                    }
                    if(numeros.length >= pizzas.length && contQuatro > 1){
                      console.log("10")
                      if(pizzas.length - 1 == i){
                        console.log("11")
                        numeros.splice(i, 1);
                      }
                      if(numeros[i + 1] == 4) {
                        console.log("12")
                        numeros.splice(i + 1, 1);
                      }
                    }
                  }
                }
              }
          }
        }
      return numeros;
    }

}

module.exports = orderHelper;