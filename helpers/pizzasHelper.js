class pizzaHelper{
    static positionsNumber(text, entitiesNumbers){
        let positionsNumber = [];
        let index = 0;
        for(let i = 0; i < entitiesNumbers.length; i++){
            if(entitiesNumbers.length <= 1){
              if(text.indexOf(entitiesNumbers) >= 0)
              positionsNumber.push(text.indexOf(entitiesNumbers));
            }else{
              if(text.indexOf(entitiesNumbers[i]) >= 0)
              positionsNumber.push(text.indexOf(entitiesNumbers[i], index));
              index = text.indexOf(entitiesNumbers[i]) + 1
            }
        }
        return positionsNumber;
    }

    static positionsStringNumber(text, entitiesNumbers, positionsNumber){
        let stringNumbers = [];
        for(let i = 0; i < entitiesNumbers.length; i++){
            if(entitiesNumbers.length <= 1){
              stringNumbers.push(this.numberToExtenso(entitiesNumbers));
            }else{
              stringNumbers.push(this.numberToExtenso(entitiesNumbers[i]));
            }
        }

        for(let i = 0; i < stringNumbers.length; i++){
          let index = 0;
          if(stringNumbers.length <= 1){
            if(text.indexOf(stringNumbers) >= 0)
              positionsNumber.push(text.indexOf(stringNumbers));
          }else{
            if(text.indexOf(stringNumbers[i]) >= 0)
              positionsNumber.push(text.indexOf(stringNumbers[i], index));
              index = text.indexOf(entitiesNumbers[i]) + 1
          }
        }
        positionsNumber.sort();
        return positionsNumber;
    }

    static positionsObjects(text, entitiesObjects){
        let positionsObjects = [];
        for(let i = 0; i < entitiesObjects.length; i++){
            if(entitiesObjects.length <= 1){
              if(text.indexOf(entitiesObjects[0].toLowerCase()) >= 0)
                positionsObjects.push(text.indexOf(entitiesObjects[0].toLowerCase()));
            }else{
              if(text.indexOf(entitiesObjects[i].toLowerCase()) >= 0)
                positionsObjects.push(text.indexOf(entitiesObjects[i].toLowerCase()));
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
        for(let i = 0; i < positionsNumber.length; i++){
            let smallestDifference =  positionsObjects[0] - positionsNumber[i];
            indexPizza = 0;
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
          console.log("IndexPizza" + indexsPizza);
          for(let i = 0; i < positionsObjects.length; i++){
            let found = false;
            
            for(let j = 0; j < indexsPizza.length; j++){
              console.log("IndexPizza J " + indexsPizza[j]);
              console.log("I " + i);
              if(indexsPizza[j] == i){
                console.log("entro IF")
                numbersResult.push(entitiesNumbers[j]);
                found = true;
              }
            }
            if(!found){
              console.log("found: " + found)
              numbersResult.push(1);
            }
        }
        return numbersResult;
    }

    static numberToExtenso(num){
        console.log("entrou aqui")
        let u,d;
             
        let extenso = "", conexao;
        let unidade = Array.of("", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove");
        let dezena = Array.of("", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa");
        let dezenaespecial = Array.of("dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove");
             
        if (num >= 1 && num <= 99){
            
            d = num / 10;
            u = num % 10;
            console.log("if 1  d: " + d + "u: " + u)
            conexao = "";
            if (d >= 1 && u >= 1){
                console.log("if 2 d: " + d + "u: " + u)
                conexao = " e ";
            }
                  
            if (num >= 10 && num <= 19){
               
                extenso = dezenaespecial[ u ];
                console.log("if 3 extenso: " + extenso)
            } else if(num < 10){
                extenso = unidade[ u ];
                console.log("if 3 extenso: " + extenso)
            } else{
                extenso = dezena[ d ] + conexao + unidade[ u ];
                console.log("else 3 extenso: " + extenso)
            }
        }
        console.log("retornou")
        return (extenso);
    }
}
module.exports = pizzaHelper;