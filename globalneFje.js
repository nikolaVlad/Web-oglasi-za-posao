/** GLOBALNE FUNKCIJE */

/*
* Funkcija za pretreživanje nekoliko reči u nekoliko kolona iz tabele. 
* Params : @nizKolona - String niz koji treba da sadrži imena tabela u kojima će
* se vršiti pretraživanje.
* @nizReci - String niz koji predstavlaj reći koje će biti pretraživane u kolonama.
*/
module.exports.stringZaPretrazivanje = (nizKolna, nizReci) =>
{
    var str = '';
    for(kolona of nizKolna)
    {
        for(rec of nizReci)
        {
            str += `\n` + kolona + ` LIKE "` + new String('%' + rec + '%') + `" OR`;
        }
    }


    return str.substr(0,str.length-3);
}



















