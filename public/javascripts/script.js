

/** Dodavanje slike na kod registracije  */
    $("#slika").on("change", function (e) {
    var reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = function (e) {
    $("#slika_pregled").attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
    });


/** Prikazi/Sakrij lozinku */
  var i = 0;
  var prikaziSakrij = () =>
  {
    

    if(i == 0)
    {  
        $("#logInLozinka").attr('type','text');
        i = 1;
    }
    else
    {
        $("#logInLozinka").attr('type','password');
        i = 0;
    }


  }