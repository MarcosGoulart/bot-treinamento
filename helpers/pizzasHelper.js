class pizzaHelper{

    static positionsObjects(instancesObjects, endIndex = false){
        let positionsObjects = [];
        if(instancesObjects){
          if(!endIndex){    
            for(let i = 0; i < instancesObjects.length; i++){
              positionsObjects.push(instancesObjects[i].startIndex);
            }
          }else{
            for(let i = 0; i < instancesObjects.length; i++){
              positionsObjects.push(instancesObjects[i].endIndex);
            }
          }
         
        }
        return positionsObjects;
    }

    static numbersResult(positionsNumber, positionsObjects, entitiesNumbers){
        let numbersResult = [];
        let indexsNumber = [];
        let indexsPizza = [];
        let indexPizza;
        console.log("ENTROU NUMBER RESULT")
        console.log("Entrada " + entitiesNumbers)
        console.log("positionsObjects " + positionsObjects)
        console.log("positionsNumber " + positionsNumber)
        if(positionsNumber){
          for(let i = 0; i < positionsNumber.length; i++){
            let smallestDifference =  -1;
            indexPizza = undefined;
            console.log("smallestDifference " + smallestDifference) 
            for(let j = 0; j < positionsObjects.length; j++){
              let difference = positionsObjects[j] - positionsNumber[i];
              console.log("difference " + difference)
              if( (difference > 0) && ( difference < smallestDifference || smallestDifference < 0)) {
                smallestDifference = difference;
                indexPizza = j;
                console.log("smallestDifferenceIF " + smallestDifference)
                console.log("J " + j)
              }
            }
            indexsPizza.push(indexPizza); 
            indexsNumber.push(i);
          }
        }
        console.log("IndexPizza " + indexsPizza);
        for(let i = 0; i < positionsObjects.length; i++){
          let found = false;
              
          for(let j = 0; j < indexsPizza.length; j++){
            console.log("IndexPizza J " + indexsPizza[j]);
            console.log("I " + i);
            if(indexsPizza[j] == i){
              console.log("entro IF "+entitiesNumbers)
              console.log("entro IF J "+j)
              if(entitiesNumbers[j]){
                console.log("IF: " + entitiesNumbers[j])
                numbersResult.push(entitiesNumbers[j]);
              }
              found = true;
            }
          }
          console.log("found: " + found)
          if(!found){
            numbersResult.push(1);
          }
        }
        console.log("result " + numbersResult)
        return numbersResult;
    }

    static tamanhosResult(positionsTamanho, positionsPizzasStart, positionsPizzasEnd, entitiesTamanho){
      let tamanhosResult = [];
      let indexsTamanho = [];
      let indexsPizza = [];
      let indexPizza;
      console.log("ENTROU TAMANHO RESULT")
      console.log("Entrada " + entitiesTamanho)
      console.log("positionsTamanho " + positionsTamanho)
      console.log("positionsPizzaStart" + positionsPizzasStart)
      console.log("positionsPizzasEnd: " + positionsPizzasEnd)

      if(positionsTamanho){
        for(let i = 0; i < positionsTamanho.length; i++){
            let smallestDifference = Number.MAX_VALUE;
            indexPizza = undefined;
            console.log("smallestDifference " + smallestDifference) 
            for(let j = 0; j < positionsPizzasStart.length; j++){
              let differenceStart = positionsPizzasStart[j] - positionsTamanho[i];
              if(differenceStart < 0){
                differenceStart = differenceStart * -1; 
              }
              let differenceEnd = positionsPizzasEnd[j] - positionsTamanho[i];
              if(differenceEnd < 0){
                differenceEnd = differenceEnd * -1; 
              }
              let difference;
              if(differenceEnd < differenceStart){
                difference = differenceEnd;
              }else{
                difference = differenceStart;
              }
              console.log("difference " + difference)
              if( (difference > 0) && ( difference < smallestDifference || smallestDifference < 0)) {
                smallestDifference = difference;
                indexPizza = j;
                console.log("smallestDifferenceIF " + smallestDifference)
                console.log("J " + j)
              }
            }
            indexsPizza.push(indexPizza); 
            indexsTamanho.push(i);
          }
          console.log("IndexPizza " + indexsPizza);
          for(let i = 0; i < positionsPizzasStart.length; i++){
            let found = false;
            
            for(let j = 0; j < indexsPizza.length; j++){
              console.log("IndexPizza J " + indexsPizza[j]);
              console.log("I " + i);
              if(indexsPizza[j] == i){
                console.log("entro IF "+entitiesTamanho)
                console.log("entro IF J "+j)
                if(entitiesTamanho[j]){
                  console.log("IF: " + entitiesTamanho[j])
                  tamanhosResult.push(entitiesTamanho[j]);
                }
                found = true;
              }
            }
            console.log("found: " + found)
            if(!found){
              tamanhosResult.push(0);
            }
        }
      }
      console.log("result " + tamanhosResult)
      return tamanhosResult;
  }

    static numberToExtenso(num){
        //console.log("entrou aqui")
        let u,d;
             
        let extenso = "", conexao;
        let unidade = Array.of("", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove");
        let dezena = Array.of("", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa");
        let dezenaespecial = Array.of("dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove");
             
        if (num >= 1 && num <= 99){
            
            d = num / 10;
            u = num % 10;
            //console.log("if 1  d: " + d + "u: " + u)
            conexao = "";
            if (d >= 1 && u >= 1){
                //console.log("if 2 d: " + d + "u: " + u)
                conexao = " e ";
            }
                  
            if (num >= 10 && num <= 19){
               
                extenso = dezenaespecial[ u ];
                //console.log("if 3 extenso: " + extenso)
            } else if(num < 10){
                extenso = unidade[ u ];
                //console.log("if 3 extenso: " + extenso)
            } else{
                extenso = dezena[ d ] + conexao + unidade[ u ];
               // console.log("else 3 extenso: " + extenso)
            }
        }
        //console.log("retornou")
        return (extenso);
    }
}
module.exports = pizzaHelper;